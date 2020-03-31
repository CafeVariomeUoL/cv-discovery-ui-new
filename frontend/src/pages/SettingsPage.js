import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';

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


// import PatientCharacteristics from './PatientCharacteristics';
// import VariantBuilder from './VariantBuilder';
// import BetweenBuilder from './BetweenBuilder';
// import PhenotypeBuilder from './PhenotypeBuilder';
// import EmptyBuilderSettings from '../components/settings/EmptyBuilderSettings';
// import PickerBuilderSettings from '../components/settings/PickerBuilderSettings';

// import { jsonAPI } from './jsonAPI';
// import { mergeExists, mkLabel } from './utils';
import { typeMap } from '../components/Types'


const PADDING_PER_LEVEL = 30;





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


const queryBuilders = Object.keys(typeMap).filter(e => 'settings_type' in typeMap[e]).map(e => {return {value:e, label: typeMap[e].label}})

export default class SettingsPage extends Component<Props, State> {

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
    }
  }



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
            const newTree = JSON.parse(result)

            const items = Object.keys(newTree.items);
            var maxVal = 0, v;
            for (var i = 0; i < items.length; i++) {
              v = parseInt(items[i]);
              if(v > maxVal) maxVal = v;
            }

            this.setState({
              tree: newTree,
              counter: maxVal+1
            });
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            error: error
          });
        }
      )
  }



  storeData = (id) => {
    return (data) => {
      var newTree = {...this.state.tree}
      newTree.items[id].data = data
      
      this.setState({
        tree: newTree,
      });
    }
  }


  renderBuilderFromTreeItem = (item: TreeItem) => {
    const TypeTag = typeMap[item.type].settings_type
    return <TypeTag setData={this.storeData(item.id)} data={item.data}/>
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
      type: ty,
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
        const { counter, tree } = this.state;
        const newTree = this.addItemToRoot(tree, counter, selectedOption.value);

        this.setState({
          counter: counter+1,
          tree: newTree,
        });
  };

  saveTree = () => {
    fetch(
      "http://localhost:8002/discovery/saveSettings", {
        method:'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({id: this.props.match.params.id, data:this.state.tree})
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error)
        })
  }

  render() {
    const { tree } = this.state;

    return (
      <ContentWrapper>
        <PageTitle>Settings</PageTitle>
        <h2 style={{marginBottom: '20px'}}>Discovery page {this.props.match.params.id} settings</h2>
        <Tree
          tree={tree}
          renderItem={this.renderItem}
          onDragEnd={this.onDragEnd}
          offsetPerLevel={PADDING_PER_LEVEL}
          isDragEnabled
        />
        <div style={{marginTop:'100px'}}>
          <h4 style={{paddingBottom:'10px'}}>Add a query builder:</h4>
          <Select
            options={queryBuilders}
            onChange={this.handleChange}
            placeholder="Select a box to add" />
        </div>
        <div style={{marginTop:'20px'}}>
        <Button appearance="primary" onClick={this.saveTree}>Save settings</Button>
        </div>
         <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Tree:</h4>
              <AkCodeBlock 
                language="text" 
                text={JSON.stringify(this.state.tree, null, 2)} 
                showLineNumbers={false}/>
      </ContentWrapper> 
    );
  }
}
