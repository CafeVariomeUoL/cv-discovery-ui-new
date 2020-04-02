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
 * The AttributeMeta model module.
 * @module model/AttributeMeta
 * @version 0.1.0
 */
var AttributeMeta = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AttributeMeta</code>.
   * @alias module:model/AttributeMeta
   * @param attribute {Object} 
   */
  function AttributeMeta(attribute) {
    _classCallCheck(this, AttributeMeta);

    AttributeMeta.initialize(this, attribute);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(AttributeMeta, null, [{
    key: "initialize",
    value: function initialize(obj, attribute) {
      obj['attribute'] = attribute;
    }
    /**
     * Constructs a <code>AttributeMeta</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AttributeMeta} obj Optional instance to populate.
     * @return {module:model/AttributeMeta} The populated <code>AttributeMeta</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AttributeMeta();

        if (data.hasOwnProperty('attribute')) {
          obj['attribute'] = _ApiClient.default.convertToType(data['attribute'], Object);
        }

        if (data.hasOwnProperty('label')) {
          obj['label'] = _ApiClient.default.convertToType(data['label'], 'String');
        }

        if (data.hasOwnProperty('visible')) {
          obj['visible'] = _ApiClient.default.convertToType(data['visible'], 'Boolean');
        }

        if (data.hasOwnProperty('arbitrary_input')) {
          obj['arbitrary_input'] = _ApiClient.default.convertToType(data['arbitrary_input'], 'Boolean');
        }
      }

      return obj;
    }
  }]);

  return AttributeMeta;
}();
/**
 * @member {Object} attribute
 */


AttributeMeta.prototype['attribute'] = undefined;
/**
 * @member {String} label
 */

AttributeMeta.prototype['label'] = undefined;
/**
 * @member {Boolean} visible
 */

AttributeMeta.prototype['visible'] = undefined;
/**
 * @member {Boolean} arbitrary_input
 */

AttributeMeta.prototype['arbitrary_input'] = undefined;
var _default = AttributeMeta;
exports.default = _default;