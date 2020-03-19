import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import { Table, Tag } from 'antd';


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
	};

	mkQuery = state => {
		return {
			operator: 'and',
			children: state.selectedRowKeys.map(k => {
				return {
					attribute: 'phenotypes_id',
					operator: 'is',
					value: this.props.hpo_data[k].hpo, 
					type: 'default'
				}
			}), 
			type: 'group'
		}
	}

	onSelectChange = selectedRowKeys => {
	    const newState = {selectedRowKeys: selectedRowKeys.sort()};
	    this.setState(newState);
	    this.props.setQuery(this.mkQuery(newState));
	};
	
	render() {
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>Phenotype</h3>
		  <Table 
		  	dataSource={this.props.hpo_data} 
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
