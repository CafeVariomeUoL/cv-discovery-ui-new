import React from 'react';

export default class EmptyBuilder extends React.Component {
	componentDidMount() {
		this.props.setQuery({
			operator:this.props.operator,
			children:[]
		});
	}

	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h2>{this.props.label?this.props.label:'<Label>'}</h2>
		  </div>
		);
	}
}
