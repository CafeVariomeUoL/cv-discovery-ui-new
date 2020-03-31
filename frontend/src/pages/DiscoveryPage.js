import React, { Component } from 'react';

import Spinner from '@atlaskit/spinner';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import QueryTree from '../components/QueryTree';
import { mkLabel, getType, mergeExists } from '../components/utils'

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

// const generateJsonAPIQuery = (q) => {
//   var q_res = {...jsonAPI}
//   q_res.query.components.eav = q
//   q_res.logic['-AND'] = q.map((e,index) => {return `/query/components/eav/${index}`})
//   return q_res
// }



const generateFinalQuery = (q) => {
  return mergeExists({operator:'and', children: q})
}


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

const humanReadableQuery = (q) => {
  switch (q.operator) {
    case "and": return "(" + q.children.map(humanReadableQuery).join(" ∧ ") + ")"
    case "or": return  "(" +  q.children.map(humanReadableQuery).join(" ∨ ") + ")"
    case "exists": return "(∃ x ∈ " + mkLabel(q.from) + " . " + q.children.map((x) => {return humanReadableQuery(insertAttr(x))}).join("") + ")"
    case "is": return "(" + mkLabel(q.attribute) + " = " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case "is not": return "(" + mkLabel(q.attribute) + " ≠ " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case "<": return "(" + mkLabel(q.attribute) + " < " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case "<=": return "(" + mkLabel(q.attribute) + " ≤ " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case ">": return "(" + mkLabel(q.attribute) + " > " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case ">=": return "(" + mkLabel(q.attribute) + " ≥ " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
  }
}


const columns = [{
  dataField: 'source',
  text: 'Source'
}, {
  dataField: 'counts',
  text: 'Counts'
}];


// const buildQbs = (eav_data, hpo_data) => {
//   var ret = {
//     'age': {label: 'Age', queryId: 'age', type:'BetweenBuilder'},
//     'and': {label: 'All of', queryId: 'and', type:'EmptyBuilder', canHaveChildren: true},
//     'or': {label: 'Any of', queryId: 'or', type:'EmptyBuilder', canHaveChildren: true}
//   };
//   Object.entries(eav_data).map(([key, options]) => {
//     ret[key] = {
//       label:key, 
//       queryId: key, 
//       type: 'PickerBuilder', 
//       options: options.map((val) => {return {label: val, value: val}}) 
//     }
//   })

//   if(hpo_data){
//     var k = 0;
//     ret['phenotype'] = {
//       label: 'Phenotype',
//       queryId: 'phenotype', 
//       type: 'PhenotypeBuilder', 
//       hpo_data: Object.entries(hpo_data).map(([hpo, ancestors]) => {
//         return {
//           key: k++,
//           hpo: hpo,
//           ancestors: ancestors
//         }
//       })
//     }
//   }
//   return ret;
// }

// const buildQbsNew = (eav_data) => {
//   var ret = {
//     // 'age': {label: 'Age', queryId: 'age', type:'BetweenBuilder'},
//     'and': {label: 'All of', queryId: 'and', type:'EmptyBuilder', canHaveChildren: true},
//     'or': {label: 'Any of', queryId: 'or', type:'EmptyBuilder', canHaveChildren: true}
//   };
//   eav_data.map(e => {
//     if(e.visible){
//       var label;
//       const key = mkLabel(e.attribute);
//       const ty = getType(e.attribute);

//       if ('label' in e) {
//         console.log(e.label)
//         label = e.label
        
//       } else {
//         label = key
//       }

//       ret[key] = {
//         label:label, 
//         queryId: e.attribute, 
//         type: 'PickerBuilder',
//         valueType: ty,
//         arbitraryInput: e.arbitrary_input,
//         queryAttribute: e.attribute,
//         options: 'values' in e ? e.values.map((val) => {return {label: val, value: val}}) : [] 
//       }
//     }
//   });
//   return ret;
// }

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
          backgroundColor:'white', 
          borderColor: 'rgb(222, 235, 255)',
          borderRadius: '3px',
          borderWidth: '2px',
          borderStyle: 'solid',
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

  
  createTreeItem = (id: string, ty: string) => {
    return {
      id: id,
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      type: this.props.queryBuilders[ty].type,
      data: this.props.queryBuilders[ty],
    };
  }

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
        const { counter, tree } = this.state;
        const newTree = this.addItemToRoot(tree, counter, selectedOption.value);

        this.setState({
          counter: counter+1,
          tree: newTree,
        });
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
          if(result)
            this.setState({
              isLoaded: true,
              tree: JSON.parse(result)
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
              onDragEnd={this.onDragEnd}
              offsetPerLevel={PADDING_PER_LEVEL}
              isDragEnabled isNestingEnabled
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
                  <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Original Query:</h4>
                  <AkCodeBlock 
                    language="text" 
                    text={JSON.stringify(this.state.query, null, 2)} 
                    showLineNumbers={false}/>
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
                </div>}
            </div>

          </div>
        </ContentWrapper>
      );
    }
  }
}
