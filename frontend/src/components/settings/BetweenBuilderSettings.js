import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { mkLabel, getType } from '../../utils/utils'
import ToggleStateless from '@atlaskit/toggle';
import { getAttributes } from '../../utils/api'


export default class BetweenBuilderSettings extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			label:'', 
			attribute:{}
		},
		attributes: []
	}


	componentDidMount() {
	    getAttributes(
	        (result) => {
	          this.setState({
	            attributes: result.filter(e => getType(e.attribute) == 'int' || getType(e.attribute) == 'float').map(e => {return {label:mkLabel(e.attribute), value:e.attribute}})
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
		  	<GridColumn>
		  	<h5 style={{paddingBottom: '0.5em'}}>Label:</h5>
		  <Textfield
		      name="label"
		      defaultValue={this.state.data.label}
		      onChange={this.handleChange('label')} 
		    />
		  </GridColumn>
		  </Grid>
		);
	}
}
