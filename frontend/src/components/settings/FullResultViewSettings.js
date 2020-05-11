import React, { useState, useEffect } from 'react';
import Button from '@atlaskit/button';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { getAttributes } from '../../utils/api'
import { mkLabel } from '../../utils/utils'


export default function FullResultViewSettings(props) {
  const [columns, setColumns] = useState(props.data.columns ? props.data.columns : []);


  const [attributes, setAttributes] = useState([]);


  const editTableColumns = (attr) => [{
      dataField: 'text',
      text: 'Column name'
    },{
      dataField: 'dataField',
      text: 'JSONB attribute',
      editor: {
        type: Type.SELECT,
        options: attr
      }
    }];

  useEffect(() => {
    getAttributes(props.settings_id,
      (result) => {
        setAttributes(result.map((e,i) => {
          return {label:mkLabel(e.attribute), value:mkLabel(e.attribute), raw: e.attribute}
        }))
      },
      (error) => {}
    )
  }, [props.settings_id])


  const addColumn = () => {
    setColumns([...columns, {id:columns.length, text: '<Column name>', dataField: ''}])
  }

  const fix = (cols) => cols.map((e) => {
    console.log(e);
    const found = attributes.find(el => el.value === e.dataField);
    return {...e,
      path: found ? found.raw : null
    }
  })
  
 
  return (
  <div>
    <Button appearance={'subtle'} onClick={addColumn}>
      Add column
    </Button>

    <BootstrapTable
      keyField="id"
      data={ columns }
      columns={ editTableColumns(attributes) }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true,  afterSaveCell: () => { props.setData({columns: fix(columns)}) } }) }
    />
  </div>)

}
