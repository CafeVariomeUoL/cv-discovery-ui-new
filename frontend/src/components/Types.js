// export {default as VariantBuilder} from './VariantBuilder';
import VariantBuilder from './VariantBuilder';
import BetweenBuilder from './BetweenBuilder';
import PickerBuilder from './PickerBuilder';
import ValueBuilder from './ValueBuilder';
import PhenotypeBuilder from './PhenotypeBuilder';
import EmptyBuilder from './EmptyBuilder';



// import VariantBuilderSettings from './settings/VariantBuilderSettings';
// import BetweenBuilderSettings from './settings/BetweenBuilderSettings';
import PickerBuilderSettings from './settings/PickerBuilderSettings';
import ValueBuilderSettings from './settings/ValueBuilderSettings';
// import PhenotypeBuilderSettings from './settings/PhenotypeBuilderSettings';
import EmptyBuilderSettings from './settings/EmptyBuilderSettings';



export const typeMap = {
    'EmptyBuilder': {
    	type: EmptyBuilder,
    	settings_type: EmptyBuilderSettings,
    	label: 'Boolean operator group'
    },
    'VariantBuilder': { type: VariantBuilder },
    'BetweenBuilder': { type: BetweenBuilder },
    'PickerBuilder': { 
    	type: PickerBuilder, 
    	settings_type: PickerBuilderSettings,
    	label: 'Dropdown attribute'
    },
    'ValueBuilder': {
    	type: ValueBuilder,
    	settings_type: ValueBuilderSettings,
    	label: 'Text input attribute'
    },
    'PhenotypeBuilder': { type: PhenotypeBuilder },

  }