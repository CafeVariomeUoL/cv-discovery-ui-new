import React from 'react';
import { Slider } from 'antd';
import { Grid, GridColumn } from '@atlaskit/page';
import { mkAttrQuery } from '../utils/utils';
import './Slider.css'
// import 'antd/dist/antd.css'

export default class SliderBetweenBuilder extends React.Component {

  state = {
    value1: Math.round((this.props.maxVal-this.props.minVal)/3),
    value2: Math.round(2*(this.props.maxVal-this.props.minVal)/3)
  }

  mkQuery = s => {
    return {
      operator:"and",
      children: [
        mkAttrQuery(this.props.attribute, (v)=>v, '>=', s.value1),
        mkAttrQuery(this.props.attribute, (v)=>v, '<=', s.value2)
      ]
    }
  }

  componentDidMount() {
    this.props.setQuery(this.mkQuery(this.state));
  }

  handleChange = e => {
    const newState = {
      value1: e[0],
      value2: e[1],
    }
    this.setState(newState);
    this.props.setQuery(this.mkQuery(newState));
  }

  render() {
    return (
      <div style={{marginBottom: '0.5em'}}>
        <h3 style={{paddingBottom: '0.5em'}}>{this.props.label?this.props.label:'<Label>'}</h3>
        <Grid>
          <GridColumn>
              <Slider range
                min={this.props.minVal} 
                max={this.props.maxVal} 
                step={this.props.step}
                onChange={this.handleChange}
                defaultValue={[Math.round((this.props.maxVal-this.props.minVal)/3), Math.round(2*(this.props.maxVal-this.props.minVal)/3)]} 
                />
          </GridColumn>
        </Grid>  
      </div>
    );
  }
}