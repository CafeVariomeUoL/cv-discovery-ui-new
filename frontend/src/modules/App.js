import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Modal from '@atlaskit/modal-dialog';
import Page from '@atlaskit/page';
import '@atlaskit/css-reset';


export default class App extends Component {
  render() {
    return (
      <div>
        <Page>
          {this.props.children}
        </Page>
      </div>
    );
  }
}
