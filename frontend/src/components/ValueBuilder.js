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

	componentWillUnmount() {
	    this.props.deleteQuery();
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
		  <div>
			  {this.props.label_position !== 'left' && <h3>{this.props.label?this.props.label:'<Label>'}</h3>}
			  <div style={{display:'flex', paddingTop: '0.6em'}}>
			    {this.props.label_position === 'left' && 
			    <div className="label-left">
			   		<h5>{this.props.label?this.props.label:'<Label>'}</h5>
			   	</div>}
			  	<div style={{minWidth:'90px', marginRight:'5px'}}>
		           <Select
		            className="single-select"
		          	classNamePrefix="react-select"
		          	menuPortalTarget={document.body}
		            styles={{
		                  menuPortal: base => ({
		                    ...base,
		                    zIndex: 9999,
		                  }),
		                }}
		            options={this.operator_opts}
		            defaultValue={this.operator_opts[0]}
		            onChange={this.handleChange('op')} 
		            // value={opts[0]}
		          />
				   </div> 
				   <div style={{flexGrow: 4}}>
				      <Textfield
					      name="value-low"
					      onChange={this.handleChange('value')} 
					    />
			  	</div>

			  </div>



		  </div>
		);
	}
}
