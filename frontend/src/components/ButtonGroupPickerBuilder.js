import React from 'react';
import { Radio } from 'antd';
import { Grid, GridColumn } from '@atlaskit/page';
import { mkAttrQuery } from '../utils/utils';
import { getAttributeValues } from '../utils/api'

import './ButtonGroup.css'
// import ReactResizeDetector from 'react-resize-detector';



export default class ButtonGroupPickerBuilder extends React.Component {


	state = {
		value: '',
		options: [], 
	}


	mkQuery = state => {
		return mkAttrQuery(this.props.attribute, (v)=>v, "is", state.value)
	}


	componentDidMount() {
		this.loadProps(this.props, true);
	}

	componentWillReceiveProps(nextProps){
		this.loadProps(nextProps)
	}

	loadProps(nextProps, force = false){
		if((force && nextProps.attribute) || (nextProps.attribute && this.props.attribute !== nextProps.attribute)) {
			getAttributeValues(nextProps.attribute,
		        (result) => {
		          if(result) this.setState((oldState) => 
	          		{return {...oldState, options: result}});
		        },
		        // Note: it's important to handle errors here
		        // instead of a catch() block so that we don't swallow
		        // exceptions from actual bugs in components.
		        (error) => {
		          console.log(error)
		        })

	        nextProps.setQuery(this.mkQuery(this.state));
	    }
	}




	handleChange = e =>  {
		this.setState({value: e.target.value});
        this.props.setQuery(this.mkQuery({value: e.target.value}));
        // console.log(this.state)
	}

	
	render() {

		return (
	    // <ReactResizeDetector handleHeight onResize={(width, height) => this.props.onHeightChange(height)}>
		  <div>
		  {this.props.label_position !== 'left' && <h3>{this.props.label?this.props.label:'<Label>'}</h3>}
			  <div style={{display:'flex', paddingTop: '0.6em'}}>
			    {this.props.label_position === 'left' && 
			    <div className="label-left">
			   		<h5>{this.props.label?this.props.label:'<Label>'}</h5>
			   	</div>}
			   	<div style={{marginTop:'3px'}}>
	         	    <Radio.Group onChange={this.handleChange} ref="myDiv" defaultValue="" buttonStyle="solid">
	         	    	<Radio.Button value="" key="any">Any</Radio.Button>
	         	    	{this.state.options.map(e => {return <Radio.Button value={e} key={e}>
	         	    		<span style={{
					        	whiteSpace: 'nowrap',
					        	overflow: 'hidden',
					        	display: 'inline-block',
					        	maxWidth:'200px',
					        	float: 'left',
					        	paddingTop: '1px',
					        	textOverflow:'ellipsis'
					        }}>{e}</span>
				        </Radio.Button>})}
	         	    </Radio.Group>
		    	</div>
		 	 </div>
		 </div>
		// </ReactResizeDetector>
		);
	}
}
