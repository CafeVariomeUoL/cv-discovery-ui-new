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
// import Collapsible from 'react-collapsible';


import { typeMap } from './typesWOQueryTree'

import { mergeExists, mkLabel, removeQueryBuildersFromTree, mkQueryBuilders, generateFinalQuery, collectQueries } from '../utils/utils';


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


const insertAttr = (q) => {
  switch (q.operator) {
    case "and":
    case "or":
    case "exists":
      var new_q = {...q}
      new_q.children = new_q.children.map(insertAttr)
      return new_q
    default:
      var new_q = {...q}
      new_q.attribute = {'x' : new_q.attribute}
      return new_q
  }
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
            canHaveChildren: true
          },
        },
      },
    queries: {},
    query: [],
    results: [],
  }

  
  componentDidMount() {
    fetch(
      process.env.REACT_APP_API_URL+"/discovery/loadSettings?id="+this.props.tree, {
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
          // console.log("Tree: ");
          if(result){
            const newTree = removeQueryBuildersFromTree(JSON.parse(result));
            console.log("Tree:", newTree);
            // console.log("prune&mkQueryTree:", pruneTree(mkQueryTree(JSON.parse(result))));
            this.setState({
              queryBuilders: this.props.dynamic ? mkQueryBuilders(newTree) : this.state.queryBuilders,
              tree: this.props.dynamic ? this.state.tree : newTree
            });
          }
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

      this.props.setQuery(generateFinalQuery(this.state.query));

  }



  



  renderBuilderFromTreeItem = (item: TreeItem) => {
    const TypeTag = typeMap[item.type].type
    return <TypeTag setQuery={this.storeQuery(item.id)} {...item.data}/>
  }



processQuery = (state, id, query_data) => {
  var newQueries = {...state.queries}
  newQueries[id] = query_data
  const collected = collectQueries(state.tree, 'root', newQueries);
  if(collected.filter(i => i === undefined).length == 0)
    this.props.setQuery(generateFinalQuery(collected));
  return {
    queries: newQueries,
    query: collected
  }
}


  storeQuery = (id) => {
    return (query_data) => {
      this.setState((oldState, _) => this.processQuery(oldState, id, query_data));
    }
  }


  boxStyle = this.props.dynamic ? {
          backgroundColor:'white', 
          borderColor: 'rgb(222, 235, 255)',
          borderRadius: '3px',
          borderWidth: '2px',
          borderStyle: 'solid',
          padding: '10px',
          marginTop: '5px',
        } : {
          padding: '10px',
          marginTop: '5px',
        }


  renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        
      >
        <div style={this.boxStyle}>
        <Grid spacing="compact">
          {this.props.dynamic && <GridColumn medium={1}>
            <Button appearance={'subtle'} spacing="none" onClick={() => this.onDelete(item.id)}>
              <CrossIcon/>
            </Button>
          </GridColumn>}
          <GridColumn medium={this.props.dynamic ? 11 : 12}>
            {this.renderBuilderFromTreeItem(item)}
          </GridColumn>
        </Grid>
        </div>
      </div>
    );
  };

  
  createTreeItem = (id: string, selectedOption) => {
    console.log("selected: ", selectedOption)
    return {
      id: id,
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      canHaveChildren: selectedOption.canHaveChildren,
      type: selectedOption.type,
      data: selectedOption,
    };
  }

  addItemToRoot = (tree: TreeData, id: string, selectedOption) => {
    // const destinationParent = tree.items[position.parentId];
    const newItems = {...tree.items};
    newItems[`${id}`] = this.createTreeItem(id, selectedOption);
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

    if(!tree.items[destination.parentId].canHaveChildren){
      return;
    }
    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: mutateTree(newTree, destination.parentId, { isExpanded: true }),
      query: collectQueries(newTree, 'root', this.state.queries)
    });
  }

  handleChange = selectedOption => {
        const { counter, tree } = this.state;
        const newTree = this.addItemToRoot(tree, counter, selectedOption);

        this.setState({
          counter: counter+1,
          tree: newTree,
        });
  }

  render() {
    console.log("this tree: ", this.state.tree)
    return (
      <div style={{
          backgroundColor:'white', 
          borderColor: 'rgb(222, 235, 255)',
          borderRadius: '3px',
          borderWidth: '2px',
          borderStyle: 'solid',
          padding: '10px',
          marginTop: '5px',
        }}>
        {this.props.label && <h2 style={{marginBottom: '0.5em'}}>{this.props.label?this.props.label:'\u00A0'}</h2>}
        <Tree
          tree={this.state.tree}
          renderItem={this.renderItem}
          onDragEnd={this.onDragEnd}
          offsetPerLevel={PADDING_PER_LEVEL}
          isDragEnabled={this.props.dynamic}
          isNestingEnabled={this.props.dynamic}
        />
        {this.props.dynamic && <div style={{marginTop:'100px'}}>
          <h4 style={{paddingBottom:'10px'}}>Add a property:</h4>
          <Select
            options={this.state.queryBuilders}
            onChange={this.handleChange}
            placeholder="Select a property to add" />
        </div>}
      </div>
    );
  }
}