const express = require('express');
const session = require('express-session');
const request = require('request');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const castArray = require('lodash').castArray;
const Engine = require('json-rules-engine').Engine;

const Db = require('tingodb')({
    cacheMaxObjSize: 10000
}).Db;

const engine = new Engine();

engine.addRule({
  conditions: {
    all: [{
        fact: 'headers.contentType',
        operator: 'in',
        value: ['application/json', 'text/html', 'text/xml', 'application/vnd.ogc.wms_xml']
    }]
  },
  event: {  // define the event to fire when the conditions evaluate truthy
    type: 'success'
  }
});

passport.use('basic', new BasicStrategy(
   function(username, password, done) {
       const db = new Db('server/db', {});
       db.collection("users").findOne({ name: username }, function(err, user) {
           db.close();
           if (err) { return done(err); }
           if (!user) { return done(null, false); }
           return done(null, user);
       });
   }
 ));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    const db = new Db('server/db', {});
    db.collection("users").findOne({id: id}, function(err, user) {
        db.close();
        if (err) { return cb(err); }
        cb(null, user);
    });
});

const app = express();

app.use(express.static('web/client'));
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/proxy', function(req, res) {
    const url = req.query.url;
    req.pipe(request(url))
        .on('response', function(response) {
            response.pause();
            engine.run({
                url: url,
                "headers.contentType": response.headers['content-type'].split(';')[0]
            }).then((events) => { // run() returns events with truthy conditions
                if (events.length > 0 && events[0].type === 'success') {
                    response.resume();
                    res.writeHead(response.statusCode, response.headers);
                    response.pipe(res);
                } else {
                    res.status(403).send("Not authorized");
                }
            }).catch(() => {
                res.status(403).send("Not authorized");
            });
        })
        .on('error', function(err) {
            res.status(500).send(err);
        });
    /*req.pipe(request.head(url, function(headerr, head) {
        engine.run({
            url: url,
            "headers.contentType": head.headers['content-type'].split(';')[0]
        }).then((events) => { // run() returns events with truthy conditions
            if (events.length > 0) {
                req.pipe(request(url))
                    .on('response', function(response) {
                        res.writeHead(response.statusCode, response.headers);
                        response.pipe(res);
                    })
                    .on('error', function(err) {
                        res.status(500).send(err);
                    });
            } else {
                res.status(403).send("Not authorized");
            }
        }).catch(() => {
            res.status(403).send("Not authorized");
        });
    }));*/
});

app.get('/rest/geostore/extjs/resource/:id', function(req, res) {
    const db = new Db('server/db', {});
    db.collection("maps").findOne({id: parseInt(req.params.id, 10)}, function(err, map) {
        if (err) {
            res.status(500).send('Cannot read map metadata: ' + req.params.id);
        } else {
            res.send(JSON.stringify(map.metadata || {}));
        }

    });
});

app.get('/rest/geostore/data/:id', function(req, res) {
    const db = new Db('server/db', {});
    db.collection("maps").findOne({id: parseInt(req.params.id, 10)}, function(err, map) {
        if (err) {
            res.status(500).send('Cannot read map: ' + req.params.id);
        } else {
            res.send(JSON.stringify(map.data || {}));
        }

    });
});

app.get('/rest/geostore/extjs/search/category/MAP/:filter/*', function(req, res) {
    const filter = req.params.filter.substring(1, req.params.filter.length - 1);
    const start = parseInt(req.query.start, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 20;
    const baseQuery = filter === '*' ? null : {
        $or: [
                {name: { $regex: filter, $options: "i" }},
                {description: { $regex: filter, $options: "i" }}
        ]
    };
    const userQuery = req.user && req.user.role === 'USER' ? {owner: req.user.name} : null;
    var query = {};
    if (baseQuery && userQuery) {
        query = {
            $and: [baseQuery, userQuery]
        };
    } else if (baseQuery) {
        query = baseQuery;
    } else if (userQuery) {
        query = userQuery;
    }
    const db = new Db('server/db', {});
    db.collection("maps").find(query).count(function(err, total) {
        if (err) {
            res.status(500).send('Cannot count maps: ' + err);
        } else {
            db.collection("maps").find(query).skip(start).limit(limit).toArray(function(err2, maps) {
                if (err2) {
                    res.status(500).send('Cannot read maps: ' + err);
                } else {
                    res.send(JSON.stringify({success: true, totalCount: total, results: maps}));
                }

            });
        }
        db.close();
    });
});

app.get('/rest/geostore/users/user/details',
  passport.authenticate('basic'),
  function(req, res) {
      if (req.user) {
          res.send(JSON.stringify({
              User: {
                  attribute: [],
                  groups: castArray(req.user.groupsNames).map(function(g) {
                      return {
                          name: g
                      };
                  }),
                  enabled: true,
                  id: req.user.id,
                  name: req.user.name,
                  role: req.user.role
              }
          }));
      } else {
          res.status(403).send("Authentication failed");
      }
  });

app.listen(8080, function() {
    console.log('MapStore2 started on port 8080');
});
