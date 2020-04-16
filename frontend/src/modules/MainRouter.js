import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';

import DiscoveryPage from '../pages/DiscoveryPage';
import DiscoveryPageGrid from '../pages/DiscoveryPageGrid';
import SettingsPage from '../pages/SettingsPage';
import '@atlaskit/css-reset';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});

export default class MainRouter extends Component {
  constructor() {
    super();
    this.state = {
      navOpenState: {
        isOpen: true,
        width: 304,
      }
    }
  }

  getChildContext () {
    return {
      navOpenState: this.state.navOpenState,
    };
  }

  onNavResize = (navOpenState) => {
    this.setState({
      navOpenState,
    });
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/:id" component={DiscoveryPageGrid} />
        </Switch>
      </Router>
    );
  }
}

MainRouter.childContextTypes = {
  navOpenState: PropTypes.object,
}
