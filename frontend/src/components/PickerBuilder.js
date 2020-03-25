import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { DatePicker } from '@atlaskit/datetime-picker';
import { mkAttrQuery } from './utils';


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

export default class PickerBuilder extends React.Component {
	operator_opts = this.props.valueType === "str" 
								? opts : [...opts, ...opts_num];

	current_date = new Date().toUTCString();

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
	      options={this.props.options}
	      onChange={this.handleChange('value')}
	  	/>
		}
	}

	state = {
		op: this.operator_opts[0].value,
		value: ''
	}

	mkQuery = state => {
		return mkAttrQuery(this.props.queryId, (v)=>v, state.op, state.value)
	}

	componentDidMount() {
		this.props.setQuery(this.mkQuery(this.state));
		console.log(this.props)
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
