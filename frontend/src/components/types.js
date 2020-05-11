// export {default as VariantBuilder} from './VariantBuilder';

import {typeMap as typeMapWOQueryTree} from './typesWOQueryTree'

import QueryTree from './QueryTree';

import QueryTreeSettings from './settings/QueryTreeSettings';

import CountResultView from './CountResultView';
import FullResultView from './FullResultView';
import FullResultViewSettings from './settings/FullResultViewSettings';


export const typeMap = {...typeMapWOQueryTree,
	'QueryTree': { 
    	type: QueryTree, 
    	settings_type: QueryTreeSettings,
    	label: 'Query tree' 
    },
}



export const resultsTypeMap = {
	'CountResultView': { 
    	type: CountResultView,
    	// settings_type: QueryTreeSettings,
    	label: 'Result counts' 
    },
    'FullResultView': { 
    	type: FullResultView,
    	query_tag: 'full',
    	settings_type: FullResultViewSettings,
    	label: 'Full results'
    },
}