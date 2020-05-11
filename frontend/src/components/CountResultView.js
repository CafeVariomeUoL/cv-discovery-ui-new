import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';


const columns = [{
  dataField: 'source',
  text: 'Source'
}, {
  dataField: 'counts',
  text: 'Counts'
}];


export default function CountResultView(props) {
 
  return <BootstrapTable 
  	keyField='id' 
  	data={ props.results.count != null ? [{id:0, source:'', counts: props.results.count}] : [] } 
  	columns={ columns } />
}
