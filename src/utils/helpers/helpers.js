import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import numeral from 'numeral';
import {
  LANG,
  reasonType,
  TOKEN,
  STATUS_ALL,
  STATUS_PENDING,
  STATUS_RECEIVED,
  STATUS_DAMAGED,
} from '../constants/constants';

const has = Object.prototype.hasOwnProperty;

export const isDiff = (A, B) => JSON.stringify(A) !== JSON.stringify(B);

export const isEmpty = (prop) => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  );
};
export const encrypt = (plaintext) => {
  var textEncrypt = serialize(plaintext);
  var encryptionMethod = 'AES-256-CBC';
  var secret = 'gShwdRxo3izDp2Oaadv5bdLr85bZdYY5'; //must be 32 char length
  var iv = crypto.randomBytes(16).toString('hex').substr(0, 16);

  var value = openssl_encrypt(textEncrypt, encryptionMethod, secret, iv);
  iv = window.btoa(iv);
  var beforehashMac = CryptoJS.HmacSHA256(iv + value, secret);
  var mac = beforehashMac.toString(CryptoJS.enc.Hex);
  var json = {
    iv,
    value,
    mac,
  };

  var base64 = window.btoa(JSON.stringify(json));
  return base64;
};
const serialize = (text) => {
  return `s:${text.length}:"${text}";`;
};

const openssl_encrypt = (plain_text, encryptionMethod, secret, iv) => {
  var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
  return (
    encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64')
  );
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phonenumber) => {
  var phoneno = /^\(?([0-9]{4})\)?[ ]?([0-9]{4})$/;
  return phonenumber.match(phoneno);
};

export const formatDate = (date, format) => {
  if (date) {
    return moment(date).format(format);
  }
};

export const isLoggedIn = () => {
  return localStorage.getItem(TOKEN) || false;
};
export const getLangCode = (lang) => {
  // 1 – English (default); 2 – Traditional Chinese; 3 – Simplified Chinese
  // zh_TW	traditional Chinese
  // zh_CN	Simplified Chinese
  const language = lang || localStorage.getItem(LANG) || 'en';
  return language === 'zh_CN' ? 3 : language === 'zh_TW' ? 2 : 1;
};

export const isFunction = (value) => {
  return value && {}.toString.call(value) === '[object Function]';
};

export const getMonth = (m) => {
  if (isEmpty(m)) return '';
  m = String(m);
  const months = [
    { value: '01', name: 'IDS_JANUARY' },
    { value: '02', name: 'IDS_FEBRUARY' },
    { value: '03', name: 'IDS_MARCH' },
    { value: '04', name: 'IDS_APRIL' },
    { value: '05', name: 'IDS_MAY' },
    { value: '06', name: 'IDS_JUNE' },
    { value: '07', name: 'IDS_JULY' },
    { value: '08', name: 'IDS_AUGUST' },
    { value: '09', name: 'IDS_SEPTEMBER' },
    { value: '10', name: 'IDS_OCTOBER' },
    { value: '11', name: 'IDS_NOVEMBER' },
    { value: '12', name: 'IDS_DECEMBER' },
  ];
  return months.find((v) => v.value === m).name;
};

export const getReasonType = (reasonTypeId) => {
  switch (reasonTypeId) {
    case 1:
      return reasonType.PACKAGE_DAMAGED;
    case 2:
      return reasonType.WRONG_PRODUCT;
    case 3:
      return reasonType.SPOILED;
    case 4:
      return reasonType.OTHER;
    default:
      return null;
  }
};

export const isImageData = (src) => {
  return src.startsWith('data:image');
};

export const toBase64Image = async (url) => {
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(request.response);
    };
    request.open('GET', url);
    request.responseType = 'blob';
    request.send();
  });
};

export const getOrderStatus = (orderStatusId) => {
  switch (orderStatusId) {
    case 0:
      return STATUS_ALL;
    case 1:
      return STATUS_PENDING;
    case 2:
      return STATUS_RECEIVED;
    case 3:
      return STATUS_DAMAGED;
    default:
      return null;
  }
};

export const removeInvalidValues = (items) => {
  return items.filter((item) => item);
};

export const getYearRange = (startYear, endYear) => {
  let diffValue = Math.abs(startYear - endYear);
  if (diffValue === 0) {
    return [startYear];
  }
  let stepValues = [...Array(diffValue + 1).keys()];
  if (startYear < endYear) {
    return stepValues.map((value) => {
      return value + startYear;
    });
  } else {
    return stepValues.map((value) => {
      return startYear - value;
    });
  }
};

export const isDateValid = (date) => {
  return date instanceof Date && !isNaN(date.valueOf());
};

export const stringInsert = (target, position, insertValue) => {
  return target.substr(0, position) + insertValue + target.substr(position);
};
export const showDate = (dateStr) => {
  let date = moment(dateStr);
  if (moment().diff(date, 'days') === 1) {
    return date.fromNow();
  } else if (
    moment().diff(date, 'days') > 1 ||
    moment().diff(date, 'days') <= -1
  ) {
    return `${date.format('DD')} ${date.format('MMM')} ${
      moment().format('YYYY') !== date.format('YYYY') ? date.format('YYYY') : ''
    }`;
  }
  return `${date.calendar().split(' ')[0]} ${date.format('HH:mm')}`;
};

export const removeDuplicateName = (arr) => {
  return [...new Map(arr.map((it) => [it.name, it])).values()];
};
export const removeDuplicateCategories = (arr) => {
  const temp = [...new Map(arr.map((it) => [it.name, it])).values()];
  let result = [];
  temp.forEach((it) => {
    let tempItems = [];
    arr.forEach((v) => {
      if (v.name === it.name) {
        tempItems = [...tempItems, ...v.items];
      }
    });
    result.push({ ...it, items: removeDuplicateName(tempItems) });
  });
  return result;
};

export const formatNumber = (value, format) => {
  if (typeof value === 'string') {
    return value;
  }
  return numeral(value).format(format);
};
