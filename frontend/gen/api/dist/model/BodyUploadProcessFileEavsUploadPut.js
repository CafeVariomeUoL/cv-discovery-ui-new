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
 * The BodyUploadProcessFileEavsUploadPut model module.
 * @module model/BodyUploadProcessFileEavsUploadPut
 * @version 0.1.0
 */
var BodyUploadProcessFileEavsUploadPut = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BodyUploadProcessFileEavsUploadPut</code>.
   * @alias module:model/BodyUploadProcessFileEavsUploadPut
   * @param uploadFile {File} 
   */
  function BodyUploadProcessFileEavsUploadPut(uploadFile) {
    _classCallCheck(this, BodyUploadProcessFileEavsUploadPut);

    BodyUploadProcessFileEavsUploadPut.initialize(this, uploadFile);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(BodyUploadProcessFileEavsUploadPut, null, [{
    key: "initialize",
    value: function initialize(obj, uploadFile) {
      obj['upload_file'] = uploadFile;
    }
    /**
     * Constructs a <code>BodyUploadProcessFileEavsUploadPut</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BodyUploadProcessFileEavsUploadPut} obj Optional instance to populate.
     * @return {module:model/BodyUploadProcessFileEavsUploadPut} The populated <code>BodyUploadProcessFileEavsUploadPut</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BodyUploadProcessFileEavsUploadPut();

        if (data.hasOwnProperty('upload_file')) {
          obj['upload_file'] = _ApiClient.default.convertToType(data['upload_file'], File);
        }

        if (data.hasOwnProperty('empty_delim')) {
          obj['empty_delim'] = _ApiClient.default.convertToType(data['empty_delim'], ['String']);
        }
      }

      return obj;
    }
  }]);

  return BodyUploadProcessFileEavsUploadPut;
}();
/**
 * @member {File} upload_file
 */


BodyUploadProcessFileEavsUploadPut.prototype['upload_file'] = undefined;
/**
 * @member {Array.<String>} empty_delim
 */

BodyUploadProcessFileEavsUploadPut.prototype['empty_delim'] = undefined;
var _default = BodyUploadProcessFileEavsUploadPut;
exports.default = _default;