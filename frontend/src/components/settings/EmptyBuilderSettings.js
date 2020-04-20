import React from 'react';
// import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import ToggleStateless from '@atlaskit/toggle';



export default class EmptyBuilderSettings extends React.Component {

	state = this.props.data ? this.props.data : {
		hrule: false,
		label: '',
		canHaveChildren: true
	}

	componentDidMount() {
        this.props.setData(this.state);
	}


	handleChange = prop_name => e =>  {
		const newState = {...this.state};
		if (prop_name === 'hrule'){
			newState[prop_name] = !newState[prop_name];
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
			<h3 style={{paddingBottom: '0.5em'}}>Label</h3>
	  
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
		  <h5 style={{paddingBottom: '0.5em'}}>Horizontal line under label:</h5>
		  	<div style={{boxSizing: 'content-box'}}>
		  	<ToggleStateless size="large" isDefaultChecked={this.state.hrule} onChange={this.handleChange('hrule')}/>
		  	</div>
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
