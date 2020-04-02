import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { DatePicker } from '@atlaskit/datetime-picker';
import { mkAttrQuery } from './utils';


const opts = [
	      { label: 'IS', value: 'is' },
	      { label: 'IS NOT', value: 'is not' },
	      { label: '=', value: 'is' },
	      { label: '≠', value: 'is not' },
	    ];

export default class PickerBuilder extends React.Component {


	state = {
		op: opts[0].value,
		value: '',
		options: [], 
	}

	mkQuery = state => {
		return mkAttrQuery(this.props.attribute, (v)=>v, state.op, state.value)
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
	           if(result) this.setState({options: result.map((e) => {return {label:e, value:e}})});
	        },
	        // Note: it's important to handle errors here
	        // instead of a catch() block so that we don't swallow
	        // exceptions from actual bugs in components.
	        (error) => {
	          console.log(error)
	        })

        this.props.setQuery(this.mkQuery(this.state));

	}

	handleChange = prop_name => e =>  {
		const newState = {...this.state};
		newState[prop_name] = e.value;
		
    	this.setState(newState);
    	this.props.setQuery(this.mkQuery(newState));
	}

	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>{this.props.label}</h3>
		  <Grid>
		  	<GridColumn medium={2}>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={opts}
            defaultValue={opts[0]}
            onChange={this.handleChange('op')} 
            // value={opts[0]}
          />
		    </GridColumn>
		    <GridColumn>
		      <Select
		      className="single-select"
		      classNamePrefix="react-select"
		      options={this.state.options}
		      onChange={this.handleChange('value')}
		  	/>
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
