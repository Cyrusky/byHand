/**
 * File: actions.ts
 * Created Date: 2020-06-28  15:08:36 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-14 22:22:38 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

/* ---------------- EMIT ACTION ----------------------- */
const EMIT_CURRENT_CHARACTER_TOKEN = Symbol("Emit Current Character Token");
const EMIT_CURRENT_TAG_TOKEN = Symbol("Emit Current Tag Token");
const EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN = Symbol(
  "Emit Temporary Buffer As Character Token"
);
const EMIT_REPLACEMENT_CHARACTER_TOKEN = Symbol(
  "Emit Replacement Character Token"
);
const EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN = Symbol(
  "Create Less Than Sign Character Token"
);
const EMIT_EXCLAMATION_MARK_CHARACTER_TOKEN = Symbol(
  "Emit Eclamation Mark Character Token"
);
const EMIT_HYPHEN_MINUS_CHARACTER_TOKEN = Symbol(
  "Emit Hyphen Minus character Token"
);
const EMIT_RIGHT_SQUARE_BRACKET_CHARACTER_TOKEN = Symbol(
  "Emit Right Square Bracket Character Token"
);
const EMIT_SOLIDUS_CHARACTER_TOKEN = Symbol("Emit Solidus Character Token");
const EMIT_END_OF_FILE_TOKEN = Symbol("Emit End Of File Token");
const EMIT_GREATER_THAN_SIGN_CHARACTER_TOKEN = Symbol(
  "Emit Greater Than Sign Character Token"
);
const EMIT_COMMENT_TOKEN = Symbol("Emit Comment Token");
const EMIT_DOCTYPE_TOKEN = Symbol("Emit Doctype Token");

/* ---------------- CREATE ACTION --------------------- */
const CREATE_NEW_START_TAG_TOKEN = Symbol("Create new Start Tag Token");
const CREATE_NEW_END_TAG_TOKEN = Symbol("Create New End Tag Token");
const CREATE_COMMENT_TOKEN = Symbol("Create Comment Token");
const CREATE_NEW_ATTRIBUTE_IN_CURRENT_TAG_TOKEN = Symbol(
  "Create new Attribute In Current Tag Token"
);
const CREATE_DOCTYPE_TOKEN = Symbol("Create Doctype Token");

/* --------------- MUTATION ACTION -------------------- */
const SET_TAG_NAME_TO_EMPTY_STRING = Symbol("Set Tag name To Empty String");
const SET_COMMENT_TOKEN_WITH_EMPTY_DATA = Symbol(
  "Set Commetn Token With Empty Data"
);
const SET_ATTRIBUTES_NAME_TO_CURRENT_CHARACTER = Symbol(
  "Set Attributes Name To Current Character"
);
const SET_ATTRIBUTES_NAME_TO_EMPTY_STRING = Symbol(
  "Set Attributes Name To Empty Character"
);
const SET_ATTRIBUTE_VALUE_TO_EMPTY_STRING = Symbol(
  "Set Attribute Value To Empty String"
);
const SET_SELF_CLOSING_FLAG_OF_THIS_TAG = Symbol(
  "Set Self Closing Flag Of This Tag"
);
const SET_FORCE_QUIRKS_FLAG_TO_ON = Symbol("Set Force Quirks Flag To On");
const SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING = Symbol(
  "Set Doctype Public Identifier To Empty String"
);
const SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING = Symbol(
  "Set Doctype System Identifier To Empty String"
);

/* --------------- APPEND ACTION -------------------- */
const APPEND_LOWERCASE_VERSION_TO_TAG_NAME = Symbol(
  "Append Lowercase Version to tag name"
);
const APPEND_LOWERCASE_VERSION_TO_ATTRIBUTE_NAME = Symbol(
  "Append lowercase Version to Attribute Name"
);
const APPEND_LOWERCASE_VERSION_TO_DOCTYPE_TOKEN = Symbol(
  "Append Lowercase Version To Doctype Token"
);
const APPEND_TO_DOCTYPE_TOKEN = Symbol("Append To Doctype Token");
const APPEND_TO_ATTRIBUTE_NAME = Symbol("Append to Attribute Name");
const APPEND_TO_ATTRIBUTE_VALUE = Symbol("Append to Attribute Value");
const APPEND_TO_COMMENT_DATA = Symbol("Append To Comment Data");
const APPEND_LOWERCASE_VERSION_TO_TEMPORARY_BUFFER = Symbol(
  "Append lowercase Version to Temporary Buffer"
);
const APPEND_TO_TAG_NAME = Symbol("Append To Tag Name");
const APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_TAG_NAME = Symbol(
  "Append Replacement Character To Current Tag Name"
);
const APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_ATTRIBUTE_VALUE = Symbol(
  "Append Replacement Character To Current Attribute Value"
);
const APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_TOKEN_NAME = Symbol(
  "Append Replacement Character To Current Doctype Token Name"
);
const APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_COMMENT_TOKEN = Symbol(
  "Append Replacement Character To Current Comment Token"
);
const APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER = Symbol(
  "Append Replacement Character To Current Doctype Public Identifier"
);
const APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER = Symbol(
  "Append Replacement Character To Current Doctype System Identifier"
);
const APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA = Symbol(
  "Append Hyphen Minus Character To The Comment Data"
);
const APPEND_HYPHEN_EXCLAMATION_CHARACTER_TO_THE_COMMENT_DATA = Symbol(
  "Append Hyphen Exclamation Character To The Comment Data"
);
const APPEND_AMPERSAND_TO_TEMPORARY_BUFFER = Symbol(
  "Append Ampersand To Temporary Buffer"
);
const APPEND_TO_TEMPORARY_BUFFER = Symbol("Append To Temporary Buffer");

const APPEND_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER = Symbol(
  "Append To Current Doctype Public Identifier"
);
const APPEND_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER = Symbol(
  "Append To Current Doctype System Identifier"
);
/* --------------- CLEAN ACTION -------------------- */
const CLEAN_TEMPORARY_BUFFER = Symbol("Clean Temporary Buffer");

const RETURN_TO_RETURN_STATE = Symbol("Return To Return State");

/* ------------------ Consume Next Few ----------------------------*/
const CONSUME_NEXT_FEW = {
  MarkupDeclarationOpenState: ["--", "doctype", "[cdata["],
};

export {
  // EMIT Actions
  EMIT_CURRENT_CHARACTER_TOKEN,
  EMIT_CURRENT_TAG_TOKEN,
  EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN,
  EMIT_REPLACEMENT_CHARACTER_TOKEN,
  EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
  EMIT_GREATER_THAN_SIGN_CHARACTER_TOKEN,
  EMIT_EXCLAMATION_MARK_CHARACTER_TOKEN,
  EMIT_HYPHEN_MINUS_CHARACTER_TOKEN,
  EMIT_RIGHT_SQUARE_BRACKET_CHARACTER_TOKEN,
  EMIT_SOLIDUS_CHARACTER_TOKEN,
  EMIT_END_OF_FILE_TOKEN,
  EMIT_COMMENT_TOKEN,
  EMIT_DOCTYPE_TOKEN,
  // Create Actions
  CREATE_NEW_START_TAG_TOKEN,
  CREATE_NEW_END_TAG_TOKEN,
  CREATE_COMMENT_TOKEN,
  CREATE_NEW_ATTRIBUTE_IN_CURRENT_TAG_TOKEN,
  CREATE_DOCTYPE_TOKEN,
  // Mutations Actions
  SET_TAG_NAME_TO_EMPTY_STRING,
  SET_COMMENT_TOKEN_WITH_EMPTY_DATA,
  SET_ATTRIBUTES_NAME_TO_CURRENT_CHARACTER,
  SET_ATTRIBUTES_NAME_TO_EMPTY_STRING,
  SET_ATTRIBUTE_VALUE_TO_EMPTY_STRING,
  SET_SELF_CLOSING_FLAG_OF_THIS_TAG,
  SET_FORCE_QUIRKS_FLAG_TO_ON,
  SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING,
  SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING,
  // Append Actions
  APPEND_LOWERCASE_VERSION_TO_TAG_NAME,
  APPEND_LOWERCASE_VERSION_TO_TEMPORARY_BUFFER,
  APPEND_LOWERCASE_VERSION_TO_ATTRIBUTE_NAME,
  APPEND_LOWERCASE_VERSION_TO_DOCTYPE_TOKEN,
  APPEND_TO_ATTRIBUTE_NAME,
  APPEND_TO_ATTRIBUTE_VALUE,
  APPEND_TO_COMMENT_DATA,
  APPEND_TO_DOCTYPE_TOKEN,
  APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_TAG_NAME,
  APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_ATTRIBUTE_VALUE,
  APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_TOKEN_NAME,
  APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_COMMENT_TOKEN,
  APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER,
  APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER,
  APPEND_TO_TAG_NAME,
  APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA,
  APPEND_HYPHEN_EXCLAMATION_CHARACTER_TO_THE_COMMENT_DATA,
  APPEND_AMPERSAND_TO_TEMPORARY_BUFFER,
  APPEND_TO_TEMPORARY_BUFFER,
  APPEND_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER,
  APPEND_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER,
  // Clean Actions
  CLEAN_TEMPORARY_BUFFER,
  // Consume Next Few
  CONSUME_NEXT_FEW,
  // REDIRECT ACTION
  RETURN_TO_RETURN_STATE,
};
