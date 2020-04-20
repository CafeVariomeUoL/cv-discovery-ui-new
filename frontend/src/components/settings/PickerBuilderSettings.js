import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { mkLabel, getType, label_position } from '../../utils/utils'
import ToggleStateless from '@atlaskit/toggle';

import { getAttributes } from '../../utils/api'



export default class PickerBuilderSettings extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			label:'', 
			label_position: 'top',
			attribute:{},
			load_vals_dynamically:false
		},
		attributes: []
	}


	componentDidMount() {
		getAttributes(
	        (result) => {
	          this.setState({
	            attributes: result.map(e => {return {label:mkLabel(e.attribute), value:e.attribute}})
	          });
	        },
	        (error) => {
	          this.setState({
	            error: error
	          });
	        }
	    )
	}


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};
		if (prop_name === 'attribute' || prop_name === 'label_position'){
			newData[prop_name] = e.value;
		} else if (prop_name === 'load_vals_dynamically'){
			newData[prop_name] = !newData[prop_name];
		}
		else {
			newData[prop_name] = e.target.value;
		}
    	this.setState({data: newData});
    	this.props.setData(newData);
	}


	
	render() {
		return (	  
		  <Grid>
		  <GridColumn medium={5}>
		  <h5 style={{paddingBottom: '0.5em'}}>Attribute:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            menuPortalTarget={document.body}
            styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
            defaultValue={{label:mkLabel(this.state.data.attribute), value:this.state.data.attribute}}
            onChange={this.handleChange('attribute')} 
          />
		    </GridColumn>
		  	<GridColumn medium={5}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Label:</h5>
		  <Textfield
		      name="label"
		      defaultValue={this.state.data.label}
		      onChange={this.handleChange('label')} 
		    />
		  </GridColumn>
		  {// <GridColumn medium={2}>
		  // 	<h5 style={{paddingBottom: '0.5em'}}>Dynamic values:</h5>
		  // 	<div style={{boxSizing: 'content-box'}}>
		  // 	<ToggleStateless size="large" isDefaultChecked={this.state.data.load_vals_dynamically} onChange={this.handleChange('load_vals_dynamically')}/>
		  // 	</div>
		  // </GridColumn>
		  }


		  <GridColumn>
		  <h5 style={{paddingBottom: '0.5em'}}>Label position:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={label_position}
            menuPortalTarget={document.body}
            styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
            defaultValue={this.state.data.label_position === 'top' ? label_position[0] : label_position[1]}
            onChange={this.handleChange('label_position')} 
          />
		    </GridColumn>
		  </Grid>
		);
	}
}
