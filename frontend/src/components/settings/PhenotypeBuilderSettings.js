import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { mkLabel, getType } from '../../utils/utils'
import { getAttributes } from '../../utils/api'

import ToggleStateless from '@atlaskit/toggle';



export default class PhenotypeBuilderSettings extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			label:'', 
			attribute:{},
			tag_length: -1,
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
		if (prop_name === 'attribute'){
			newData[prop_name] = e.value;
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
          	menuPortalTarget={document.body}
            styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
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
		  			  	<h5 style={{paddingBottom: '0.5em'}}>Tag Length:</h5>

		  <Textfield
		      name="tag_length"
		      defaultValue={this.state.data.tag_length}
		      onChange={this.handleChange('tag_length')} 
		    />
		  </GridColumn>
		  </Grid>
		);
	}
}
