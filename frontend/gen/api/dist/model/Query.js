"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _AnyOfBaseQueryGroupQuery = _interopRequireDefault(require("./AnyOfBaseQueryGroupQuery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Query model module.
 * @module model/Query
 * @version 0.1.0
 */
var Query = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Query</code>.
   * @alias module:model/Query
   * @param query {module:model/AnyOfBaseQueryGroupQuery} 
   */
  function Query(query) {
    _classCallCheck(this, Query);

    Query.initialize(this, query);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Query, null, [{
    key: "initialize",
    value: function initialize(obj, query) {
      obj['query'] = query;
    }
    /**
     * Constructs a <code>Query</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Query} obj Optional instance to populate.
     * @return {module:model/Query} The populated <code>Query</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Query();

        if (data.hasOwnProperty('query')) {
          obj['query'] = _ApiClient.default.convertToType(data['query'], _AnyOfBaseQueryGroupQuery.default);
        }
      }

      return obj;
    }
  }]);

  return Query;
}();
/**
 * @member {module:model/AnyOfBaseQueryGroupQuery} query
 */


Query.prototype['query'] = undefined;
var _default = Query;
exports.default = _default;