import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';



export default class EmptyBuilderSettings extends React.Component {

	state = this.props.data ? this.props.data : {
		operator: '',
		label: '',
		canHaveChildren: true
	}

	handleChange = prop_name => e =>  {
		const newState = {...this.state};
		if (prop_name === 'operator'){
			newState[prop_name] = e.value;
		}
		else {
			newState[prop_name] = e.target.value;
		}
    	this.setState(newState);
    	this.props.setData(newState);
	}

	
	render() {
		return (
			<div>
			<h3 style={{paddingBottom: '0.5em'}}>Boolean operator group</h3>
	  
		  <Grid>
		  	<GridColumn medium={8}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Label:</h5>
		  <Textfield
		      name="label"
  		      defaultValue={this.state.label}
		      onChange={this.handleChange('label')} 
		    />
		  </GridColumn>
		  <GridColumn>
		  <h5 style={{paddingBottom: '0.5em'}}>Boolean operator:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
          	defaultValue={{label:this.state.operator, value:this.state.operator}}
            options={[{label: 'and', value:'and'}, {label: 'or', value:'or'}]}
            onChange={this.handleChange('operator')} 
          />
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
