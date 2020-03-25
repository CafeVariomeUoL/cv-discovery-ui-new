import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { mkLabel, getType } from '../components/utils'

import { Table, Input, Button, Popconfirm, Form } from 'antd';
import ToggleStateless from '@atlaskit/toggle';
import './SettingsPage.css'


const EditableContext = React.createContext();

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
		  {
		    title: 'Key',
		    dataIndex: 'keyName',
		    width: '40%',
		    key: 'keyName',
		    defaultSortOrder: 'ascend',
    		sorter: (a, b) => a.keyName.localeCompare(b.keyName),
		  },
		  {
		    title: 'Type',
		    dataIndex: 'type',
		    key: 'type',
		  },
		  {
		    title: 'Label',
		    dataIndex: 'label',
		    width: '45%',
		    editable: true,
		    key: 'label',
		  },
		  {
		    title: 'Arbitrary Input',
		    dataIndex: 'arbitrary_input',
		    key: 'arbitrary_input',
		    render: (text, record) => 
		    	record.arbitrary_input ?
		    		<ToggleStateless isDefaultChecked onChange={this.toggleBool('arbitrary_input', record)}/> :
		    		<ToggleStateless onChange={this.toggleBool('arbitrary_input', record)}/>
		  },
		  {
		    title: 'Visible',
		    dataIndex: 'visible',
		    key: 'visible',
		    render: (text, record) => 
		    	record.visible ?
		    		<ToggleStateless isDefaultChecked onChange={this.toggleBool('visible', record)}/> :
		    		<ToggleStateless onChange={this.toggleBool('visible', record)}/>
		  },
		];


    this.state = {
      dataSource: this.props.dataSource,
      count: 2,
    };
  }


  componentDidUpdate(prevProps) {
	  if (prevProps.dataSource !== this.props.dataSource) {
	    this.setState({ dataSource: this.props.dataSource });
	  }
	}
  
  toggleBool = (property,row) => async () => {
    const newData = [...this.state.dataSource];
  	const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    item[property] = !item[property];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    var meta = {'attribute': row.attribute};
    meta[property]=item[property];
    console.log(meta)
		fetch(
      "http://localhost:8002/eavs/setAttributeMeta", {
        method:'POST',
        // mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(meta)
      })
      .then(res => res.json())
      .then(
        (result) => {
        	if(result.status === "success"){
        		this.setState({ dataSource: newData });
        	}
        })

    
  }

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });    
    fetch(
      "http://localhost:8002/eavs/setAttributeMeta", {
        method:'POST',
        // mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({'attribute': row.attribute, 'label':row.label})
      })
      .then(res => res.json())
      .then(
        (result) => {
        	if(result.status === "success"){
        		this.setState({ dataSource: newData });
        	}
        })
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
        	className={"settingsTable"}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}



export default class HomePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      hpo_attributes: []
    };
  }

  componentDidMount() {
    fetch(
      "http://localhost:8002/eavs/getAttributes", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result);
          
          var counter = 0;
          this.setState({
            hpo_attributes: result.map(e => {
            	return {
            		key: counter++,
            		keyName: mkLabel(e.attribute),
            		type: getType(e.attribute),
            		label: 'label' in e ? e.label : '',
            		visible: e.visible,
            		arbitrary_input: e.arbitrary_input,
            		attribute: e.attribute,
            	}
            })
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: false,
            error: error
          });
        }
      )
  }


  render() {
    return (
      <ContentWrapper>
        <PageTitle>Settings</PageTitle>
        <h2 style={{marginBottom: '20px'}}>PickerBuilder settings</h2>
        <EditableTable
		  		dataSource={this.state.hpo_attributes} 
	      />
      </ContentWrapper>
    );
  }
}
