/**
 * File: consts.ts
 * Created Date: 2020-06-24  21:48:02 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-28 21:44:09 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

// 所有逇Actions名称常量
const CLEAR_BUFFER = Symbol("ClearBuffer");
const CLEAR_BUFFER_AND_EMIT_LESS_THAN_SIGN = Symbol(
  "ClearBufferAndEmitLessThanSign"
);
const CLEAR_BUFFER_AND_EMIT_SOLIDUS = Symbol("ClearBufferAndEmitSolidus");
const EMIT = Symbol("Emit");
const EMIT_ATTRIBUTE_VALUE = Symbol("EmitAttributeValue");
const EMIT_LOWER_CASE = Symbol("EmitUpperCase");
const EMIT_LESS_THAN_SIGN = Symbol("EmitLessThanSign");
const EMIT_GREATER_THAN_SIGN = Symbol("EmitGreaterThanSign");

const CREATE_NEW_END_TAG = Symbol("CreateNewEndTag");
const CREATE_NEW_ATTRIBUTE = Symbol("CreateNewAttribute");
const CREATE_EMPTY_ATTRIBUTE = Symbol("CreateEmptyAttribute");
const CREATE_COMMENT_TOKEN = Symbol("CreateCommentTOken");
const CREATE_CDATA_COMMENT_TOKEN = Symbol("CreateCdataCommentToken");
const CREATE_DOCTYPE = Symbol("Create Doctype");

const EMIT_LESS_THAN_SIGN_AND_SOLIDUS = Symbol("EmitLessThanSignAndSolidus");
const EMIT_LESS_THAN_SIGN_AND_EXCLAMATION_MARK = Symbol(
  "EmitLessThanSignAndExclamationMark"
);
const EMIT_HYPHEN_MINUS = Symbol("EmitHyphenMinus");
const EMIT_COMMENT_TOKEN = Symbol("EmitCommentToken");
const EMIT_DOCTYPE_TOKEN = Symbol("EmitDoctypeToken");
const APPEND_REPLACEMENT_CHARACTER = Symbol("AppendReplacementCharacter");
const APPEND_TO_TAG_NAME = Symbol("AppendToTagName");
const APPEND_TO_ATTRIBUTE_VALUE = Symbol("AppendCurrentInputToAttributeValue");
const APPEND_TO_ATTRIBUTE_NAME = Symbol("AppendToAttributeName");
const APPEND_TO_COMMENT = Symbol("Append To Comment");
const APPEND_MINUS_TO_COMMENT_TOKEN = Symbol("AppendMinusToCommentToken");
const APPEND_MINUS_AND_EXCLAMATION_MARK_TO_COMMENT_TOKEN = Symbol(
  "AppendMinusAndExclamationMarkToCommentToken"
);
const APPEND_TO_DOCTYPE = Symbol("AppendToDocType");
const SET_SELF_CLOSING_FLAG_TO_CURRENT_TAG_TOKEN = Symbol(
  "SetSelfClosingFlagToCurrentTagToken"
);
const SWITCH_TO_BACK_STATE = Symbol("SwitchToBackState");

// TokenType 常量
const APPROPRIATE_END_TAG_TOKEN /*       */ = Symbol("AppropriateEndTagToken");

export {
  // Actions
  CLEAR_BUFFER,
  CLEAR_BUFFER_AND_EMIT_LESS_THAN_SIGN,
  CLEAR_BUFFER_AND_EMIT_SOLIDUS,
  EMIT,
  EMIT_ATTRIBUTE_VALUE,
  EMIT_LOWER_CASE,
  EMIT_LESS_THAN_SIGN,
  EMIT_GREATER_THAN_SIGN,
  CREATE_NEW_END_TAG,
  CREATE_NEW_ATTRIBUTE,
  CREATE_EMPTY_ATTRIBUTE,
  CREATE_COMMENT_TOKEN,
  CREATE_CDATA_COMMENT_TOKEN,
  CREATE_DOCTYPE,
  EMIT_COMMENT_TOKEN,
  EMIT_LESS_THAN_SIGN_AND_SOLIDUS,
  EMIT_LESS_THAN_SIGN_AND_EXCLAMATION_MARK,
  EMIT_HYPHEN_MINUS,
  EMIT_DOCTYPE_TOKEN,
  APPEND_REPLACEMENT_CHARACTER,
  APPEND_TO_TAG_NAME,
  APPEND_TO_ATTRIBUTE_VALUE,
  APPEND_TO_ATTRIBUTE_NAME,
  APPEND_TO_COMMENT,
  APPEND_MINUS_TO_COMMENT_TOKEN,
  APPEND_MINUS_AND_EXCLAMATION_MARK_TO_COMMENT_TOKEN,
  APPEND_TO_DOCTYPE,
  SET_SELF_CLOSING_FLAG_TO_CURRENT_TAG_TOKEN,
  SWITCH_TO_BACK_STATE,
  // TokenType
  APPROPRIATE_END_TAG_TOKEN,
};
