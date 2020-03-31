import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import App from './App';
import DiscoveryPage from '../pages/DiscoveryPage';
import SettingsPage from '../pages/SettingsPage';


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

  appWithPersistentNav = () => (props) => (
    <App
      onNavResize={this.onNavResize}
      {...props}
    />
  )

  onNavResize = (navOpenState) => {
    this.setState({
      navOpenState,
    });
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/settings/:id" component={SettingsPage} />
          <Route path="/:id" component={DiscoveryPage} />
        </Switch>
      </Router>
    );
  }
}

MainRouter.childContextTypes = {
  navOpenState: PropTypes.object,
}
