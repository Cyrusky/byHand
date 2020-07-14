/**
 * File: tokenType.ts
 * Created Date: 2020-06-28  21:47:12 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-14 14:57:27 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
const CHARACTER_TOKEN = Symbol("character token");
const END_OF_FILE_TOKEN = Symbol("end of file");
const START_TAG_TOKEN = Symbol("Start Tag");
const END_TAG_TOKEN = Symbol("End Tag Token");
const ATTRIBUTE_TOKEN = Symbol("Attribute Token");
const COMMENT_TOKEN = Symbol("Comment Token");
const DOCTYPE_TOKEN = Symbol("DocType Token");
const LESS_THAN_SIGN_CHARACTER_TOKEN = Symbol("Less Than Sign Character Token");
const APPROPRIATE_END_TAG_TOKEN = Symbol("Apprpriate End Tag Token");

export {
  CHARACTER_TOKEN,
  END_OF_FILE_TOKEN,
  START_TAG_TOKEN,
  END_TAG_TOKEN,
  ATTRIBUTE_TOKEN,
  COMMENT_TOKEN,
  DOCTYPE_TOKEN,
  LESS_THAN_SIGN_CHARACTER_TOKEN,
  APPROPRIATE_END_TAG_TOKEN,
};
