import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import MainSection from '../components/MainSection';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import QueryTree from '../components/QueryTree';


const buildQbs = (eav_data, hpo_data) => {
  var ret = {
    'age': {label: 'Age', queryId: 'age', type:'BetweenBuilder'},
    'and': {label: 'All of', queryId: 'and', type:'EmptyBuilder', canHaveChildren: true},
    'or': {label: 'Any of', queryId: 'or', type:'EmptyBuilder', canHaveChildren: true}
  };
  Object.entries(eav_data).map(([key, options]) => {
    ret[key] = {
      label:key, 
      queryId: key, 
      type: 'PickerBuilder', 
      options: options.map((val) => {return {label: val, value: val}}) 
    }
  })

  if(hpo_data){
    var k = 0;
    ret['phenotype'] = {
      label: 'Phenotype',
      queryId: 'phenotype', 
      type: 'PhenotypeBuilder', 
      hpo_data: Object.entries(hpo_data).map(([hpo, ancestors]) => {
        return {
          key: k++,
          hpo: hpo,
          ancestors: ancestors
        }
      })
    }
  }
  return ret;
}


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      qbs: {}
    };
  }

  // qbs = {
  //   'age': {label: 'Age', type:'BetweenBuilder'},
  //   'age_admitted': {label: 'Age when admitted', type:'BetweenBuilder'},
  //   'gender': {
  //     label: 'Gender', 
  //     type:'PickerBuilder', 
  //     options: [
  //       { label: 'male', value: 'male' },
  //       { label: 'female', value: 'female' },
  //     ]},
  //   'variant': {label: 'Variant',  type:'VariantBuilder'}, 
  //   'and': {label: 'All of', type:'Empty', canHaveChildren: true},
  //   'or': {label: 'Any of', type:'Empty', canHaveChildren: true}
  // };



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
          console.log(result);
          // this.setState({
          //   isLoaded: true,
          //   qbs: buildQbs(result.phen_data, result.hpo_data)
          // });
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
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Spinner size="large" />;
    } else {
      return (
        <ContentWrapper>
          <PageTitle>Discover - Query Builder</PageTitle>
          <MainSection />        
          <QueryTree queryBuilders={this.state.qbs} debug/>
        </ContentWrapper>
      );
    }
  }
}
