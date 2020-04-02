"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _AttributeMeta = _interopRequireDefault(require("../model/AttributeMeta"));

var _AttributeValues = _interopRequireDefault(require("../model/AttributeValues"));

var _DiscoverySettings = _interopRequireDefault(require("../model/DiscoverySettings"));

var _HTTPValidationError = _interopRequireDefault(require("../model/HTTPValidationError"));

var _Query = _interopRequireDefault(require("../model/Query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Default service.
* @module api/DefaultApi
* @version 0.1.0
*/
var DefaultApi = /*#__PURE__*/function () {
  /**
  * Constructs a new DefaultApi. 
  * @alias module:api/DefaultApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function DefaultApi(apiClient) {
    _classCallCheck(this, DefaultApi);

    this.apiClient = apiClient || _ApiClient.default.instance;
  }
  /**
   * Callback function to receive the result of the clearDbEavsClearDBPut operation.
   * @callback module:api/DefaultApi~clearDbEavsClearDBPutCallback
   * @param {String} error Error message, if any.
   * @param {Object} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Clear Db
   * @param {module:api/DefaultApi~clearDbEavsClearDBPutCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Object}
   */


  _createClass(DefaultApi, [{
    key: "clearDbEavsClearDBPut",
    value: function clearDbEavsClearDBPut(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/eavs/clearDB', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the getAttributes2DiscoveryGetAttributes2Get operation.
     * @callback module:api/DefaultApi~getAttributes2DiscoveryGetAttributes2GetCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Attributes2
     * @param {module:api/DefaultApi~getAttributes2DiscoveryGetAttributes2GetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "getAttributes2DiscoveryGetAttributes2Get",
    value: function getAttributes2DiscoveryGetAttributes2Get(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/getAttributes2', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the getAttributesDiscoveryGetAttributesGet operation.
     * @callback module:api/DefaultApi~getAttributesDiscoveryGetAttributesGetCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Attributes
     * @param {module:api/DefaultApi~getAttributesDiscoveryGetAttributesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "getAttributesDiscoveryGetAttributesGet",
    value: function getAttributesDiscoveryGetAttributesGet(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/getAttributes', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the getAttributesValsDiscoveryGetAttributeValuesPost operation.
     * @callback module:api/DefaultApi~getAttributesValsDiscoveryGetAttributeValuesPostCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Attributes Vals
     * @param {module:model/AttributeValues} attributeValues 
     * @param {module:api/DefaultApi~getAttributesValsDiscoveryGetAttributeValuesPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "getAttributesValsDiscoveryGetAttributeValuesPost",
    value: function getAttributesValsDiscoveryGetAttributeValuesPost(attributeValues, callback) {
      var postBody = attributeValues; // verify the required parameter 'attributeValues' is set

      if (attributeValues === undefined || attributeValues === null) {
        throw new Error("Missing the required parameter 'attributeValues' when calling getAttributesValsDiscoveryGetAttributeValuesPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/getAttributeValues', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the getSettingsDiscoveryGetSettingsGet operation.
     * @callback module:api/DefaultApi~getSettingsDiscoveryGetSettingsGetCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Settings
     * @param {module:api/DefaultApi~getSettingsDiscoveryGetSettingsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "getSettingsDiscoveryGetSettingsGet",
    value: function getSettingsDiscoveryGetSettingsGet(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/getSettings', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the processFileEavsProcessPut operation.
     * @callback module:api/DefaultApi~processFileEavsProcessPutCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Process File
     * @param {String} fileName 
     * @param {Object} opts Optional parameters
     * @param {String} opts.name 
     * @param {Array.<String>} opts.requestBody 
     * @param {module:api/DefaultApi~processFileEavsProcessPutCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "processFileEavsProcessPut",
    value: function processFileEavsProcessPut(fileName, opts, callback) {
      opts = opts || {};
      var postBody = opts['requestBody']; // verify the required parameter 'fileName' is set

      if (fileName === undefined || fileName === null) {
        throw new Error("Missing the required parameter 'fileName' when calling processFileEavsProcessPut");
      }

      var pathParams = {};
      var queryParams = {
        'file_name': fileName,
        'name': opts['name']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/eavs/process', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the queryQueryPost operation.
     * @callback module:api/DefaultApi~queryQueryPostCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Query
     * @param {module:model/Query} query 
     * @param {module:api/DefaultApi~queryQueryPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "queryQueryPost",
    value: function queryQueryPost(query, callback) {
      var postBody = query; // verify the required parameter 'query' is set

      if (query === undefined || query === null) {
        throw new Error("Missing the required parameter 'query' when calling queryQueryPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/query', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the saveDiscoverySettingsDiscoveryLoadSettingsGet operation.
     * @callback module:api/DefaultApi~saveDiscoverySettingsDiscoveryLoadSettingsGetCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Save Discovery Settings
     * @param {String} id 
     * @param {module:api/DefaultApi~saveDiscoverySettingsDiscoveryLoadSettingsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "saveDiscoverySettingsDiscoveryLoadSettingsGet",
    value: function saveDiscoverySettingsDiscoveryLoadSettingsGet(id, callback) {
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling saveDiscoverySettingsDiscoveryLoadSettingsGet");
      }

      var pathParams = {};
      var queryParams = {
        'id': id
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/loadSettings', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the saveDiscoverySettingsDiscoverySaveSettingsPost operation.
     * @callback module:api/DefaultApi~saveDiscoverySettingsDiscoverySaveSettingsPostCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Save Discovery Settings
     * @param {module:model/DiscoverySettings} discoverySettings 
     * @param {module:api/DefaultApi~saveDiscoverySettingsDiscoverySaveSettingsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "saveDiscoverySettingsDiscoverySaveSettingsPost",
    value: function saveDiscoverySettingsDiscoverySaveSettingsPost(discoverySettings, callback) {
      var postBody = discoverySettings; // verify the required parameter 'discoverySettings' is set

      if (discoverySettings === undefined || discoverySettings === null) {
        throw new Error("Missing the required parameter 'discoverySettings' when calling saveDiscoverySettingsDiscoverySaveSettingsPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/saveSettings', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the setAttributeMetaDiscoverySetAttributeMetaPost operation.
     * @callback module:api/DefaultApi~setAttributeMetaDiscoverySetAttributeMetaPostCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Set Attribute Meta
     * @param {module:model/AttributeMeta} attributeMeta 
     * @param {module:api/DefaultApi~setAttributeMetaDiscoverySetAttributeMetaPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "setAttributeMetaDiscoverySetAttributeMetaPost",
    value: function setAttributeMetaDiscoverySetAttributeMetaPost(attributeMeta, callback) {
      var postBody = attributeMeta; // verify the required parameter 'attributeMeta' is set

      if (attributeMeta === undefined || attributeMeta === null) {
        throw new Error("Missing the required parameter 'attributeMeta' when calling setAttributeMetaDiscoverySetAttributeMetaPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/discovery/setAttributeMeta', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the uploadProcessFileEavsUploadPut operation.
     * @callback module:api/DefaultApi~uploadProcessFileEavsUploadPutCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Upload Process File
     * @param {File} uploadFile 
     * @param {Object} opts Optional parameters
     * @param {String} opts.name 
     * @param {Array.<String>} opts.emptyDelim 
     * @param {module:api/DefaultApi~uploadProcessFileEavsUploadPutCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */

  }, {
    key: "uploadProcessFileEavsUploadPut",
    value: function uploadProcessFileEavsUploadPut(uploadFile, opts, callback) {
      opts = opts || {};
      var postBody = null; // verify the required parameter 'uploadFile' is set

      if (uploadFile === undefined || uploadFile === null) {
        throw new Error("Missing the required parameter 'uploadFile' when calling uploadProcessFileEavsUploadPut");
      }

      var pathParams = {};
      var queryParams = {
        'name': opts['name']
      };
      var headerParams = {};
      var formParams = {
        'upload_file': uploadFile,
        'empty_delim': this.apiClient.buildCollectionParam(opts['emptyDelim'], 'csv')
      };
      var authNames = [];
      var contentTypes = ['multipart/form-data'];
      var accepts = ['application/json'];
      var returnType = Object;
      return this.apiClient.callApi('/eavs/upload', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);

  return DefaultApi;
}();

exports.default = DefaultApi;