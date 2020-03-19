import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';


const VariantBuilder = () => (
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
      />
    </GridColumn>
    <GridColumn medium={2}>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        placeholder="Select input"
      />
    </GridColumn>
    <GridColumn medium={2}>
    <Textfield
          name="event-handlers"
          placeholder="Chr start"
        />
    </GridColumn>
    <GridColumn medium={2}>
    <Textfield
          name="event-handlers"
          placeholder="Chr end"
        />
    </GridColumn>
    <GridColumn medium={2}>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        placeholder="REF"
      />
    </GridColumn>
    <GridColumn>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        placeholder="ALT"
      />
    </GridColumn>
  </Grid>
  </div>
);

export default VariantBuilder;
