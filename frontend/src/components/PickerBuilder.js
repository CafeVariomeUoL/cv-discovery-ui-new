import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';

const opts = [
	      { label: 'IS', value: 'is' },
	      { label: 'IS LIKE', value: 'is like' },
	      { label: 'IS NOT', value: 'is not' },
	      { label: 'IS NOT LIKE', value: 'is not like' },
	      { label: '=', value: 'is' },
	      { label: '≠', value: 'is not' },
	      { label: '<', value: '<' },
	      { label: '>', value: '>' },
	      { label: '<=', value: '<=' },
	      { label: '>=', value: '>=' },
	    ];

export default class PickerBuilder extends React.Component {
	state = {
		op: opts[0].value,
		value: ''
	}

	mkQuery = state => {
		return {
			attribute: this.props.queryId,
			operator: state.op,
			value: state.value, 
			type: 'default'
		}
	}

	componentDidMount() {
		this.props.setQuery(this.mkQuery(this.state));
	}

	handleChange = prop_name => selectedOption =>  {
		const newState = {...this.state};
		newState[prop_name] = selectedOption.value;
	    this.setState(newState);
	    this.props.setQuery(this.mkQuery(newState));
	}

	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>{this.props.label}</h3>
		  <Grid>
		  	<GridColumn medium={2}>
	            <Select
	              className="single-select"
		          classNamePrefix="react-select"
	              options={opts}
	              defaultValue={opts[0]}
	              onChange={this.handleChange('op')} 
	              // value={opts[0]}
	            />
		    </GridColumn>
		    <GridColumn>
		      <Select
		        className="single-select"
		        classNamePrefix="react-select"
		        options={this.props.options}
	            onChange={this.handleChange('value')}
		      />
		    </GridColumn>
		  </Grid>
		  </div>
		);
	}
}
