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

/**
 * The AttributeValues model module.
 * @module model/AttributeValues
 * @version 0.1.0
 */
class AttributeValues {
    /**
     * Constructs a new <code>AttributeValues</code>.
     * @alias module:model/AttributeValues
     * @param attribute {Object} 
     */
    constructor(attribute) { 
        
        AttributeValues.initialize(this, attribute);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, attribute) { 
        obj['attribute'] = attribute;
    }

    /**
     * Constructs a <code>AttributeValues</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AttributeValues} obj Optional instance to populate.
     * @return {module:model/AttributeValues} The populated <code>AttributeValues</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new AttributeValues();

            if (data.hasOwnProperty('attribute')) {
                obj['attribute'] = ApiClient.convertToType(data['attribute'], Object);
            }
            if (data.hasOwnProperty('string')) {
                obj['string'] = ApiClient.convertToType(data['string'], 'String');
            }
            if (data.hasOwnProperty('limit')) {
                obj['limit'] = ApiClient.convertToType(data['limit'], 'Number');
            }
        }
        return obj;
    }


}

/**
 * @member {Object} attribute
 */
AttributeValues.prototype['attribute'] = undefined;

/**
 * @member {String} string
 */
AttributeValues.prototype['string'] = undefined;

/**
 * @member {Number} limit
 */
AttributeValues.prototype['limit'] = undefined;






export default AttributeValues;

