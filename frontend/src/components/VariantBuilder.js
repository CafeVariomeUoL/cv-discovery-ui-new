import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { getAttributeValues } from '../utils/api'
import { mkAttrQuery } from '../utils/utils';


export default class ValueBuilder extends React.Component {
  state = {
    genome: '',
    chr: '',
    chr_opts: [],
    chr_start: '',
    chr_end: '',
    ref: '',
    ref_opts: [],
    alt: '',
    alt_opts: [],
  }


  componentDidMount() {

    if(this.props.chr) getAttributeValues(this.props.chr,
      (result) => {
        console.log("chr: ", result);
         if(result) this.setState((oldState, _) => 
          {return {...oldState, chr_opts: result.map((e) => {return {key: e, label:e, value:e}})}});
      },
      (error) => {
        console.log(error)
      }
    )

    if(this.props.ref_)  getAttributeValues(this.props.ref_,
      (result) => {
        console.log("ref: ", result);
        if(result) this.setState((oldState, _) => 
          {return {...oldState, ref_opts: result.map((e) => {return {key: e, label:e, value:e}})}});
      },
      (error) => {
        console.log(error)
      }
    )

    if(this.props.alt) getAttributeValues(this.props.alt,
      (result) => {
        console.log("alt: ", result);
         if(result) this.setState((oldState, _) => 
          {return {...oldState, alt_opts: result.map((e) => {return {key: e, label:e, value:e}})}});
      },
      (error) => {
        console.log(error)
      }
    )

    this.props.setQuery(this.mkQuery(this.state));

  }


  mkQuery = state => {
    return {
        operator:"and",
        children: [
          mkAttrQuery(this.props.assembly, (v)=>v, 'is', state.assembly),
          mkAttrQuery(this.props.chr, (v)=>v, 'is', state.chr),
          mkAttrQuery(this.props.chr_start, (v)=>v, 'is', state.chr_start),
          mkAttrQuery(this.props.chr_end, (v)=>v, 'is', state.chr_end),
          mkAttrQuery(this.props.ref_, (v)=>v, 'is', state.ref),
          mkAttrQuery(this.props.alt, (v)=>v, 'is', state.alt),
        ]
      }
  }

  handleChange = prop_name => e =>  {

    const newState = {...this.state};
    if (prop_name === 'chr_start' || prop_name === 'chr_end') {
      newState[prop_name] = e.target.value;
    } else {
      newState[prop_name] = e.value;
    }
    
    this.setState(newState);
    this.props.setQuery(this.mkQuery(newState));
  }

  render() {  

    return(
      <div style={{marginBottom: '0.5em'}}>
        <h3 style={{paddingBottom: '0.5em'}}>Variant</h3>
        <Grid>
          <GridColumn medium={2}>
            <Select
              style={{maxWidth:'30%'}}
              className="single-select"
              classNamePrefix="react-select"
              placeholder="Genome"
              options={[
                { label: 'GRCh37', value: 'GRCh37' },
                { label: 'GRCh38', value: 'GRCh38' },
              ]}
              onChange={this.handleChange('assembly')} 
            />
          </GridColumn>
          <GridColumn medium={2}>
            <Select
              placeholder="Select input"
              options={this.state.chr_opts}
              onChange={this.handleChange('chr')} 
            />
          </GridColumn>
          <GridColumn medium={2}>
          <Textfield
                placeholder="Chr start"
                onChange={this.handleChange('chr_start')}
              />
          </GridColumn>
          <GridColumn medium={2}>
          <Textfield
                placeholder="Chr end"
                onChange={this.handleChange('chr_end')}
              />
          </GridColumn>
          <GridColumn medium={2}>
            <Select
              placeholder="REF"
              options={this.state.ref_opts}
              onChange={this.handleChange('ref')}
            />
          </GridColumn>
          <GridColumn>
            <Select
              className="single-select"
              classNamePrefix="react-select"
              placeholder="ALT"
              options={this.state.alt_opts}
              onChange={this.handleChange('alt')} 
            />
          </GridColumn>
        </Grid>
      </div>
    );
  }
}