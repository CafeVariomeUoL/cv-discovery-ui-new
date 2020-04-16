import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { mkLabel, getType } from '../../utils/utils'
import ToggleStateless from '@atlaskit/toggle';



export default class QueryTreeSettings extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			label:'', 
			tree:'',
			dynamic:false
		},
		trees: []
	}


	componentDidMount() {
	    fetch(
	      process.env.REACT_APP_API_URL+"/discovery/getSettings", {
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
	          this.setState({
	            trees: result.map(e => {return {label:e.id, value:e.id}}).filter((e) => e.label !== this.props.settings_id)
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
        this.props.setData(this.state.data);
	  }


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};
		if (prop_name === 'tree'){
			newData[prop_name] = e.value;
		}
		else if (prop_name === 'dynamic'){
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
		  	<h5 style={{paddingBottom: '0.5em'}}>Label:</h5>
		  <Textfield
		      name="label"
		      defaultValue={this.state.data.label}
		      onChange={this.handleChange('label')} 
		    />
		  </GridColumn>

		  <GridColumn >
		  <h5 style={{paddingBottom: '0.5em'}}>Select tree:</h5>
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
            options={this.state.trees}
            defaultValue={{label:this.state.data.tree, value:this.state.data.tree}}
            onChange={this.handleChange('tree')} 
          />
		    </GridColumn>
		    <GridColumn medium={2}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Is dynamic:</h5>
		  	<div style={{boxSizing: 'content-box'}}>
		  	<ToggleStateless size="large" isDefaultChecked={this.state.data.dynamic} onChange={this.handleChange('dynamic')}/>
		  	</div>
		  </GridColumn>
		  	
		  </Grid>
		  </div>
		);
	}
}
