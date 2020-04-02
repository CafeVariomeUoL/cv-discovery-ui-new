"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _AnyOfobjectstring = _interopRequireDefault(require("./AnyOfobjectstring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The BaseQuery model module.
 * @module model/BaseQuery
 * @version 0.1.0
 */
var BaseQuery = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BaseQuery</code>.
   * @alias module:model/BaseQuery
   * @param attribute {module:model/AnyOfobjectstring} 
   * @param operator {module:model/BaseQuery.OperatorEnum} 
   * @param value {String} 
   */
  function BaseQuery(attribute, operator, value) {
    _classCallCheck(this, BaseQuery);

    BaseQuery.initialize(this, attribute, operator, value);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(BaseQuery, null, [{
    key: "initialize",
    value: function initialize(obj, attribute, operator, value) {
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

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BaseQuery();

        if (data.hasOwnProperty('attribute')) {
          obj['attribute'] = _ApiClient.default.convertToType(data['attribute'], _AnyOfobjectstring.default);
        }

        if (data.hasOwnProperty('operator')) {
          obj['operator'] = _ApiClient.default.convertToType(data['operator'], 'String');
        }

        if (data.hasOwnProperty('value')) {
          obj['value'] = _ApiClient.default.convertToType(data['value'], 'String');
        }
      }

      return obj;
    }
  }]);

  return BaseQuery;
}();
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
var _default = BaseQuery;
exports.default = _default;