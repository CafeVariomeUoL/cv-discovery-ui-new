import React from 'react';
import { Radio } from 'antd';
import { Grid, GridColumn } from '@atlaskit/page';
import { mkAttrQuery } from './utils';
import './ButtonGroup.css'



export default class ButtonGroupPickerBuilder extends React.Component {


	state = {
		value: '',
		options: [], 
	}

	mkQuery = state => {
		return mkAttrQuery(this.props.attribute, (v)=>v, "is", state.value)
	}

	componentDidMount() {

		fetch(
	      process.env.REACT_APP_API_URL+"/discovery/getAttributeValues", {
	        method:'POST',
	        headers: {
	          'Access-Control-Allow-Origin': '*',
	          'Content-Type': 'application/json',
	          'Accept': 'application/json',
	          'X-Requested-With': 'XMLHttpRequest'
	        },
	        body: JSON.stringify({attribute: this.props.attribute})
	      })
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result);
	           if(result) this.setState({options: result});
	        },
	        // Note: it's important to handle errors here
	        // instead of a catch() block so that we don't swallow
	        // exceptions from actual bugs in components.
	        (error) => {
	          console.log(error)
	        })

        this.props.setQuery(this.mkQuery(this.state));

	}

	handleChange = e =>  {
		this.setState({value: e.target.value});
        this.props.setQuery(this.mkQuery({value: e.target.value}));
        console.log(this.state)
	}

	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>{this.props.label}</h3>
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
