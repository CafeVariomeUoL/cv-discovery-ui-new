// export {default as VariantBuilder} from './VariantBuilder';

import {typeMap as typeMapWOQueryTree} from './typesWOQueryTree'

import QueryTree from './QueryTree';

import QueryTreeSettings from './settings/QueryTreeSettings';



export const typeMap = {...typeMapWOQueryTree,
	'QueryTree': { 
    	type: QueryTree, 
    	settings_type: QueryTreeSettings,
    	label: 'Query tree' 
    },
}