/**
 * Fast API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
import AnyOfobjectstring from './AnyOfobjectstring';

/**
 * The BaseQuery model module.
 * @module model/BaseQuery
 * @version 0.1.0
 */
class BaseQuery {
    /**
     * Constructs a new <code>BaseQuery</code>.
     * @alias module:model/BaseQuery
     * @param attribute {module:model/AnyOfobjectstring} 
     * @param operator {module:model/BaseQuery.OperatorEnum} 
     * @param value {String} 
     */
    constructor(attribute, operator, value) { 
        
        BaseQuery.initialize(this, attribute, operator, value);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, attribute, operator, value) { 
        obj['attribute'] = attribute;
        obj['operator'] = operator;
        obj['value'] = value;
    }

    /**
     * Constructs a <code>BaseQuery</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BaseQuery} obj Optional instance to populate.
     * @return {module:model/BaseQuery} The populated <code>BaseQuery</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new BaseQuery();

            if (data.hasOwnProperty('attribute')) {
                obj['attribute'] = ApiClient.convertToType(data['attribute'], AnyOfobjectstring);
            }
            if (data.hasOwnProperty('operator')) {
                obj['operator'] = ApiClient.convertToType(data['operator'], 'String');
            }
            if (data.hasOwnProperty('value')) {
                obj['value'] = ApiClient.convertToType(data['value'], 'String');
            }
        }
        return obj;
    }


}

/**
 * @member {module:model/AnyOfobjectstring} attribute
 */
BaseQuery.prototype['attribute'] = undefined;

/**
 * @member {module:model/BaseQuery.OperatorEnum} operator
 */
BaseQuery.prototype['operator'] = undefined;

/**
 * @member {String} value
 */
BaseQuery.prototype['value'] = undefined;





/**
 * Allowed values for the <code>operator</code> property.
 * @enum {String}
 * @readonly
 */
BaseQuery['OperatorEnum'] = {

    /**
     * value: "is"
     * @const
     */
    "is": "is",

    /**
     * value: "is like"
     * @const
     */
    "is like": "is like",

    /**
     * value: "is not"
     * @const
     */
    "is not": "is not",

    /**
     * value: "is not like"
     * @const
     */
    "is not like": "is not like",

    /**
     * value: "<"
     * @const
     */
    "LESS_THAN": "<",

    /**
     * value: "<="
     * @const
     */
    "LESS_THAN_OR_EQUAL_TO": "<=",

    /**
     * value: ">"
     * @const
     */
    "GREATER_THAN": ">",

    /**
     * value: ">="
     * @const
     */
    "GREATER_THAN_OR_EQUAL_TO": ">="
};



export default BaseQuery;

