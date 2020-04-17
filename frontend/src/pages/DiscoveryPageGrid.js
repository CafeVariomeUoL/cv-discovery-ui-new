import React, { Component, Fragment } from 'react';

import Spinner from '@atlaskit/spinner';
import ModalDialog, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import ToggleStateless from '@atlaskit/toggle';

import { Alert,Radio } from 'antd';

import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { mkLabel, getType, mergeExists, removeEmpty, humanReadableQuery, generateFinalQuery, pruneTree, mkQueryTree, collectQueries } from '../utils/utils'

import { typeMap } from '../components/types'

import styled from 'styled-components';

import { Responsive, WidthProvider } from 'react-grid-layout';


import Button, { ButtonGroup } from '@atlaskit/button';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Select from '@atlaskit/select';

import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';

import { AkCode, AkCodeBlock } from '@atlaskit/code';
import BootstrapTable from 'react-bootstrap-table-next';
import Collapsible from 'react-collapsible';

import { CSSTransition } from 'react-transition-group';
import'./animations.css'


const queryBuilders = Object.keys(typeMap).filter(e => 'settings_type' in typeMap[e]).map(e => {return {value:e, label: typeMap[e].label}})

const ResponsiveGridLayout = WidthProvider(Responsive);


const columns = [{
  dataField: 'source',
  text: 'Source'
}, {
  dataField: 'counts',
  text: 'Counts'
}];


const breakpoints = {lg: 720, md: 600, sm: 480, xs: 360}


export default class DiscoveryPageGrid extends Component {
  gridRef = React.createRef();

  componentRefs = {};

  state = {
    counter:0,
    settingsModalKey:null,
    layouts: {lg:[], md:[], sm:[], xs:[]},
    components: {},
    queries: {},
    results: [],
    isLoaded: false,
    debug: false,
    edit: false,
    // error:'aadfbdfbmdfhkdfzjkhdfkfkjfkjfakjhfdkhjfdkjhfadkfkfkfkhjdfbmndfkfdkhdfkhjdfklhdeklhjsdLKwdlkdewlkwdkldkaa'
  };


  componentDidMount() {
    fetch(
      process.env.REACT_APP_API_URL+"/discovery/loadSettings?id="+this.props.match.params.id, {
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
            const parsed = JSON.parse(result);
            // console.log(JSON.parse(result));
            // console.log("prune&mkQueryTree:", pruneTree(mkQueryTree(JSON.parse(result))));
            this.setState({
              isLoaded: true,
              components: parsed.components,
              layouts: parsed.layouts,
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

  componentDidMount() {
    fetch(
      process.env.REACT_APP_API_URL+"/discovery/loadSettings?id="+this.props.match.params.id, {
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
          console.log(result);
          if(result){
            const parsed = JSON.parse(result);
            // console.log(JSON.parse(result));
            // console.log("prune&mkQueryTree:", pruneTree(mkQueryTree(JSON.parse(result))));

            const items = Object.keys(parsed.components);
            var maxVal = 0, v;
            for (var i = 0; i < items.length; i++) {
              v = parseInt(items[i]);
              if(v > maxVal) maxVal = v;
            }

            this.setState({
              isLoaded: true,
              components: parsed.components,
              layouts: parsed.layouts,
              counter: maxVal+1
            });
          } else {
            this.setState({
              isLoaded: true,
              info: `The discovery page '${this.props.match.params.id}' does not exist yet. To create it, press edit...`
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


  renderFromComponent = (key, item) => {
    const TypeTag = typeMap[item.type].type
    return <TypeTag setQuery={this.storeQuery(`${key}`)} ref={(elem) => this.componentRefs[key] = elem} {...item.data}/>
  }

  renderBuilderFromComponent = (key, item) => {
    const TypeTag = typeMap[item.type].settings_type
    return <TypeTag setData={this.storeData(`${key}`)} data={item.data} settings_id={this.props.match.params.id}/>
  }


  storeQuery = (id) => {
    return (query_data) => {
      this.setState((prevState,_) => ({
        queries: {... prevState.queries, [id]: query_data},
        // query: collectQueries(prevState.tree, 'root', {... prevState.queries, [id]: query_data})
      }));
    }
  }

  storeData = (id) => {
    return (data) => {
      var newComponents = {...this.state.components}
      newComponents[id].data = data
      
      this.setState({ components: newComponents });
    }
  }

  // we only want to update if we are not in the modal dialog, since any up update will automatically close it
  shouldComponentUpdate(nextProps, nextState) { 
    // console.log(nextState.settingsModalKey, this.state.settingsModalKey)
    return (!nextState.settingsModalKey || nextState.settingsModalKey !== this.state.settingsModalKey);
  }



  runQuery = () => {
    this.setState({
      showLoadingState: true
    });
    // const jsAPIQuery = generateJsonAPIQuery(this.state.query)
    // console.log(JSON.stringify({'query': { 'operator':'and', 'children': this.state.queries}}));
    fetch(
      process.env.REACT_APP_API_URL+"/query", {
        method:'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({'query': generateFinalQuery(Object.values(this.state.queries))})
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



  

  getOffset = () => {
    const { isLoaded, error, info } = this.state;
    let offset = 0;
    if (error) offset += 40;
    if (info) offset += 40;
    if (!isLoaded) offset += 40;
    return offset;
  }

  onLayoutChange = (layout: Layout, layouts: {[string]: Layout}) => {
    this.setState({layouts: layouts});
  }

  toggleEdit = () => {
    this.setState((oldState,_) => {
      const newLayouts = {};
      for (var i = 0; i < Object.keys(oldState.layouts).length; i++) {
        const k = Object.keys(oldState.layouts)[i];
        newLayouts[k] = oldState.layouts[k].map((e) => {return {...e, static: !e.static}});
      }

      

      return {...oldState, edit: !oldState.edit, maxWidthEdit:null, layouts:newLayouts}
    }, () => {
      if(!this.state.edit){
        console.log("saving...")
        this.saveSettings();
      }
      this.gridRef.current.onWindowResize()
    })
  }

  deleteItem = (k) => () => {
    const newComponents = {...this.state.components};
    delete newComponents[k];
    const newLayouts = {};

    for (var i = 0; i < Object.keys(this.state.layouts).length; i++) {
      const layout_key = Object.keys(this.state.layouts)[i];
      newLayouts[layout_key] = this.state.layouts[layout_key].filter((i) => i.i !== k)
    }

    this.setState({components: newComponents, layouts: newLayouts});

  }


  addItem = (type) => this.setState((oldState) => {
    const key = oldState.counter;
    const minHeight = typeMap[type].minHeight?typeMap[type].minHeight:2;

    const newComponents = {...oldState.components, [`${key}`]: {type: type}};
    const newLayouts = {};

    for (var i = 0; i < Object.keys(this.state.layouts).length; i++) {
      const layout_key = Object.keys(this.state.layouts)[i];
      console.log(layout_key);
      newLayouts[layout_key] = [...oldState.layouts[layout_key], {i:`${key}`, x:0, y:0, w:6, h:minHeight, minH: minHeight, static:false}]
    }

    return {components: newComponents, layouts: newLayouts, counter: key+1}
  }, this.forceUpdate())

  maxWidthEditChange = (e) => {
    var w = null;
    switch(e.target.value){
      case 'md': w = breakpoints.md+1; break;
      case 'sm': w = breakpoints.sm+1; break;
      case 'xs': w = breakpoints.xs+1; break;
    }
    this.setState({maxWidthEdit: w}, this.gridRef.current.onWindowResize);
  }


  openSettings = (key) => () => this.setState({ settingsModalKey: key })

  closeSettings = () => this.setState({ settingsModalKey: null })

  saveSettings = () => {
    fetch(
      process.env.REACT_APP_API_URL+"/discovery/saveSettings", {
        method:'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({id: this.props.match.params.id, data:{components:this.state.components, layouts:this.state.layouts}})
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(JSON.stringify({id: this.props.match.params.id, data:{components:this.state.components, layouts:this.state.layouts}}));
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error)
        })
  }

  render() {

    const { error, info, debug, isLoaded, layouts, components, edit, maxWidthEdit, settingsModalKey } = this.state;

    const items = Object.keys(components).map((k) => { 
        return (
          <div key={k} >
          <CSSTransition
            in={edit}
            timeout={300}
            classNames="blue"
          >
            <div style={{...(edit?{ background: 'rgb(222, 235, 255)'}:{}), height:'100%'}}>
              <CSSTransition
                in={edit}
                timeout={300}
                classNames="add-menu"
                unmountOnExit
              >
                <div style={{position:'absolute', right:5, top:5, zIndex:5}}>
                  <Button appearance={'subtle'} spacing="none" onClick={this.openSettings(k)}>
                    <EditorSettingsIcon/>
                  </Button>
                  <Button appearance={'subtle'} spacing="none" onClick={this.deleteItem(k)}>
                    <CrossIcon/>
                  </Button>
                </div>
              </CSSTransition>
              <div style={{padding:'5px'}}>
                {this.renderFromComponent(k, components[k])}
              </div>
            </div>
          </CSSTransition>
          </div>)
      })

    return (
      <Page bannerHeight={this.getOffset()}
        isBannerOpen={!isLoaded || error || info}
        banner={
        <Fragment>
        {!isLoaded ?
          (<Alert
            message='Loading interface...'
            banner
            type="info"
          />) : null}
        {error ?
          (<Alert
            message={error}
            banner
            closable
            onClose={() => this.setState({error: null})}
            type="error"
          />) : null}
        {info ?
          (<Alert
            message={info}
            banner
            closable
            onClose={() => this.setState({info: null})}
            type="info"
          />) : null}
        </Fragment>
      }>      
        <ContentWrapper>
          <div style={{display:'flex'}}>
            <PageTitle style={{paddingTop: '10px'}}>Discover - Query Builder</PageTitle> 
            <span style={{paddingLeft:'15px', marginTop:'13px'}}>
              <Button 
                appearance={!edit?"subtle":"primary"} 
                onClick={this.toggleEdit}>
                {edit?'Save':'Edit'}
              </Button>
            </span>
            
            <span style={{paddingLeft:'15px', marginTop:'16px'}}>
              <ToggleStateless isDefaultChecked={this.state.debug} onChange={() => this.setState({debug: !this.state.debug})}/>
            </span>
            <span style={{marginTop:'19px', fontSize: '14px'}}>
              Debug mode
            </span>
          </div>
          <section style={{marginBottom: '20px'}}>
            <p>
              I am searching for records which include:
            </p>
            
          </section>

          <CSSTransition
            in={edit}
            timeout={300}
            classNames="width-box"
            unmountOnExit
          >
            <div style={{padding: '0px', display:'flex', justifyContent: 'center'}}>
              <Radio.Group onChange={this.maxWidthEditChange} defaultValue="lg">
                <Radio.Button value="lg">Large</Radio.Button>
                <Radio.Button value="md">Medium</Radio.Button>
                <Radio.Button value="sm">Small</Radio.Button>
                <Radio.Button value="xs">Extra Small</Radio.Button>
              </Radio.Group>
            </div>
        </CSSTransition>


          <CSSTransition
            in={edit}
            timeout={300}
            classNames="outline"
          >
            <div style={{
              ...(maxWidthEdit?{maxWidth:`${maxWidthEdit}px`} :{}), 
              padding:'10px', marginBottom:'30px', marginLeft: 'auto', marginRight: 'auto'}}>
            <ResponsiveGridLayout className="discovery-grid" 
              breakpoints={breakpoints}
              cols={{lg: 6, md: 4, sm: 1, xs: 1}}
              layouts={layouts}
              rowHeight={40}
              ref={this.gridRef}
              onLayoutChange={this.onLayoutChange}>
              {items}
            </ResponsiveGridLayout>
            </div>
          </CSSTransition>

          <CSSTransition
            in={!edit}
            timeout={300}
            classNames="query-table"
            unmountOnExit
          >
            <div style={{margin:'0px', padding:'0px'}}>
              <Button isLoading={this.state.showLoadingState} appearance="primary" onClick={this.runQuery}>Run query</Button>
              <h4 style={{paddingBottom:'10px'}}>Results:</h4>
              <BootstrapTable keyField='id' data={ this.state.results } columns={ columns } />
           
              {debug &&
              <div>
                <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Human readable Query:</h4>
                <AkCodeBlock 
                  language="text" 
                  text={humanReadableQuery(generateFinalQuery(Object.values(this.state.queries)), null, 2)} 
                  showLineNumbers={false}/>
                
                <h4 style={{paddingBottom:'10px'}}>API query:</h4>
                <AkCodeBlock 
                  language="json" 
                  text={JSON.stringify(generateFinalQuery(Object.values(this.state.queries)), null, 2)} 
                  showLineNumbers={false}/>
                <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Raw Queries:</h4>
                <AkCodeBlock 
                  language="json" 
                  text={JSON.stringify(this.state.queries, null, 2)} 
                  showLineNumbers={false}/>
              </div>}
            </div>
          </CSSTransition>

          <CSSTransition
            in={edit}
            timeout={300}
            classNames="add-menu"
            unmountOnExit
          >
          <div style={{margin:'0px', padding:'0px'}}>
            <h4 style={{paddingBottom:'10px'}}>Add a query builder:</h4>
            <Select
              options={queryBuilders}
              onChange={(k) => this.addItem(k.value)}
              placeholder="Select a box to add" />

            {debug && 
            <div>
              <h4 style={{paddingTop:'30px', paddingBottom:'10px'}}>Tree:</h4>
              <AkCodeBlock 
                language="json" 
                text={JSON.stringify({components:this.state.components, layouts:this.state.layouts}, null, 2)} 
                showLineNumbers={false}/>
            </div>}
          </div>
        </CSSTransition>


         <ModalTransition>
          {settingsModalKey && (
            <ModalDialog
              heading={`Settings - ${typeMap[components[settingsModalKey].type].label}`}
              width="large"
              onClose={() =>{ this.closeSettings() } }
              components={{
                Container: ({ children, className }: ContainerProps) => (
                  <div className={className}>
                    {children}
                  </div>
                ),
                Footer: (props: FooterProps) => (
                  <ModalFooter showKeyline={props.showKeyline}>
                    <span />
                    <Button appearance="primary" onClick={this.closeSettings}>
                      Done
                    </Button>
                  </ModalFooter>
                )
              }}
            >
              {this.renderBuilderFromComponent(settingsModalKey, components[settingsModalKey])}
            </ModalDialog>
          )}
        </ModalTransition>
       
        </ContentWrapper>
      </Page>
    );
  }


}
