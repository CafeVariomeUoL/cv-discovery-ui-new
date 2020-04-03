import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { mkLabel, getType } from '../../utils/utils'
import ToggleStateless from '@atlaskit/toggle';







export default class PickerBuilderSettings extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			label:'', 
			attribute:{},
			load_vals_dynamically:false
		},
		attributes: []
	}


	componentDidMount() {
	    fetch(
	      process.env.REACT_APP_API_URL+"/discovery/getAttributes", {
	        headers: {
	          "Access-Control-Allow-Origin": "*",
	          'Content-Type': 'application/json',
	          'Accept': 'application/json',
	          'X-Requested-With': 'XMLHttpRequest'
	        }
	      })
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result);
	          

	          this.setState({
	            attributes: result.map(e => {return {label:mkLabel(e.attribute), value:e.attribute}})
	          });
	        },
	        // Note: it's important to handle errors here
	        // instead of a catch() block so that we don't swallow
	        // exceptions from actual bugs in components.
	        (error) => {
	          this.setState({
	            error: error
	          });
	        }
	      )
	  }


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};
		if (prop_name === 'attribute'){
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
			<div>
			<h3 style={{paddingBottom: '0.5em'}}>{this.props.label}</h3>
	  
		  <Grid>
		  <GridColumn medium={5}>
		  <h5 style={{paddingBottom: '0.5em'}}>Attribute:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.attribute), value:this.state.data.attribute}}
            onChange={this.handleChange('attribute')} 
          />
		    </GridColumn>
		  	<GridColumn medium={4}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Label:</h5>
		  <Textfield
		      name="label"
		      defaultValue={this.state.data.label}
		      onChange={this.handleChange('label')} 
		    />
		  </GridColumn>
		  <GridColumn medium={2}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Dynamic values:</h5>
		  	<div style={{boxSizing: 'content-box'}}>
		  	<ToggleStateless size="large" isDefaultChecked={this.state.data.load_vals_dynamically} onChange={this.handleChange('load_vals_dynamically')}/>
		  	</div>
		  </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
