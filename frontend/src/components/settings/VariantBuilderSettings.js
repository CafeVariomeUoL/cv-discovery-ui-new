import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { mkLabel, getType } from '../../utils/utils'
import { getAttributes } from '../../utils/api'

import ToggleStateless from '@atlaskit/toggle';



export default class VariantBuilderSettings extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			label:'',
			hrule: false,
			assembly:{},
			chr:{},
			chr_start:{},
			chr_end:{},
			ref_:{},
			alt:{},
		},
		attributes: []
	}


	componentDidMount() {
	    getAttributes(
	        (result) => {
	          this.setState({
	            attributes: result.map(e => {return {label:mkLabel(e.attribute), key:mkLabel(e.attribute), value:e.attribute}})
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
		if (prop_name === 'hrule'){
			newData[prop_name] = !newData[prop_name];
		} else if (prop_name === 'label'){
			newData[prop_name] = e.target.value;
		}
		else {
			newData[prop_name] = e.value;
		}
    	this.setState({data: newData});
    	this.props.setData(newData);
	}


	
	render() {
		return (
			<div>	  
		  <Grid>
		  <GridColumn medium={4}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Label:</h5>
		  <Textfield
		      name="label"
		      defaultValue={this.state.data.label}
		      onChange={this.handleChange('label')} 
		    />
		  </GridColumn>
		  <GridColumn>
		  <h5 style={{paddingBottom: '0.5em'}}>Horizontal line under label:</h5>
		  	<div style={{boxSizing: 'content-box'}}>
		  	<ToggleStateless size="large" isDefaultChecked={this.state.data.hrule} onChange={this.handleChange('hrule')}/>
		  	</div>
		    </GridColumn>
		  <GridColumn medium={4}>
		  <h5 style={{paddingBottom: '0.5em'}}>Assembly:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.assembly), value:this.state.data.assembly}}
            onChange={this.handleChange('assembly')} 
          />
          		  </GridColumn>
		  </Grid>
		  <div style={{paddingTop: '0.5em'}}>
		  <Grid>
		  <GridColumn medium={4}>
		  <h5 style={{paddingBottom: '0.5em'}}>Chr:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.chr), value:this.state.data.chr}}
            onChange={this.handleChange('chr')} 
          />
		    </GridColumn>
		  	<GridColumn medium={4}>
		  <h5 style={{paddingBottom: '0.5em'}}>Chr start:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.chr_start), value:this.state.data.chr_start}}
            onChange={this.handleChange('chr_start')} 
          />
		    </GridColumn>
		    <GridColumn>
		  <h5 style={{paddingBottom: '0.5em'}}>Chr end:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.chr_end), value:this.state.data.chr_end}}
            onChange={this.handleChange('chr_end')} 
          />
		    </GridColumn>
		  </Grid>
		  </div>

		   <div style={{paddingTop: '0.5em'}}>
		  <Grid>
		  <GridColumn medium={5}>
		  <h5 style={{paddingBottom: '0.5em'}}>REF:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.ref_), value:this.state.data.ref_}}
            onChange={this.handleChange('ref_')} 
          />
		    </GridColumn>
		  	
		    <GridColumn>
		  <h5 style={{paddingBottom: '0.5em'}}>ALT:</h5>
          <Select
            className="single-select"
          	classNamePrefix="react-select"
            options={this.state.attributes}
            defaultValue={{label:mkLabel(this.state.data.alt), value:this.state.data.alt}}
            onChange={this.handleChange('alt')} 
          />
		    </GridColumn>
		  </Grid>
		  </div>
		  </div>
		);
	}
}
