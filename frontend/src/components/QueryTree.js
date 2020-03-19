import React, { Component } from 'react';
import styled from 'styled-components';
import Tree, {
  mutateTree,
  moveItemOnTree,
  addItemToTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';
import Button, { ButtonGroup } from '@atlaskit/button';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Select from '@atlaskit/select';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { AkCode, AkCodeBlock } from '@atlaskit/code';
import BootstrapTable from 'react-bootstrap-table-next';
import Collapsible from 'react-collapsible';


import PatientCharacteristics from './PatientCharacteristics';
import VariantBuilder from './VariantBuilder';
import BetweenBuilder from './BetweenBuilder';
import PickerBuilder from './PickerBuilder';
import PhenotypeBuilder from './PhenotypeBuilder';
import EmptyBuilder from './EmptyBuilder';
import { jsonAPI } from './jsonAPI';

const PADDING_PER_LEVEL = 30;

type State = {
  tree: TreeData,
  counter: int
};

type QueryBuilderType = string;

type QueryBuilder = {
  label: string;
  type: QueryBuilderType;
};

type Props = {
  queryBuilders: {[id: string] : QueryBuilder}
};

const createLabels = (builders:QueryBuilder[]) => 
  Object.entries(builders).map(([key, builder]) => {
    return {label: builder.label, value: key };
  })


const collectQueries = (t, e, q) => 
  t.items[e].children.map((i) => {
    if(t.items[i].children.length > 0){
      const childrenQs = collectQueries(t, i, q);
      const q_new = {...q[i]};
      q_new.children = childrenQs;
      return q_new;
    }
    return q[i]
  })

const generateJsonAPIQuery = (q) => {
  var q_res = {...jsonAPI}
  q_res.query.components.eav = q
  q_res.logic['-AND'] = q.map((e,index) => {return `/query/components/eav/${index}`})
  return q_res
}



const columns = [{
  dataField: 'source',
  text: 'Source'
}, {
  dataField: 'counts',
  text: 'Counts'
}];

export default class QueryTree extends Component<Props, State> {
  state = {
    counter:0,
    tree: {
      rootId: 'root',
      items: {
        'root': {
          id: 'root',
          children: [],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
          data: {
            canHaveChildren: true
          }
        },
      },
    },
    queries: {},
    query: [],
    results: [],
    showLoadingState: false
  };




  renderBuilderFromTreeItem = (item: TreeItem) => {
    switch (item.data.type) {
      case 'EmptyBuilder': return <EmptyBuilder 
          setQuery={this.storeQuery(item.id)} 
          {...item.data}/>
      case 'VariantBuilder':
        return <VariantBuilder/>
      case 'BetweenBuilder':
        return <BetweenBuilder 
          setQuery={this.storeQuery(item.id)} 
          {...item.data}/>
      case 'PickerBuilder':
        return <PickerBuilder 
          setQuery={this.storeQuery(item.id)} 
          {...item.data}/>
      case 'PhenotypeBuilder':
        return <PhenotypeBuilder 
          setQuery={this.storeQuery(item.id)} 
          {...item.data}/>
    }
  }

  storeQuery = (id) => {
    return (query_data) => {
      var newQueries = {...this.state.queries}
      newQueries[id] = query_data
      
      this.setState({
        queries: newQueries,
        query: collectQueries(this.state.tree, 'root', newQueries)
      });
    }
  }

  runQuery = () => {
    this.setState({
      showLoadingState: true
    });
    const jsAPIQuery = generateJsonAPIQuery(this.state.query)
    fetch(
      "http://localhost/AjaxApi/query/6", {
        method:'POST',
        // mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({'jsonAPI': jsAPIQuery, 'user_id':'1'})
      })
      .then(res => res.json())
      .then(
        (result) => {
          var jsonRes = result.map(r => JSON.parse(r));
          console.log(jsonRes);
          var resultsNew = jsonRes.map((j,i) => { 
            return {id:i, source: Object.keys(j)[0], counts: j[Object.keys(j)[0]].length}
          });
          this.setState({
            results: resultsNew,
            showLoadingState: false
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error)
        }
      )
  }


  renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        
      >
        <div style={{
          backgroundColor:'white', 
          // borderColor:'#4797FF', 
          borderColor: 'rgb(222, 235, 255)',
          borderRadius: '3px',
          borderWidth: '2px',
          borderStyle: 'solid',
          padding: '10px',
          marginTop: '5px',
        }}>
        <Grid spacing="compact">
          <GridColumn medium={1}>
            <Button appearance={'subtle'} spacing="none" onClick={() => this.onDelete(item.id)}>
              <CrossIcon/>
            </Button>
          </GridColumn>
          <GridColumn medium={11}>
            {this.renderBuilderFromTreeItem(item)}
          </GridColumn>
        </Grid>
        </div>
      </div>
    );
  };

  
  createTreeItem = (id: string, ty: string) => {
    return {
      id: id,
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: this.props.queryBuilders[ty],
    };
  };

  addItemToRoot = (tree: TreeData, id: string, ty: string) => {
    // const destinationParent = tree.items[position.parentId];
    const newItems = {...tree.items};
    newItems[`${id}`] = this.createTreeItem(id, ty);
    newItems['root'].children.push(`${id}`);
    return {
      rootId:tree.rootId, 
      items: newItems
    } 
  }

  deleteItem = (tree: TreeData, id: string) => {
    const newItems = {...tree.items};
    delete newItems[`${id}`];

    for (var i of Object.keys(newItems)) {
      if (newItems[i].children.includes(`${id}`)) {
        newItems[i].children.splice(newItems[i].children.indexOf(`${id}`), 1);
      }
    }

    return {
      rootId:tree.rootId, 
      items: newItems
    } 
  }


  onDelete = (id: string) => {
    const { counter, tree, queries } = this.state;
    const newTree = this.deleteItem(tree, id);
    const newQueries = {...queries}
    delete newQueries[id];

    this.setState({
      tree: newTree,
      queries: newQueries,
      query: collectQueries(newTree, 'root', newQueries)
    });
  }

  


  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    if(!tree.items[destination.parentId].data.canHaveChildren){
      return;
    }
    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: mutateTree(newTree, destination.parentId, { isExpanded: true }),
      query: collectQueries(newTree, 'root', this.state.queries)
    });
  };

  handleChange = selectedOption => {
    // this.setState(
      // { selectedOption },
      // () => {
        const { counter, tree } = this.state;
        const newTree = this.addItemToRoot(tree, counter, selectedOption.value);

        // this.storeQuery(counter)(null);
        this.setState({
          counter: counter+1,
          tree: newTree,
        });

        // console.log(this.state.tree);
      // }
    // );
  };

  render() {
    const { tree } = this.state;
    // console.log(this.props.queryBuilders)
    return (
      <div>
        <Tree
          tree={tree}
          renderItem={this.renderItem}
          onDragEnd={this.onDragEnd}
          offsetPerLevel={PADDING_PER_LEVEL}
          isDragEnabled
          isNestingEnabled
        />
        <div style={{marginTop:'100px'}}>
          <h4 style={{paddingBottom:'10px'}}>Add a property:</h4>
          <Select
            options={createLabels(this.props.queryBuilders)}
            onChange={this.handleChange}
            placeholder="Select a property to add" />
        </div>

        <div style={{marginTop:'20px'}}>
          <Button isLoading={this.state.showLoadingState} appearance="primary" onClick={this.runQuery}>Run query</Button>
          <h4 style={{paddingBottom:'10px'}}>Results:</h4>
          <BootstrapTable keyField='id' data={ this.state.results } columns={ columns } />
            {this.props.debug &&
            <div>
              <h4 style={{paddingTop:'10px', paddingBottom:'10px'}}>Internal query:</h4>
              <AkCodeBlock 
                language="javascript" 
                text={JSON.stringify(this.state.query, null, 2)} 
                showLineNumbers={false}/>
              <h4 style={{paddingBottom:'10px'}}>jsonAPI query:</h4>
              <AkCodeBlock 
                language="javascript" 
                text={JSON.stringify(generateJsonAPIQuery(this.state.query), null, 2)} 
                showLineNumbers={false}/>
            </div>}
        </div>

      </div>
    );
  }
}