import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import { Table, Tag } from 'antd';
import { mkAttrQuery } from '../utils/utils';


const columns = [
  {
    title: 'Phenotype',
    dataIndex: 'hpo',
    key: 'hpo',
  }
];

export default class PhenotypeBuilder extends React.Component {
	state = {
		selectedRowKeys: [], // Check here to configure the default column
		hpo_data: [],
	};

	componentDidMount() {

		fetch(
	      process.env.REACT_APP_API_URL+"/discovery/getAttributeValues", {
	        method:'POST',
	        headers: {
	          'Access-Control-Allow-Origin': '*',
	          'Content-Type': 'application/json',
	          'Accept': 'application/json',
	          'X-Requested-With': 'XMLHttpRequest'
	        },
	        body: JSON.stringify({attribute: this.props.attribute})
	      })
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result);
	           if(result) this.setState({hpo_data: result.map((e) => {return {key:e, title:e}})});
	        },
	        // Note: it's important to handle errors here
	        // instead of a catch() block so that we don't swallow
	        // exceptions from actual bugs in components.
	        (error) => {
	          console.log(error)
	        })

        this.props.setQuery(this.mkQuery(this.state));

	}


	mkQuery = state => {
		return {
	      operator:"and",
	      children: []
	    }
	}

	onSelectChange = selectedRowKeys => {
	    const newState = {...this.state, selectedRowKeys: selectedRowKeys.sort()};
	    this.setState(newState);
	    this.props.setQuery(this.mkQuery(newState));
	};
	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>Phenotype</h3>
		  <Table 
		  	// dataSource={this.props.hpo_data} 
		  	columns={columns} 
		  	rowSelection={{
	          type: 'checkbox',
	          onChange: this.onSelectChange,
	        }} 
	        pagination={false} 
	        scroll={{ y: 200 }}/>
		  </div>
		);
	}
}
