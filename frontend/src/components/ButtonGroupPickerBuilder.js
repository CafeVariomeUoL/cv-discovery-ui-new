import React from 'react';
import { Radio } from 'antd';
import { Grid, GridColumn } from '@atlaskit/page';
import { mkAttrQuery } from '../utils/utils';
import { getAttributeValues } from '../utils/api'

import './ButtonGroup.css'



export default class ButtonGroupPickerBuilder extends React.Component {


	state = {
		value: '',
		options: [], 
	}

	mkQuery = state => {
		return mkAttrQuery(this.props.attribute, (v)=>v, "is", state.value)
	}

	// componentDidMount() {

	// 	if(this.props.attribute)  getAttributeValues(this.props.attribute,
	//       (result) => {
	//         if(result) this.setState((oldState) => 
	//           {return {...oldState, options: result}});
	//       },
	//       (error) => {
	//         console.log(error)
	//       }
	//     )

 //        this.props.setQuery(this.mkQuery(this.state));

	// }

	componentDidMount() {
		this.loadProps(this.props, true)
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
        console.log(this.state)
	}

	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>{this.props.label?this.props.label:'<Label>'}</h3>
		  <Grid>
		  	<GridColumn>
         	    <Radio.Group onChange={this.handleChange} defaultValue="" buttonStyle="solid">
         	    	<Radio.Button value="" key="any">Any</Radio.Button>
         	    	{this.state.options.map(e => {return <Radio.Button value={e} key={e}>{e}</Radio.Button>})}
         	    </Radio.Group>
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
