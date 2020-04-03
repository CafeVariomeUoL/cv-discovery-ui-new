import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { DatePicker } from '@atlaskit/datetime-picker';
import { mkAttrQuery } from '../utils/utils';


const opts = [
	      { label: 'IS', value: 'is' },
	      { label: 'IS LIKE', value: 'is like' },
	      { label: 'IS NOT', value: 'is not' },
	      { label: 'IS NOT LIKE', value: 'is not like' },
	      { label: '=', value: 'is' },
	      { label: '≠', value: 'is not' },
	    ];

const opts_num = [
	      { label: '<', value: '<' },
	      { label: '>', value: '>' },
	      { label: '<=', value: '<=' },
	      { label: '>=', value: '>=' },
	    ];

export default class ValueBuilder extends React.Component {
	operator_opts = this.props.valueType === "str" 
								? opts : [...opts, ...opts_num];

	currentdate = new Date().toUTCString();

	inputComponent = () => {
		if (this.props.arbitraryInput) {
			if (this.props.valueType === "datetime"){
				return <DatePicker
					onChange={this.handleChange('value')}
					defaultValue={this.current_date}
					locale={"en-GB"}
				/>
			} else {
				return <Textfield
		      name="value-low"
		      onChange={this.handleChange('value')} 
		    />
			}
		} else {
			return <Select
	      className="single-select"
	      classNamePrefix="react-select"
	      options={this.state.options}
	      onChange={this.handleChange('value')}
	  	/>
		}
	}

	state = {
		op: this.operator_opts[0].value,
		value: '',
		options: [], 
	}

	mkQuery = state => {
		return mkAttrQuery(this.props.attribute, (v)=>v, state.op, state.value)
	}

	componentDidMount() {
		// this.props.setQuery(this.mkQuery(this.state));
		// console.log(this.props)

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

	    console.log("setting query", this.mkQuery(this.state))
        this.props.setQuery(this.mkQuery(this.state));

	}

	handleChange = prop_name => e =>  {
		const newState = {...this.state};
		if (prop_name === 'op' || !this.props.arbitraryInput){
			newState[prop_name] = e.value;
		}
		else {
			if(this.props.valueType === "datetime") {
				newState[prop_name] = e;
			} else {
				newState[prop_name] = e.target.value;
			}
		}
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
            options={this.operator_opts}
            defaultValue={this.operator_opts[0]}
            onChange={this.handleChange('op')} 
            // value={opts[0]}
          />
		    </GridColumn>
		    <GridColumn>
		      {	this.inputComponent() }
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
