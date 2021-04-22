import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { LANG, TOKEN } from '../constants/constants';

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
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phonenumber) => {
  var phoneno = /^\(?([0-9]{4})\)?[ ]?([0-9]{4})$/;
  if (phonenumber.match(phoneno)) {
    return true;
  } else {
    return false;
  }
};

export const formatDate = (date, format) => {
  if (date) {
    return moment(date).format(format)
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
