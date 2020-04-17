import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';

import { Tag, Tooltip } from 'antd';
import { mkAttrQuery } from '../utils/utils';
import { getAttributeValuesLimitOffset } from '../utils/api'
import { List,AutoSizer } from 'react-virtualized'

import './PhenotypeBuilder.css'

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
		filtered_data: [],
		// filter_str:'',
	};

	componentDidMount() {
		this.loadProps(this.props, true)
	}

	componentWillReceiveProps(nextProps){
		this.loadProps(nextProps)
	}

	loadProps(nextProps, force = false){
		if((force && nextProps.attribute) || (nextProps.attribute && this.props.attribute !== nextProps.attribute)) {
			getAttributeValuesLimitOffset(nextProps.attribute, 500, 0,
		        (result) => {
		          console.log(result);
		           if(result) {
		           	const s = new Set();
		           	this.setState({hpo_data: result, filtered_data: result, selectedRowKeys: s});
		           	getAttributeValuesLimitOffset(nextProps.attribute, null, 50,
				        (result) => {
				          console.log(result);
				           if(result) this.setState((oldState, _) => 
	          				{return {...oldState, hpo_data: [...new Set([...oldState.hpo_data, ...result])] , filtered_data: [...new Set([...oldState.hpo_data, ...result])] }})

				        },
		
				        (error) => {
				          console.log(error)
				        }
				      )
		           }
		        },

		        (error) => {
		          console.log(error)
		        }
		    )

	        nextProps.setQuery(this.mkQuery(this.state));
	    }
	}


	mkQuery = state => {
		return {
	      operator:"and",
	      dontGroupExists: true,
	      children: [...state.selectedRowKeys].map((e) => mkAttrQuery(this.props.attribute, (v)=>v, 'is', e))
	    }
	}


	toggleTag = i => () => {
		const newState = {...this.state};
		if(newState.selectedRowKeys.has(i)){
			newState.selectedRowKeys.delete(i)
		} else {
			newState.selectedRowKeys.add(i)
		}
		this.setState(newState);
		this.list.forceUpdateGrid()
	    this.props.setQuery(this.mkQuery(newState));
	}

	trimOrPad = e => {
		if(this.props.tag_length === -1) return e;
		if(e.length < this.props.tag_length) return e + ' '.repeat(this.props.tag_length-e.length)
		else return e.substring(0,this.props.tag_length)
	}


	rowRenderer = ({ index, isScrolling, key, style }) => {
	    return (
	      <div key={key} className="listItem" style={{...style, display:'flex', alignItems: 'center'}} onClick={this.toggleTag(this.state.filtered_data[index])}>

		      <div style={{paddingTop:'2px', paddingLeft:'5px', paddingRight:'1px'}}>
		        <Checkbox
		          isChecked={this.state.selectedRowKeys.has(this.state.filtered_data[index])}
		          onChange={this.toggleTag(this.state.filtered_data[index])}
		          name="checkbox-basic"
		        /></div>
	        
		        <span>{this.state.filtered_data[index]}</span>

	      </div>
	    );
	  }

	handleChange = e => {
		const str = e.target.value.toLowerCase();
		const data = str ? this.state.hpo_data.filter(item =>
          item.toLowerCase().includes(str)
        ) : this.state.hpo_data;
		// console.log(data);
   		this.setState({filtered_data: data});
	}

	
	render() {
		const { selectedRowKeys, filtered_data } = this.state;
		// console.log(filtered_data.length)
		return (
		  <div style={{marginBottom: '0.5em'}}>
		  <h3 style={{paddingBottom: '0.5em'}}>{this.props.label?this.props.label:'<Label>'}</h3>
		  <div style={{paddingBottom: '0.5em', paddingLeft:'33px'}}>
		  <Textfield
		      name="filter"
		      placeholder="Filter..."
		      onChange={this.handleChange} 
		    />
		    </div>
		  <AutoSizer disableHeight>
		  {({width}) => <List
		  	  ref={ref => this.list = ref}
	          rowCount={filtered_data.length}
	          style={{outline:0}}
	          height={240}
	          width={width}
	          rowHeight={30}
	          rowRenderer={this.rowRenderer}
	          overscanRowCount={3}
	        />}
	     </AutoSizer>
	     <div style={{marginTop: '1em', width:'100%'}}><h5 style={{paddingBottom: '0.5em'}}>Selected:</h5>
	     	<div style={{height:'100px', overflow:'scroll'}}>
		     {[...selectedRowKeys].map((i) => {return (<Tooltip key={i} placement="top" title={i}><Tag
	          closable
	          onClose={this.toggleTag(i)}
	          // style={{}}
	        ><span style={{...(this.props.tag_length == -1 ? {} : {width: `${7.2*this.props.tag_length}px`}), 
	        	fontFamily: 'monospace', 
	        	whiteSpace: 'nowrap',
	        	overflow: 'hidden',
	        	display: 'inline-block',
	        	float: 'left',
	        	paddingTop: '1px',
	        	textOverflow:'ellipsis'}}>{i}</span></Tag></Tooltip>)})}
	        </div>
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