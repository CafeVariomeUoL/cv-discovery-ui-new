# FastApi.DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**clearDbEavsClearDBPut**](DefaultApi.md#clearDbEavsClearDBPut) | **PUT** /eavs/clearDB | Clear Db
[**getAttributes2DiscoveryGetAttributes2Get**](DefaultApi.md#getAttributes2DiscoveryGetAttributes2Get) | **GET** /discovery/getAttributes2 | Get Attributes2
[**getAttributesDiscoveryGetAttributesGet**](DefaultApi.md#getAttributesDiscoveryGetAttributesGet) | **GET** /discovery/getAttributes | Get Attributes
[**getAttributesValsDiscoveryGetAttributeValuesPost**](DefaultApi.md#getAttributesValsDiscoveryGetAttributeValuesPost) | **POST** /discovery/getAttributeValues | Get Attributes Vals
[**getSettingsDiscoveryGetSettingsGet**](DefaultApi.md#getSettingsDiscoveryGetSettingsGet) | **GET** /discovery/getSettings | Get Settings
[**processFileEavsProcessPut**](DefaultApi.md#processFileEavsProcessPut) | **PUT** /eavs/process | Process File
[**queryQueryPost**](DefaultApi.md#queryQueryPost) | **POST** /query | Query
[**saveDiscoverySettingsDiscoveryLoadSettingsGet**](DefaultApi.md#saveDiscoverySettingsDiscoveryLoadSettingsGet) | **GET** /discovery/loadSettings | Save Discovery Settings
[**saveDiscoverySettingsDiscoverySaveSettingsPost**](DefaultApi.md#saveDiscoverySettingsDiscoverySaveSettingsPost) | **POST** /discovery/saveSettings | Save Discovery Settings
[**setAttributeMetaDiscoverySetAttributeMetaPost**](DefaultApi.md#setAttributeMetaDiscoverySetAttributeMetaPost) | **POST** /discovery/setAttributeMeta | Set Attribute Meta
[**uploadProcessFileEavsUploadPut**](DefaultApi.md#uploadProcessFileEavsUploadPut) | **PUT** /eavs/upload | Upload Process File



## clearDbEavsClearDBPut

> Object clearDbEavsClearDBPut()

Clear Db

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
apiInstance.clearDbEavsClearDBPut((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAttributes2DiscoveryGetAttributes2Get

> Object getAttributes2DiscoveryGetAttributes2Get()

Get Attributes2

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
apiInstance.getAttributes2DiscoveryGetAttributes2Get((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAttributesDiscoveryGetAttributesGet

> Object getAttributesDiscoveryGetAttributesGet()

Get Attributes

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
apiInstance.getAttributesDiscoveryGetAttributesGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAttributesValsDiscoveryGetAttributeValuesPost

> Object getAttributesValsDiscoveryGetAttributeValuesPost(attributeValues)

Get Attributes Vals

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let attributeValues = new FastApi.AttributeValues(); // AttributeValues | 
apiInstance.getAttributesValsDiscoveryGetAttributeValuesPost(attributeValues, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **attributeValues** | [**AttributeValues**](AttributeValues.md)|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## getSettingsDiscoveryGetSettingsGet

> Object getSettingsDiscoveryGetSettingsGet()

Get Settings

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
apiInstance.getSettingsDiscoveryGetSettingsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## processFileEavsProcessPut

> Object processFileEavsProcessPut(fileName, opts)

Process File

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let fileName = "fileName_example"; // String | 
let opts = {
  'name': "name_example", // String | 
  'requestBody': ["null"] // [String] | 
};
apiInstance.processFileEavsProcessPut(fileName, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fileName** | **String**|  | 
 **name** | **String**|  | [optional] 
 **requestBody** | [**[String]**](String.md)|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## queryQueryPost

> Object queryQueryPost(query)

Query

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let query = new FastApi.Query(); // Query | 
apiInstance.queryQueryPost(query, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **query** | [**Query**](Query.md)|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## saveDiscoverySettingsDiscoveryLoadSettingsGet

> Object saveDiscoverySettingsDiscoveryLoadSettingsGet(id)

Save Discovery Settings

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let id = "id_example"; // String | 
apiInstance.saveDiscoverySettingsDiscoveryLoadSettingsGet(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## saveDiscoverySettingsDiscoverySaveSettingsPost

> Object saveDiscoverySettingsDiscoverySaveSettingsPost(discoverySettings)

Save Discovery Settings

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let discoverySettings = new FastApi.DiscoverySettings(); // DiscoverySettings | 
apiInstance.saveDiscoverySettingsDiscoverySaveSettingsPost(discoverySettings, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **discoverySettings** | [**DiscoverySettings**](DiscoverySettings.md)|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## setAttributeMetaDiscoverySetAttributeMetaPost

> Object setAttributeMetaDiscoverySetAttributeMetaPost(attributeMeta)

Set Attribute Meta

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let attributeMeta = new FastApi.AttributeMeta(); // AttributeMeta | 
apiInstance.setAttributeMetaDiscoverySetAttributeMetaPost(attributeMeta, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **attributeMeta** | [**AttributeMeta**](AttributeMeta.md)|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## uploadProcessFileEavsUploadPut

> Object uploadProcessFileEavsUploadPut(uploadFile, opts)

Upload Process File

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.DefaultApi();
let uploadFile = "/path/to/file"; // File | 
let opts = {
  'name': "name_example", // String | 
  'emptyDelim': "emptyDelim_example" // [String] | 
};
apiInstance.uploadProcessFileEavsUploadPut(uploadFile, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uploadFile** | **File**|  | 
 **name** | **String**|  | [optional] 
 **emptyDelim** | [**[String]**](String.md)|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

