/**
 * File: codes.ts
 * Created Date: 2020-06-28  15:08:56 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-29 16:29:39 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

// 空白字符常量
const EOF /*                             */ = "EOF";
/** Ascii Code: NULL */
const NULL_CODE /*                       */ = 0x0000; // Null
const CHARACTER_TABULATION_CODE /*       */ = 0x0009; // tab制表符
const CHARACTER_TABULATION /*            */ = "	"; // tab制表符
const LINE_FEED_CODE /*                  */ = 0x000a; // 历史里的糟粕Ascii码
const FORM_FEED_CODE /*                  */ = 0x000c; // 同上
const SPACE_CODE /*                      */ = 0x0020; // 普通空格
const SPACE /*                           */ = " "; // 普通空格
const QUOTATION_MARK_CODE /*             */ = 0x0022; // 双引号 "
const QUOTATION_MARK /*                  */ = '"'; // 双引号 "
/** Ascii Code:  ->   & */
const AMPERSAND_CODE /*                  */ = 0x0026; // & 符号
const AMPERSAND /*                       */ = "&"; // & 符号
const NUMBER_SIGN_CODE /*                */ = 0x0023;
const NUMBER_SIGN /*                     */ = "#";
/** Ascii Code:  ->   ' */
const APOSTROPHE_CODE /*                 */ = 0x0027; // 单引号
const APOSTROPHE /*                      */ = "'"; // 单引号
const SOLIDUS_CODE /*                    */ = 0x002f; // 反斜杠
const SOLIDUS /*                         */ = "/"; // 反斜杠

/** Ascii Code: => - */
const HYPHEN_MINUS_CODE /*               */ = 0x002d;
const HYPHEN_MINUS /*                    */ = "-";
const LESS_THAN_CODE /*                  */ = 0x003c; // 小于号
const LESS_THAN_SIGN /*                  */ = "<";
const GREATER_THAN_SIGN_CODE /*          */ = 0x003e; // 大于号 >
const GREATER_THAN_SIGN /*               */ = ">";
const EQUALS_SIGN_CODE /*                */ = 0x003d; // 等于号 =
const EQUALS_SIGN /*                     */ = "=";
const EXCLAMATION_MARK_CODE /*           */ = 0x0021;
const EXCLAMATION_MARK /*                */ = "!";
const RIGHT_SQUARE_BRACKET_CODE /*       */ = 0x005d;
const RIGHT_SQUARE_BRACKET /*            */ = "]";

const A_UPPER_CASE_CODE /*               */ = 0x0041; // a 的Ascii码
const Z_UPPER_CASE_CODE /*               */ = 0x005a; // z 的Ascii码
/** Ascii Code => ` */
const GRAVE_ACCENT_CODE /*               */ = 0x0060;
const GRAVE_ACCENT /*                    */ = "`";
const A_LOWER_CASE_CODE /*               */ = 0x0061; // a 的Ascii码
const Z_LOWER_CASE_CODE /*               */ = 0x007a; // z 的Ascii码

export {
  // Code Consts
  EOF,
  NULL_CODE,
  CHARACTER_TABULATION_CODE,
  CHARACTER_TABULATION,
  LINE_FEED_CODE,
  FORM_FEED_CODE,
  SPACE_CODE,
  SPACE,
  QUOTATION_MARK_CODE,
  QUOTATION_MARK,
  AMPERSAND_CODE,
  AMPERSAND,
  APOSTROPHE_CODE,
  APOSTROPHE,
  NUMBER_SIGN_CODE,
  NUMBER_SIGN,
  SOLIDUS_CODE,
  SOLIDUS,
  HYPHEN_MINUS_CODE,
  HYPHEN_MINUS,
  LESS_THAN_CODE,
  LESS_THAN_SIGN,
  GREATER_THAN_SIGN_CODE,
  GREATER_THAN_SIGN,
  EQUALS_SIGN_CODE,
  EQUALS_SIGN,
  EXCLAMATION_MARK_CODE,
  EXCLAMATION_MARK,
  RIGHT_SQUARE_BRACKET_CODE,
  RIGHT_SQUARE_BRACKET,
  A_UPPER_CASE_CODE,
  Z_UPPER_CASE_CODE,
  GRAVE_ACCENT_CODE,
  GRAVE_ACCENT,
  A_LOWER_CASE_CODE,
  Z_LOWER_CASE_CODE,
};
