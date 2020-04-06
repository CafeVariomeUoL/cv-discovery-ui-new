import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import { Table, Tag } from 'antd';
import { mkAttrQuery } from '../utils/utils';
import { getAttributeValues } from '../utils/api'


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

		getAttributeValues(this.props.attribute,
	        (result) => {
	          console.log(result);
	           if(result) this.setState({hpo_data: result.map((e) => {return {key: e, hpo:e}})});
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
	      dontGroupExists: true,
	      children: state.selectedRowKeys.map((e) => mkAttrQuery(this.props.attribute, (v)=>v, 'is', e))
	    }
	}

	onSelectChange = selectedRowKeys => {
	    const newState = {...this.state, selectedRowKeys: selectedRowKeys.sort(), pills: selectedRowKeys.sort()};
	    this.setState(newState);
	    this.props.setQuery(this.mkQuery(newState));
	};

	removeTag = e => {
		const newState = {...this.state, selectedRowKeys: this.state.selectedRowKeys.filter((x) => x !== e)};
		this.setState(newState);
	    this.props.setQuery(this.mkQuery(newState));
	}
	
	render() {
		const { selectedRowKeys } = this.state;
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>Phenotype</h3>
		  <Table 
		  	dataSource={this.state.hpo_data} 
		  	columns={columns} 
		  	rowSelection={{
		  	  selectedRowKeys,
	          type: 'checkbox',
	          onChange: this.onSelectChange,
	        }} 
	        pagination={false} 
	        scroll={{ y: 200 }}/>
	     <div style={{marginTop: '1.5em'}}><h5 style={{paddingBottom: '0.5em'}}>Selected:</h5>

	     {selectedRowKeys.map((e) => {return (<Tag
          closable
          key={e}
          visible
          onClose={() => this.removeTag(e)}
        >{e}</Tag>)})}
	        </div>
		
		  </div>
		);
	}
}


// <TagGroup children={this.state.pills.map((e) => {return <Tag
// 		      text={e}
// 		      key={e}
// 		      removeButtonText="Remove"
// 		      onBeforeRemoveAction={() => {
// 		        console.log('Before removal'); // eslint-disable-line no-console
// 		        return true;
// 		      }}
// 		    />})}/>