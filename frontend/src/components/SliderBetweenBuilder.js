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

  componentWillUnmount() {
      this.props.deleteQuery();
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
      <div>
        {this.props.label_position !== 'left' && <h3>{this.props.label?this.props.label:'<Label>'}</h3>}
        <div style={{display:'flex', paddingTop: '0.6em'}}>
          {this.props.label_position === 'left' && 
          <div className="label-left">
            <h5>{this.props.label?this.props.label:'<Label>'}</h5>
          </div>}
          <div style={{flexGrow:2, marginTop:'5px'}}>
              <Slider range
                min={this.props.minVal} 
                max={this.props.maxVal} 
                step={this.props.step}
                onChange={this.handleChange}
                defaultValue={[Math.round((this.props.maxVal-this.props.minVal)/3), Math.round(2*(this.props.maxVal-this.props.minVal)/3)]} 
                />
          </div>
        </div>  
      </div>
    );
  }
}