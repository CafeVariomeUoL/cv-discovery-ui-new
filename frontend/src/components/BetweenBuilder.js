import React from 'react';
import Textfield from '@atlaskit/textfield';
import { Grid, GridColumn } from '@atlaskit/page';
import { mkAttrQuery } from './utils';

export default class BetweenBuilder extends React.Component {

  state = {
    value1: '',
    value2: '',
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

  handleChange = prop_name => e =>  {
    const newState = {...this.state};
    newState[prop_name] = e.target.value;
    this.setState(newState);
    this.props.setQuery(this.mkQuery(newState));
  }

  render() {
    return (
      <div style={{marginBottom: '0.5em'}}>
        <h3 style={{paddingBottom: '0.5em'}}>{this.props.label}</h3>
        <Grid>
          <GridColumn medium={2}>
            <h5 style={{ 
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              textAlign: 'center'
            }}>Between</h5>
          </GridColumn>
          <GridColumn medium={4}>
            <Textfield
                name="value-low"
                onChange={this.handleChange('value1')} 
              />
          </GridColumn>
          <GridColumn>
            <h5 style={{ 
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}>and</h5>
          </GridColumn>
          <GridColumn medium={4}>
            <Textfield
                name="value-high"
                onChange={this.handleChange('value2')}
              />
          </GridColumn>
        </Grid>  
      </div>
    );
  }
}