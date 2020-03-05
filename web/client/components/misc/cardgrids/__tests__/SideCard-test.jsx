/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');

const expect = require('expect');
const SideCard = require('../SideCard');
describe('SideCard component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('SideCard rendering with defaults', () => {
        ReactDOM.render(<SideCard />, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.mapstore-side-card');
        expect(el).toBeTruthy();
        expect(container.querySelector('.selected')).toBeFalsy();
    });
    it('SideCard selected', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.selected');
        expect(el).toBeTruthy();
    });

    it('SideCard show/hide preview node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let preview = container.querySelector('.mapstore-side-preview');
        expect(preview).toBeFalsy();

        ReactDOM.render(<SideCard preview={'icon'} selected/>, document.getElementById("container"));

        preview = container.querySelector('.mapstore-side-preview');
        expect(preview).toBeTruthy();
        preview.innerHTML = 'icon';
    });


    it('SideCard show/hide caption node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let caption = container.querySelector('.mapstore-side-caption');
        expect(caption).toBeFalsy();

        ReactDOM.render(<SideCard caption={'caption'} selected/>, document.getElementById("container"));

        caption = container.querySelector('.mapstore-side-card-caption');
        expect(caption).toBeTruthy();
        caption.innerHTML = 'caption';
    });

    it('SideCard show/hide caption node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let caption = container.querySelector('.mapstore-side-caption');
        expect(caption).toBeFalsy();

        ReactDOM.render(<SideCard caption={'caption'} selected/>, document.getElementById("container"));

        caption = container.querySelector('.mapstore-side-card-caption');
        expect(caption).toBeTruthy();
        caption.innerHTML = 'caption';
    });

    it('SideCard show/hide body node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let body = container.querySelector('.ms-body');
        expect(body).toBeFalsy();

        ReactDOM.render(<SideCard body={'body'} selected/>, document.getElementById("container"));

        body = container.querySelector('.ms-body');
        expect(body).toBeTruthy();
        body.innerHTML = 'body';
    });
    it('SideCard test mouse events', () => {
        const actions = {
            onMouseEnter: () => {},
            onMouseLeave: () => {}
        };
        const spyMouseEnter = expect.spyOn(actions, 'onMouseEnter');
        const spyMouseLeave = expect.spyOn(actions, 'onMouseLeave');
        ReactDOM.render(<SideCard selected {...actions} />, document.getElementById("container"));
        const container = document.getElementById('container');
        let card = container.querySelector('.mapstore-side-card');
        expect(card).toBeTruthy();

        ReactTestUtils.Simulate.mouseEnter(card);
        expect(spyMouseEnter).toHaveBeenCalled();
        ReactTestUtils.Simulate.mouseLeave(card);
        expect(spyMouseLeave).toHaveBeenCalled();
    });

    it('SideCard without preview and title and description, with only caption', () => {
        ReactDOM.render(<SideCard caption={'caption'} />, document.getElementById("container"));
        const container = document.getElementById('container');
        let body = container.querySelector('.ms-body');
        let titleClassName = container.querySelector('.mapstore-side-card-title');
        let descClassName = container.querySelector('.mapstore-side-card-desc');
        let previewClassName = container.querySelector('.mapstore-side-preview');
        expect(body).toBeFalsy();
        expect(titleClassName).toBeFalsy();
        expect(descClassName).toBeFalsy();
        expect(previewClassName).toBeFalsy();
    });
    it('SideCard witht preview and title and description, with only caption', () => {
        ReactDOM.render(<SideCard caption={'caption'} description = "desc" title="title" preview={<img src=""/>} />, document.getElementById("container"));
        const container = document.getElementById('container');
        let body = container.querySelector('.ms-body');
        let titleClassName = container.querySelector('.mapstore-side-card-title');
        let descClassName = container.querySelector('.mapstore-side-card-desc');
        let previewClassName = container.querySelector('.mapstore-side-preview');
        expect(body).toBeFalsy();
        expect(titleClassName).toBeTruthy();
        expect(descClassName).toBeTruthy();
        expect(previewClassName).toBeTruthy();
    });
});
