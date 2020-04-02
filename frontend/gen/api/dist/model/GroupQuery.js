"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _AnyOfBaseQueryGroupQuery = _interopRequireDefault(require("./AnyOfBaseQueryGroupQuery"));

var _AnyOfstringstring = _interopRequireDefault(require("./AnyOfstringstring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The GroupQuery model module.
 * @module model/GroupQuery
 * @version 0.1.0
 */
var GroupQuery = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>GroupQuery</code>.
   * @alias module:model/GroupQuery
   * @param children {Array.<module:model/AnyOfBaseQueryGroupQuery>} 
   * @param operator {module:model/AnyOfstringstring} 
   */
  function GroupQuery(children, operator) {
    _classCallCheck(this, GroupQuery);

    GroupQuery.initialize(this, children, operator);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(GroupQuery, null, [{
    key: "initialize",
    value: function initialize(obj, children, operator) {
      obj['children'] = children;
      obj['operator'] = operator;
    }
    /**
     * Constructs a <code>GroupQuery</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GroupQuery} obj Optional instance to populate.
     * @return {module:model/GroupQuery} The populated <code>GroupQuery</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new GroupQuery();

        if (data.hasOwnProperty('children')) {
          obj['children'] = _ApiClient.default.convertToType(data['children'], [_AnyOfBaseQueryGroupQuery.default]);
        }

        if (data.hasOwnProperty('operator')) {
          obj['operator'] = _ApiClient.default.convertToType(data['operator'], _AnyOfstringstring.default);
        }

        if (data.hasOwnProperty('from')) {
          obj['from'] = _ApiClient.default.convertToType(data['from'], Object);
        }
      }

      return obj;
    }
  }]);

  return GroupQuery;
}();
/**
 * @member {Array.<module:model/AnyOfBaseQueryGroupQuery>} children
 */


GroupQuery.prototype['children'] = undefined;
/**
 * @member {module:model/AnyOfstringstring} operator
 */

GroupQuery.prototype['operator'] = undefined;
/**
 * @member {Object} from
 */

GroupQuery.prototype['from'] = undefined;
var _default = GroupQuery;
exports.default = _default;