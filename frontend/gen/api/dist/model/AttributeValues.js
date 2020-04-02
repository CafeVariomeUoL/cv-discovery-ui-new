"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The AttributeValues model module.
 * @module model/AttributeValues
 * @version 0.1.0
 */
var AttributeValues = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AttributeValues</code>.
   * @alias module:model/AttributeValues
   * @param attribute {Object} 
   */
  function AttributeValues(attribute) {
    _classCallCheck(this, AttributeValues);

    AttributeValues.initialize(this, attribute);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(AttributeValues, null, [{
    key: "initialize",
    value: function initialize(obj, attribute) {
      obj['attribute'] = attribute;
    }
    /**
     * Constructs a <code>AttributeValues</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AttributeValues} obj Optional instance to populate.
     * @return {module:model/AttributeValues} The populated <code>AttributeValues</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AttributeValues();

        if (data.hasOwnProperty('attribute')) {
          obj['attribute'] = _ApiClient.default.convertToType(data['attribute'], Object);
        }

        if (data.hasOwnProperty('string')) {
          obj['string'] = _ApiClient.default.convertToType(data['string'], 'String');
        }

        if (data.hasOwnProperty('limit')) {
          obj['limit'] = _ApiClient.default.convertToType(data['limit'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return AttributeValues;
}();
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
var _default = AttributeValues;
exports.default = _default;