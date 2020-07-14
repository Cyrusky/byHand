/**
 * File: index.js
 * Created Date: 2020-06-24  14:08:13 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-14 22:35:47 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
// import * as fs from "fs";
// import * as path from "path";
import { DataState } from "./states";
import * as A from "./consts/actions";
import * as C from "./consts/codes";
import * as fs from "fs";
import * as path from "path";

import {
  START_TAG_TOKEN,
  END_TAG_TOKEN,
  COMMENT_TOKEN,
  DOCTYPE_TOKEN,
  CHARACTER_TOKEN,
  END_OF_FILE_TOKEN,
} from "./consts/tokenType";

const DEBUG = true;
const REPLACEMENT_CHAR = "[null]";

interface Attribute {
  name: string;
  value?: string;
}

// let content = fs.readFileSync(path.join(__dirname, "test.html")).toString();
// console.log(DataState("a"));

interface Token {
  type: symbol;
  name?: string;
  value?: string;
  selfClose?: boolean;
  forceQuirks?: boolean;
  attributes?: Array<Attribute>;
  publicIdentifier?: string;
  systemIdentifier?: string;
}

const Tokenization = function* (content: string) {
  let state = DataState;

  let temporary_buffer = "";
  let attribute_name = "";
  let attribute_value = "";

  let token: null | Token = null;

  let consume: Array<string> = [];

  for (let i = 0; i < content.length; i++) {
    let char = content.charAt(i);
    if (consume.length > 0) {
      for (let j = 0; j < consume.length; j++) {
        const element = consume[j];
        if (
          content.substring(i, i + element.length).toLowerCase() === element
        ) {
          char = element;
          i += element.length - 1;
          break;
        }
      }
    }
    let {
      nextState,
      action,
      returnState,
      exception = null,
      consumeNextFew = [],
    } = state(char);
    consume = consumeNextFew;
    if (false) {
      console.log("=".repeat(50), "\n");
      console.log("Number ==> ", i + 1);
      console.log("Char ==> ", char, "\n");
      console.log("↓".repeat(50));
      console.log("token ==> ", token);
      console.log("nowState ==> ", state);
      console.log("nextState ==> ", nextState);
      console.log("action ==> ", action);
      console.log("returnState ==> ", returnState);
      console.log("exception ==> ", exception);
      console.log("consumeNextFew ==> ", consumeNextFew);
      console.log("temporary_buffer ==> ", temporary_buffer);
      console.log("attribute_name ==> ", attribute_name);
      console.log("attribute_value ==> ", attribute_value);
      console.log("↑".repeat(50), "\n\n");
    }

    let appendAttribute = () => {
      if (token?.attributes && attribute_name) {
        token.attributes.push({
          name: attribute_name,
          value: attribute_value,
        } as Attribute);
        attribute_value = "";
        attribute_name = "";
      }
    };

    action = action || [];
    for (let i = 0; i < action.length; i++) {
      const act = action[i];
      let code = char.charCodeAt(0);
      switch (act) {
        case A.EMIT_CURRENT_CHARACTER_TOKEN:
          if (
            code === C.CHARACTER_TABULATION_CODE ||
            code === C.LINE_FEED_CODE ||
            code === C.FORM_FEED_CODE ||
            code === C.SPACE_CODE ||
            code === 10
          ) {
            break;
          }
          token = {
            type: CHARACTER_TOKEN,
            value: char,
          };
          yield token;
          break;
        case A.EMIT_CURRENT_TAG_TOKEN:
          appendAttribute();
          yield token;
          token = null;
          break;
        case A.EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: temporary_buffer,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_REPLACEMENT_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: REPLACEMENT_CHAR,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: C.LESS_THAN_SIGN,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_GREATER_THAN_SIGN_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: C.GREATER_THAN_SIGN,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_EXCLAMATION_MARK_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: C.EXCLAMATION_MARK,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: C.HYPHEN_MINUS,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_RIGHT_SQUARE_BRACKET_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: C.RIGHT_SQUARE_BRACKET,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_SOLIDUS_CHARACTER_TOKEN:
          token = {
            type: CHARACTER_TOKEN,
            value: C.SOLIDUS,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_END_OF_FILE_TOKEN:
          appendAttribute();
          token = {
            type: END_OF_FILE_TOKEN,
          } as Token;
          yield token;
          token = null;
          break;
        case A.EMIT_COMMENT_TOKEN:
          yield token;
          token = null;
          break;
        case A.EMIT_DOCTYPE_TOKEN:
          yield token;
          token = null;
          break;
        // Create Actions
        case A.CREATE_NEW_START_TAG_TOKEN:
          token = {
            type: START_TAG_TOKEN,
            name: char,
            value: "",
            selfClose: false,
            forceQuirks: false,
            attributes: [],
            publicIdentifier: "",
            systemIdentifier: "",
          } as Token;
          break;
        case A.CREATE_NEW_END_TAG_TOKEN:
          token = {
            type: END_TAG_TOKEN,
            name: "",
            value: "",
            selfClose: false,
            forceQuirks: false,
            attributes: [],
            publicIdentifier: "",
            systemIdentifier: "",
          } as Token;
          break;
        case A.CREATE_COMMENT_TOKEN:
          token = {
            type: COMMENT_TOKEN,
            name: "",
            value: "",
            selfClose: false,
            forceQuirks: false,
            attributes: [],
            publicIdentifier: "",
            systemIdentifier: "",
          } as Token;
          break;
        case A.CREATE_NEW_ATTRIBUTE_IN_CURRENT_TAG_TOKEN:
          appendAttribute();
          attribute_name = "";
          attribute_value = "";
          break;
        case A.CREATE_DOCTYPE_TOKEN:
          token = {
            type: DOCTYPE_TOKEN,
            name: "",
            value: "",
            selfClose: false,
            forceQuirks: false,
            attributes: [],
            publicIdentifier: "",
            systemIdentifier: "",
          } as Token;
          break;
        // Mutations Actions
        case A.SET_TAG_NAME_TO_EMPTY_STRING:
          token.name = "";
          break;
        case A.SET_COMMENT_TOKEN_WITH_EMPTY_DATA:
          token.value = "";
          break;
        case A.SET_ATTRIBUTES_NAME_TO_CURRENT_CHARACTER:
          appendAttribute();
          attribute_name = char;
          break;
        case A.SET_ATTRIBUTES_NAME_TO_EMPTY_STRING:
          attribute_name = char;
          break;
        case A.SET_ATTRIBUTE_VALUE_TO_EMPTY_STRING:
          attribute_value = "";
          break;
        case A.SET_SELF_CLOSING_FLAG_OF_THIS_TAG:
          token.selfClose = true;
          break;
        case A.SET_FORCE_QUIRKS_FLAG_TO_ON:
          token.forceQuirks = true;
          break;
        case A.SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING:
          token.publicIdentifier = "";
          break;
        case A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING:
          token.systemIdentifier = "";
          break;
        // Append Actions
        case A.APPEND_LOWERCASE_VERSION_TO_TAG_NAME:
          token.name += char.toLowerCase();
          break;
        case A.APPEND_LOWERCASE_VERSION_TO_TEMPORARY_BUFFER:
          temporary_buffer += char.toLowerCase();
          break;
        case A.APPEND_LOWERCASE_VERSION_TO_ATTRIBUTE_NAME:
          attribute_name += char.toLowerCase();
          break;
        case A.APPEND_LOWERCASE_VERSION_TO_DOCTYPE_TOKEN:
          token.name += char.toLowerCase();
          break;
        case A.APPEND_TO_ATTRIBUTE_NAME:
          attribute_name += char;
          break;
        case A.APPEND_TO_ATTRIBUTE_VALUE:
          attribute_value += char;
          break;
        case A.APPEND_TO_COMMENT_DATA:
          token.value += char;
          break;
        case A.APPEND_TO_DOCTYPE_TOKEN:
          token.name += char;
          break;
        case A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_TAG_NAME:
          token.name += REPLACEMENT_CHAR;
          break;
        case A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_ATTRIBUTE_VALUE:
          attribute_value += REPLACEMENT_CHAR;
          break;
        case A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_TOKEN_NAME:
          token.name += REPLACEMENT_CHAR;
          break;
        case A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_COMMENT_TOKEN:
          token.value = REPLACEMENT_CHAR;
          break;
        case A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER:
          token.publicIdentifier += REPLACEMENT_CHAR;
          break;
        case A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER:
          token.systemIdentifier += REPLACEMENT_CHAR;
          break;
        case A.APPEND_TO_TAG_NAME:
          token.name += char;
          break;
        case A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA:
          token.value += C.HYPHEN_MINUS;
          break;
        case A.APPEND_HYPHEN_EXCLAMATION_CHARACTER_TO_THE_COMMENT_DATA:
          token.value += C.HYPHEN_MINUS;
          token.value += C.EXCLAMATION_MARK;
          break;
        case A.APPEND_AMPERSAND_TO_TEMPORARY_BUFFER:
          token.value += C.AMPERSAND;
          break;
        case A.APPEND_TO_TEMPORARY_BUFFER:
          temporary_buffer += char;
          break;
        case A.APPEND_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER:
          token.publicIdentifier += char;
          break;
        case A.APPEND_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER:
          token.systemIdentifier += char;
          break;
        // Clean Actions
        case A.CLEAN_TEMPORARY_BUFFER:
          temporary_buffer = "";
          break;
        // REDIRECT ACTION
        case A.RETURN_TO_RETURN_STATE:
          state = returnState;
          break;
      }
    }

    if (typeof nextState === "function") {
      state = nextState;
    }
  }
};

let html = fs
  .readFileSync(
    "/Users/cyrusky/Documents/projects/byHand/JavaScript/06.HTMLParser/test.html"
  )
  .toString();
let tokenizer = Tokenization(html);

while (true) {
  let { value, done } = tokenizer.next();
  if (!done) {
    console.log(value);
  } else {
    break;
  }
}
