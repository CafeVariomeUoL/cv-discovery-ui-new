import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { DatePicker } from '@atlaskit/datetime-picker';
import { mkAttrQuery } from '../utils/utils';
import { getAttributeValues } from '../utils/api'


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
		this.loadProps(this.props, true)
	}

	componentWillReceiveProps(nextProps){
		this.loadProps(nextProps)
	}

	componentWillUnmount() {
	    this.props.deleteQuery();
	}

	loadProps(nextProps, force = false){
		if((force && nextProps.attribute) || (nextProps.attribute && this.props.attribute !== nextProps.attribute)) {
			getAttributeValues(this.props.settings_id, nextProps.attribute,
		        (result) => {
		          console.log(result);
		           if(result) this.setState({options: result.map((e) => {return {key:e, label:e, value:e}})});
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

	handleChange = prop_name => e =>  {
		const newState = {...this.state};
		newState[prop_name] = e.value;
		
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
		            options={opts}
		            defaultValue={opts[0]}
		            onChange={this.handleChange('op')} 
		            // value={opts[0]}
		          />
				   </div> 
				   <div style={{flexGrow: 4}}>
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
			      options={this.state.options}
			      onChange={this.handleChange('value')}
			  	/>
			  	</div>

			  </div>
		  </div>
		);
	}
}
