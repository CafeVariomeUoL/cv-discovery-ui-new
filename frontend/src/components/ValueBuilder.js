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


	state = {
		op: this.operator_opts[0].value,
		value: '',
		options: [], 
	}

	mkQuery = state => {
		return mkAttrQuery(this.props.attribute, (v)=>v, state.op, state.value)
	}

	componentDidMount() {

	    // console.log("setting query", this.mkQuery(this.state))
        this.props.setQuery(this.mkQuery(this.state));

	}

	handleChange = prop_name => e =>  {
		const newState = {...this.state};
		if (prop_name === 'op'){
			newState[prop_name] = e.value;
		}
		else {
			newState[prop_name] = e.target.value;
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
		      <Textfield
		      name="value-low"
		      onChange={this.handleChange('value')} 
		    />
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
