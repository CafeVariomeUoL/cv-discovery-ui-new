import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { getValueFromPath } from '../utils/utils'

export default function FullResultView(props) {


  const formatData = (cols, data) => {
  	console.log("cols:", cols)
  	console.log("data:", data)
  	var res = [];
  	for (var i = 0; i < data.length; i++) {
  		var row = {id: i};
  		for (var j = 0; j < cols.length; j++) {
  			row[cols[j].dataField] = cols[j].path ? getValueFromPath(data[i], cols[j].path).join(", ") : '';
  		}
  		res.push(row);
  	}
  	console.log(res)
  	return res;
  }
 
  return <BootstrapTable 
  	keyField='id' 
  	data={ props.results.full != null ? formatData(props.columns ? props.columns : [], props.results.full) : [] } 
  	columns={ props.columns ? props.columns : [{ dataField: 'id', text: 'Id' }] } />

}
