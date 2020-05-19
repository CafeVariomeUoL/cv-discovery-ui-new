import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';
import { Slider } from 'antd';

import { Tag, Tooltip } from 'antd';
import { mkAttrQuerySet } from '../utils/utils';
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
		matchSliderValue: 1,
		HPOSim:1,
		// filter_str:'',
	};

	componentDidMount() {
		this.loadProps(this.props, true)
	}

	componentWillReceiveProps(nextProps){
		this.loadProps(nextProps)
	}
	
	componentWillUnmount() {
	    this.props.deleteQuery();
	}

	loadProps(nextProps, force = false){
		if((force && nextProps.attribute) || (nextProps.attribute && this.props.attribute !== nextProps.attribute)) {
			getAttributeValuesLimitOffset(this.props.settings_id, nextProps.attribute, 500, 0,
		        (result) => {
		          // console.log(result);
		           if(result) {
		           	const s = new Set();
		           	this.setState({hpo_data: result, filtered_data: result, selectedRowKeys: s});
		           	getAttributeValuesLimitOffset(this.props.settings_id, nextProps.attribute, null, 50,
				        (result) => {
				          // console.log(result);
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

	        nextProps.setQuery(this.mkQuerySim(this.state));
	    }
	}


	// mkQuery = state => {
	// 	return {
	//       operator:"and",
	//       dontGroupExists: true,
	//       children: [...state.selectedRowKeys].map((e) => mkAttrQuery(this.props.attribute, (v)=>v, 'is', e))
	//     }
	// }


	mkQuerySim = state => {
		const[f,p] = mkAttrQuerySet(this.props.attribute, (v)=>v)
		return {
	      operator:"similarity",
	      from: { 
	      	operator: "set",
	      	from: f,
	      	path: p
	      },
	      hpos: [...state.selectedRowKeys],
	      match: state.matchSliderValue,
	      similarity: state.HPOSim
	    }
	}


	toggleTag = i => () => {
		const newState = {...this.state};
		const rs = newState.selectedRowKeys.size;

		if(newState.selectedRowKeys.has(i)){
			newState.selectedRowKeys.delete(i)
		} else {
			newState.selectedRowKeys.add(i)
		}
		if(newState.matchSliderValue === rs || rs === 0) {
			newState.matchSliderValue = newState.selectedRowKeys.size
		}
		this.setState(newState);
		this.list.forceUpdateGrid()
	  this.props.setQuery(this.mkQuerySim(newState));
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

	handleMatchSlider = e => {
			const newState = {...this.state};
			newState.matchSliderValue = e
   		this.setState(newState);
   		this.props.setQuery(this.mkQuerySim(newState));
	}

	handleHPOSimSlider = e => {
   		const newState = {...this.state};
			newState.HPOSim = e
   		this.setState(newState);
   		this.props.setQuery(this.mkQuerySim(newState));
	}


	sim_formatter = value => {
		if(value === 0) {
			return "not related"
		}
		if(value === 1) {
			return "exact match"
		}
	  return `${value*100}% similar`;
	}

	match_formatter = selectedRowKeysLength => value => {
		if(value === 1) {
			return "any"
		}
		if(value === selectedRowKeysLength) {
			return "all"
		}
	  return `${value} out of ${selectedRowKeysLength}`;
	}


	
	render() {
		const { selectedRowKeys, filtered_data, matchSliderValue } = this.state;
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
	      	<div style={{display:'flex', paddingTop: '0.6em'}}>
          	<div>
            	<h5>HPO Term Pairwise Similarity: </h5>
          	</div>
          	<div style={{flexGrow:1}}>
						<Slider
              min={0} 
              max={1} 
              step={0.1}
              onChange={this.handleHPOSimSlider}
              tipFormatter={this.sim_formatter}
              defaultValue={1} 
            />
            </div>

            <div>
            	<h5>Minimum Matched Terms: </h5>
          	</div>
          	<div style={{flexGrow:1}}>
						<Slider
              min={1} 
              max={selectedRowKeys.size ? selectedRowKeys.size : 1}
              step={1}
              onChange={this.handleMatchSlider}
              tipFormatter={this.match_formatter(selectedRowKeys.size ? selectedRowKeys.size : 1)}
              value={matchSliderValue} 
            />
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