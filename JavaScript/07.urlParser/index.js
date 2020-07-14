/**
 * File: index.js
 * Created Date: 2020-07-14  10:48:28 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-14 14:25:17 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

const parseUrl = function (url) {
  const reg = /^(?<protocal>\w*):\/\/((?<username>\w+):(?<password>\w+)@)?(?<domain>\w+(\.\w+)+)(:(?<port>\d{1,5}))?(?<path>(\/\w*)+)?(\?(?<query_string>(\&?\w+=\w+)+))(\#(?<hash>.+))?/;
  let res = {
    protocal: null,
    username: null,
    password: null,
    path: null,
    domain: null,
    port: null,
    query_string: {},
    hash: null,
  };
  try {
    res = url.match(reg).groups;
  } catch (e) {
    return res;
  }
  let query_string = res.query_string;
  let query_arr = [];
  res.query_string = {};
  res.path = res.path || "/";
  if (query_string) {
    query_arr = query_string.split("&");
    for (let i = 0; i < query_arr.length; i++) {
      const each = query_arr[i].split("=");
      res.query_string[each[0]] = each[1];
    }
  } else {
    res.query_string = {};
  }
  return { ...res };
};

console.log(
  parseUrl(
    "https://abc:cde@kc.zhixueyun.com:9007/?key1=value1&key2=v" +
      "alue2&key3=value3#/study/course/detail/10&fa30af45-242d-4195-b443-712c497e5068/6/1"
  )
);
