import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import DiscoveryPage from '../pages/DiscoveryPage';
import DiscoveryPageGrid from '../pages/DiscoveryPageGrid';
// import SettingsPage from '../pages/SettingsPage';
import '@atlaskit/css-reset';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'


export default class MainRouter extends Component {

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/:id" component={DiscoveryPageGrid} />
        </Switch>
      </Router>
    );
  }
}