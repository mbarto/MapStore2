const {createStore, combineReducers, applyMiddleware} = require('redux');

const thunkMiddleware = require('redux-thunk');
const mapConfig = require('../../../reducers/config');

 // reducers
const reducers = combineReducers({
    mapConfig
});

// compose middleware(s) to createStore
const finalCreateStore = applyMiddleware(thunkMiddleware)(createStore);

// export the store with the given reducers (and middleware applied)
module.exports = finalCreateStore(reducers, {});
