import React from 'react';

export default class EmptyBuilder extends React.Component {
	
	render() {
		return (
		  <div class={this.props.nohrule ? "": "hrule"}>
		  <h3 style={{paddingBottom: '0.5em'}}>{this.props.label?this.props.label:''}</h3>
		  </div>
		);
	}
}
