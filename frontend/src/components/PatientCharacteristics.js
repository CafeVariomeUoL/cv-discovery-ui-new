import React from 'react';
import Select from '@atlaskit/select';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Button from '@atlaskit/button';


const PatientCharacteristics = () => (
  <div style={{marginBottom: '0.5em'}}>
  <h3>Patient Characteristics</h3>
  <Grid>
    <GridColumn medium={5}>
      <Select
        style={{maxWidth:'30%'}}
        className="single-select"
        classNamePrefix="react-select"
        placeholder="Select attribute"
      />
    </GridColumn>
    <GridColumn medium={2}>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'IS', value: 'IS' },
          { label: 'IS LIKE', value: 'IS LIKE' },
          { label: 'IS NOT', value: 'IS NOT' },
          { label: 'IS NOT LIKE', value: 'IS NOT LIKE' },
          { label: '=', value: 'IS' },
          { label: '≠', value: 'IS NOT' },
          { label: '<', value: '<' },
          { label: '>', value: '>' },
          { label: '<=', value: '<=' },
          { label: '>=', value: '>=' },
        ]}
        placeholder="Select operator"
      />
    </GridColumn>
    <GridColumn>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        placeholder="Select value"
      />
    </GridColumn>
  </Grid>
  </div>
);

export default PatientCharacteristics;
