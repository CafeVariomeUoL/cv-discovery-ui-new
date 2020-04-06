
export const getAttributes = (callback, callback_err) => fetch(
  process.env.REACT_APP_API_URL+"/discovery/getAttributes", {
  headers: {
    "Access-Control-Allow-Origin": "*",
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  })
  .then(res => res.json())
  .then(callback, callback_err);

export const getAttributeValues = (attribute, callback, callback_err) => fetch(
  process.env.REACT_APP_API_URL+"/discovery/getAttributeValues", {
    method:'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({'attribute': attribute})
  })
  .then(res => res.json())
  .then(callback, callback_err);