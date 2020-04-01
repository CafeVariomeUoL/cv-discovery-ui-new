import React, { Component } from 'react';

import Spinner from '@atlaskit/spinner';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import QueryTree from '../components/QueryTree';
import { mkLabel, getType, mergeExists, removeEmpty, humanReadableQuery, generateFinalQuery, pruneTree, mkQueryTree, collectQueries } from '../components/utils'

import { typeMap } from '../components/Types'

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


const PADDING_PER_LEVEL = 30;




const columns = [{
  dataField: 'source',
  text: 'Source'
}, {
  dataField: 'counts',
  text: 'Counts'
}];



export default class DiscoveryPage extends Component {


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
    isLoaded: false,
    debug: true
  };


  componentDidMount() {
    fetch(
      "http://localhost:8002/discovery/loadSettings?id="+this.props.match.params.id, {
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
            // console.log("mkQueryTree:", mkQueryTree(JSON.parse(result)));
            // console.log("prune&mkQueryTree:", pruneTree(mkQueryTree(JSON.parse(result))));
            this.setState({
              isLoaded: true,
              tree: JSON.parse(result)
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
  }


  renderBuilderFromTreeItem = (item: TreeItem) => {
    const TypeTag = typeMap[item.type].type
    return <TypeTag setQuery={this.storeQuery(item.id)} {...item.data}/>
  }

  storeQuery = (id) => {
    return (query_data) => {
      this.setState((prevState,_) => ({
        queries: {... prevState.queries, [id]: query_data},
        query: collectQueries(prevState.tree, 'root', {... prevState.queries, [id]: query_data})
      }));
    }
  }

  runQuery = () => {
    this.setState({
      showLoadingState: true
    });
    // const jsAPIQuery = generateJsonAPIQuery(this.state.query)
    console.log(JSON.stringify({'query': { 'operator':'and', 'children': this.state.query}}));
    fetch(
      "http://localhost:8002/query", {
        method:'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({'query': generateFinalQuery(this.state.query)})
      })
      .then(res => res.json())
      .then(
        (result) => {
          // var jsonRes = result.map(r => JSON.parse(r));
          console.log(result);
          // var resultsNew = jsonRes.map((j,i) => { 
          //   return {id:i, source: Object.keys(j)[0], counts: j[Object.keys(j)[0]].length}
          // });
          this.setState({
            results: [{id:0, source:'', counts: result.count}],
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
          // backgroundColor:'white', 
          // borderColor: 'rgb(222, 235, 255)',
          // borderRadius: '3px',
          // borderWidth: '2px',
          // borderStyle: 'solid',
          padding: '10px',
          marginTop: '5px',
        }}>
        <Grid spacing="compact">
          {this.props.dynamic && <GridColumn medium={1}>
            <Button appearance={'subtle'} spacing="none" onClick={() => this.onDelete(item.id)}>
              <CrossIcon/>
            </Button>
          </GridColumn>}
          <GridColumn medium={11 ? this.props.dynamic : 12}>
            {this.renderBuilderFromTreeItem(item)}
          </GridColumn>
        </Grid>
        </div>
      </div>
    );
  }

  


 

  render() {
    console.log(this.state.tree)
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Spinner size="large" />;
    } else {
      return (
        <ContentWrapper>
          <PageTitle>Discover - Query Builder</PageTitle>
          <section style={{marginBottom: '20px'}}>
            <p>
              I am searching for records which include:
            </p>
          </section>


          <div>
            <Tree
              tree={this.state.tree}
              renderItem={this.renderItem}
              offsetPerLevel={PADDING_PER_LEVEL}
              // isDragEnabled isNestingEnabled
            />
            {this.props.dynamic && <div style={{marginTop:'100px'}}>
              <h4 style={{paddingBottom:'10px'}}>Add a property:</h4>
              <Select
                options={[]}
                onChange={this.handleChange}
                placeholder="Select a property to add" />
            </div>}

            <div style={{marginTop:'20px'}}>
              <Button isLoading={this.state.showLoadingState} appearance="primary" onClick={this.runQuery}>Run query</Button>
              <h4 style={{paddingBottom:'10px'}}>Results:</h4>
              <BootstrapTable keyField='id' data={ this.state.results } columns={ columns } />
                {this.state.debug &&
                <div>
                  <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Human readable Query:</h4>
                  <AkCodeBlock 
                    language="text" 
                    text={humanReadableQuery(generateFinalQuery(this.state.query), null, 2)} 
                    showLineNumbers={false}/>
                  
                  <h4 style={{paddingBottom:'10px'}}>API query:</h4>
                  <AkCodeBlock 
                    language="json" 
                    text={JSON.stringify(generateFinalQuery(this.state.query), null, 2)} 
                    showLineNumbers={false}/>
                  <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Raw Query Tree:</h4>
                  <AkCodeBlock 
                    language="json" 
                    text={JSON.stringify(this.state.query, null, 2)} 
                    showLineNumbers={false}/>
                </div>}
            </div>

          </div>
        </ContentWrapper>
      );
    }
  }
}
