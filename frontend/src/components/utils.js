// export const mkLabel = (o) => {
//   switch(typeof o){
//     case "object": 
//       if(Array.isArray(o)){
//         return "/" + mkLabel(o[0])
//       } else {
//         return Object.keys(o)[0] + "/" + mkLabel(o[Object.keys(o)[0]])
//       }
//     default:
//       return ""
//   }
// }

export const mkLabel = (o) => {
  switch(typeof o){
    case "object": 
      if(Array.isArray(o)){
        return "=>" + mkLabel(o[0]);
      } else {
        const res = mkLabel(o[Object.keys(o)[0]]);
        if(res === "") {
          return Object.keys(o)[0];
        } else if (Array.isArray(o[Object.keys(o)[0]])) {
          return Object.keys(o)[0] + res;
        } else {
          return Object.keys(o)[0] + "->" + res;
        }
      }
    default:
      return ""
  }
}


// generates an exists query every time it encounters an array
export const mkAttrQuery = (attr, attr_acc, op, val) => {
  switch(typeof attr){
    case "object": 
      if(Array.isArray(attr)){
        return {
          operator:"exists",
          from:attr_acc("array"),
          children: [mkAttrQuery(attr[0], (x) => x, op, val)]
        }
      } else {
        const k = Object.keys(attr)[0];
        return mkAttrQuery(attr[Object.keys(attr)[0]], (v) => attr_acc({[k] : v}), op, val)
      }
    default:
      return {
        attribute: attr_acc(attr),
        operator:op,
        value: val
      }
  }
}



export const mergeExists = (o) => {
  console.log("got:", o)
  switch(o.operator){
    case "exists": 
      if('children' in o) o.children = o.children.map(mergeExists)
      return o
    case "and":
      if('children' in o) o.children = mergeExistsAux("and", o.children.map(mergeExists))
      return o
    case "or":
      if('children' in o) o.children = mergeExistsAux("or", o.children.map(mergeExists))
      return o
    default:
      return o
  }
}


export const mergeExistsAux = (op, lst) => {

  const merged_exists = {
    operator: "exists",
    children: [{operator:op, children: []}]
  }

  const new_lst = []

  // select an exists stmt from the lst
  for (var i = 0; i < lst.length; i++) {
    if(lst[i].operator === "exists"){
      if(!('from' in merged_exists)){
        merged_exists.from = lst[i].from
      }
    }
  }

  if(!('from' in merged_exists)) return lst;

  // // console.log('got here')

  for (var i = 0; i < lst.length; i++) {
    if( lst[i].operator === "exists" && 
        JSON.stringify(merged_exists.from) === JSON.stringify(lst[i].from)
      ){
      merged_exists.children[0].children.push(...lst[i].children)
    } else {
      new_lst.push(lst[i])
    }
  }

  const rest = mergeExistsAux(op, new_lst)

  if(merged_exists.children[0].children.length == 1) 
    merged_exists.children = merged_exists.children[0].children
  rest.push(merged_exists)

  return rest
}

export const getType = (o) => {
  switch(typeof o){
    case "object": 
      if(Array.isArray(o)){
        return getType(o[0])
      } else {
        return getType(o[Object.keys(o)[0]])
      }
    default:
      return o
  }
}


export const cast = (o,t) => {
  switch(t){
    case "int": return parseInt(o)
    default: return o
  }
}