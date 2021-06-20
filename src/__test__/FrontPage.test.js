/* eslint-disable */
import React from "react";
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from "react-dom";
import FrontPage from '../FrontPage';
import store from '../store/store';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('test front page', function() {
    it("should have a title", function() {
        act(() => {
            render(<Provider store={store}><Router><FrontPage widget="Login" /></Router></Provider>, container)
        })
    })
})