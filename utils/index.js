import { TypeConstants } from "constants";

export const complementListByObjProps = ({aList=[], aProp, aTransform, bList=[], bProp, bTransform } = {}) => {
  if (!aProp || !bProp) return;
  for (var ii=0; ii < aList.length; ii++) {
    const aa = aList[ii];
    let aVal = aa?.[aProp];
    if (aTransform) aVal = aTransform(aVal);
    for (var jj=0; jj < bList.length; jj++) {
      const bb = bList[jj];
      let bVal = bb?.[bProp];
      if (bTransform) bVal = bTransform(bVal);
      if (aVal === bVal) {
        aList.splice(ii,1);
        //bList.splice(jj,1);
      };
    };
  };
};

// NOTE: include/exclude are mutually exclusive
export const searchObj = (pobj = {}, searchStr, { caseInsensitive, include, exclude } = {}) => {
  if (caseInsensitive) searchStr = searchStr?.toLowerCase();
  const result = [];
  const recursiveSearch = (obj = {}) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
      let value = String(obj[key]);
      if (caseInsensitive) value = value?.toLowerCase();
      // if key/prop is in include list, then check if value contains searchStr
      if (include?.length > 0) {
        include.forEach(prop => {
          if (key === prop && value?.includes(searchStr)) {
            result.push(pobj);
            recursiveSearch(obj[key]);
          };
        });
      // if key/prop is *NOT* in exclude list, then check if value contains searchStr
      } else if (exclude?.length > 0) {
        exclude.forEach(prop => {
          // if key/prop *NOT* in exclude list, then check if contains value
          if (key !== prop) {
            if (value?.includes(searchStr)) {
              result.push(pobj);
            };
            recursiveSearch(obj[key]);
          }
        });
      // otherwise, then check every key/pro if value contains searchStr
      } else {
        if (value?.includes(searchStr) && value?.includes(searchStr)) {
          result.push(pobj);
          recursiveSearch(obj[key]);
        };
      };
    });
  };
  recursiveSearch(pobj);
  return result;
};

export const dedupeObjList = (objList) => {
  const set = new Set(objList.map(item => JSON.stringify(item)));
  return [...set].map(item => JSON.parse(item));
};

export const searchObjList = (objList, searchStr, options) => {
  return objList.map(obj => {
    const res = searchObj(obj, searchStr, options);
    return dedupeObjList(res);
  })?.flat();
};

export const findFilterById = (id, filters) => {
  for (let ii=0; ii < filters?.length; ii++) {
    const option = filters[ii];
    for (let jj=0; jj < option?.content?.length; jj++) {
      const item = option?.content[jj];
      if (item?.ID === id) return item;
    };
  };
  return null;
};

/*
  * NOTE: FilterOption = Filter Parent (eg, "Default Filters"
  * is the Filter Option/Parent of "Favorite Contacts")
  */
export const findFilterOptionById = (id, filters) => {
  for (let ii=0; ii < filters.length; ii++) {
    const filterOption = filters[ii];
    for (let jj=0; jj < filterOption?.content?.length; jj++) {
      const content = filterOption?.content[jj];
      if (content?.ID === id) return filterOption;
    };
  };
  return null;
};

export const truncate = (str, { maxLength } = {}) => {
  if (maxLength && str?.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
};

// capitalize first letter, lowercase remaining (eg, CONTACTS -> Contacts)
export const labelize = (str) => {
  if (str?.length > 0) {
    return str[0]?.toUpperCase() + str.slice(1)?.toLowerCase();
  };
  return str;
};

export const getAvailablePostTypes = () => {
  return Object.values(TypeConstants);
};