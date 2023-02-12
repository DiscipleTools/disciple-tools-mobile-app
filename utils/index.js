import hash from "object-hash";

import { TypeConstants } from "constants";

export const complementListByObjProps = ({
  aList = [],
  aProp,
  aTransform,
  bList = [],
  bProp,
  bTransform,
} = {}) => {
  if (!aProp || !bProp) return;
  for (var ii = 0; ii < aList.length; ii++) {
    const aa = aList[ii];
    let aVal = aa?.[aProp];
    if (aTransform) aVal = aTransform(aVal);
    for (var jj = 0; jj < bList.length; jj++) {
      const bb = bList[jj];
      let bVal = bb?.[bProp];
      if (bTransform) bVal = bTransform(bVal);
      if (aVal === bVal) {
        aList.splice(ii, 1);
        //bList.splice(jj,1);
      }
    }
  }
};

// NOTE: include/exclude are mutually exclusive
export const searchObj = (
  pobj = {},
  searchStr,
  { caseInsensitive, include, exclude } = {}
) => {
  if (caseInsensitive)
    searchStr = searchStr
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const result = [];
  const recursiveSearch = (obj = {}) => {
    if (!obj || typeof obj !== "object") return;
    Object.keys(obj).forEach((key) => {
      let value = String(obj[key]);
      if (caseInsensitive)
        value = value
          ?.toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      // if key/prop is in include list, then check if value contains searchStr
      if (include?.length > 0) {
        include.forEach((prop) => {
          if (key === prop && value?.includes(searchStr)) {
            result.push(pobj);
            recursiveSearch(obj[key]);
          }
        });
        // if key/prop is *NOT* in exclude list, then check if value contains searchStr
      } else if (exclude?.length > 0) {
        exclude.forEach((prop) => {
          // if key/prop *NOT* in exclude list, then check if contains value
          if (key !== prop) {
            if (value?.includes(searchStr)) {
              result.push(pobj);
            }
            recursiveSearch(obj[key]);
          }
        });
        // otherwise, then check every key/pro if value contains searchStr
      } else {
        if (value?.includes(searchStr) && value?.includes(searchStr)) {
          result.push(pobj);
          recursiveSearch(obj[key]);
        }
      }
    });
  };
  recursiveSearch(pobj);
  return result;
};

export const dedupeObjList = (objList) => {
  const set = new Set(objList.map((item) => JSON.stringify(item)));
  return [...set].map((item) => JSON.parse(item));
};

export const searchObjList = (objList, searchStr, options) => {
  return objList
    .map((obj) => {
      const res = searchObj(obj, searchStr, options);
      return dedupeObjList(res);
    })
    ?.flat();
};

export const searchCommFields = (
  objList,
  searchStr,
  { caseInsensitive } = {}
) => {
  if (caseInsensitive) {
    searchStr = searchStr
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  const resList = [];
  objList.forEach((obj) => {
    Object.keys(obj)?.forEach((key) => {
      // TODO: constant?
      if (key?.startsWith("contact_")) {
        obj?.[key]?.forEach((value) => {
          if (value?.value) {
            let _value = value?.value;
            if (caseInsensitive) {
              _value = _value
                ?.toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            }
            if (_value?.includes(searchStr)) {
              resList.push(obj);
            }
          }
        });
      }
    });
  });
  return resList;
};

export const findFilterById = (id, filters) => {
  for (let ii = 0; ii < filters?.length; ii++) {
    const option = filters[ii];
    for (let jj = 0; jj < option?.content?.length; jj++) {
      const item = option?.content[jj];
      if (item?.ID === id) return item;
    }
  }
  return null;
};

/*
 * NOTE: FilterOption = Filter Parent (eg, "Default Filters"
 * is the Filter Option/Parent of "Favorite Contacts")
 */
export const findFilterOptionById = (id, filters) => {
  for (let ii = 0; ii < filters.length; ii++) {
    const filterOption = filters[ii];
    for (let jj = 0; jj < filterOption?.content?.length; jj++) {
      const content = filterOption?.content[jj];
      if (content?.ID === id) return filterOption;
    }
  }
  return null;
};

export const truncate = (str, { maxLength } = {}) => {
  if (!maxLength) maxLength = 32; // default
  if (str?.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

// capitalize first letter, lowercase remaining (eg, CONTACTS -> Contacts)
export const labelize = (str) => {
  if (str?.length > 0) {
    return str[0]?.toUpperCase() + str.slice(1)?.toLowerCase();
  }
  return str;
};

// TODO: constant for maxLength?
export const titleize = (title) => {
  return truncate(title);
};

export const getAvailablePostTypes = () => {
  return Object.values(TypeConstants);
};

export const parseDateShort = (dateValue) => {
  try {
    let parsedDateMS = null;
    if (typeof dateValue === "number") {
      parsedDateMS = dateValue * 1000;
    } else if (typeof dateValue === "string") {
      parsedDateMS = Date.parse(dateValue?.trim()?.split(" ")[0]);
      //const parsedDateMS = Date.parse(dateValue?.trim());
    } else return null;
    const today = new Date();
    const diffMS = today - parsedDateMS;
    const aDay = 24 * 60 * 60 * 1000;
    const isToday = diffMS < aDay;
    const diffDays = Math.floor(diffMS / aDay);
    if (isNaN(diffDays)) return null;
    //if (isToday) return i18n.t("global.today");
    return `${diffDays}d`;
  } catch (error) {
    return null;
  }
};

// TODO: handle more cases
export const parseDateSafe = (dateValue) => {
  try {
    if (typeof dateValue !== "number" && typeof dateValue !== "string")
      return "";
    if (typeof dateValue !== "string") dateValue = dateValue.toString();
    if (dateValue?.includes(" ")) return new Date(dateValue.replace(" ", "T"));
    if (dateValue?.length === 13) return new Date(Number(dateValue));
    if (dateValue?.length === 10) return new Date(Number(`${dateValue}000`));
    return "";
  } catch (ee) {
    return "";
  }
};

const addLeadingZeros = (n) => {
  if (n <= 9) {
    return "0" + n;
  }
  return n;
};

export const formatDateAPI = (date) => {
  return (
    date.getFullYear() +
    "-" +
    addLeadingZeros(date.getMonth() + 1) +
    "-" +
    addLeadingZeros(date.getDate()) +
    " " +
    addLeadingZeros(date.getHours()) +
    ":" +
    addLeadingZeros(date.getMinutes()) +
    ":" +
    addLeadingZeros(date.getSeconds())
  );
};

export const decodeHTMLEntities = (str) => {
  if (!str) return str;
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
};

export const getCacheKeyByRequest = (request) => {
  // order and hash the request for a consistent key
  return hash(request, {
    unorderedArrays: true,
    unorderedSets: true,
    unorderedObjects: true,
  });
};

export const delay = (ms) => new Promise((_) => setTimeout(_, ms));

export const isValidPhone = ({ value }) => {
  const regex = new RegExp(
    "^(\\+?\\d{1,2}[\\s.-]?)?(\\(?\\d{3}\\)?[\\s.-]?)?(\\d{3}[\\s.-]?\\d{4})$"
  );
  return regex.test(value);
};

export const isValidEmail = ({ value }) => {
  const regex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );
  return regex.test(value);
};

export const isValidURL = ({ value }) => {
  const regex = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return regex.test(value);
};
