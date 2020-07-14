/**
 * File: states.ts
 * Created Date: 2020-06-28  21:40:11 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-14 22:39:44 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
import * as C from "./consts/codes";
import * as A from "./consts/actions";
import * as T from "./consts/tokenType";
import * as E from "./consts/exceptions";
import { EMIT_DOCTYPE_TOKEN } from "./consts";

interface StatesReturns {
  nextState?: (
    char: string,
    nowToken: Token | null,
    buffer: string
  ) => StatesReturns;
  returnState?: (
    char: string,
    nowToken: Token | null,
    buffer: string
  ) => StatesReturns;
  action?: Array<Symbol>;
  exception?: Error | Array<Error>;
  consumeNextFew?: Array<string>;
}

/**
 * Token接口
 */
interface Token {
  type: Symbol;
  token: string;
  buffer: string;
}

/* Note: 01. DataState */
export function DataState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    // case "&":
    //   return {
    //     returnState: DataState,
    //     nextState: CharacterReferenceState,
    //   };
    case "<":
      return {
        nextState: TagOpenState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 02. RCDATAState */
function RCDATAState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    // case "&":
    //   return {
    //     returnState: RCDATAState,
    //     nextState: CharacterReferenceState,
    //   };
    case "<":
      return {
        nextState: RCDATALessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 03. RAWTEXTState */
function RAWTEXTState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "<":
      return {
        nextState: RAWTEXTLessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 04. ScriptDataState */
function ScriptDataState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "<":
      return {
        nextState: ScriptDataLessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
      };
    case C.EOF:
      return {
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 05. PLAINTEXTState */
function PLAINTEXTState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 06. TagOpenState */
function TagOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [
        A.CREATE_NEW_START_TAG_TOKEN,
        A.SET_TAG_NAME_TO_EMPTY_STRING,
        A.APPEND_TO_TAG_NAME,
      ],
      nextState: TagNameState,
    };
  }
  switch (char) {
    case "!":
      return {
        nextState: MarkupDeclarationOpenState,
        consumeNextFew: A.CONSUME_NEXT_FEW["MarkupDeclarationOpenState"],
      };
    case "/":
      return {
        nextState: EndTagOpenState,
      };
    case "?":
      return {
        exception: new E.UnexpectedQuestionMarkInsteadOfTagNameParseError(),
        action: [A.CREATE_COMMENT_TOKEN, A.SET_COMMENT_TOKEN_WITH_EMPTY_DATA],
        nextState: BogusCommentState,
      };
    case C.EOF:
      return {
        exception: new E.EofBeforeTagNameParseError(),
      };
    default:
      return {
        exception: new E.InvalidFirstCharacterOfTagNameParseError(),
        action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
        nextState: DataState,
      };
  }
}
/* Note: 07. EndTagOpenState */
function EndTagOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [
        A.CREATE_NEW_END_TAG_TOKEN,
        A.SET_TAG_NAME_TO_EMPTY_STRING,
        A.APPEND_TO_TAG_NAME,
      ],
      nextState: TagNameState,
    };
  }
  switch (char) {
    case C.GREATER_THAN_SIGN:
      return {
        exception: new E.MissingEndTagNameParseError(),
        nextState: DataState,
      };
    case C.EOF:
      return {
        exception: new E.EofBeforeTagNameParseError(),
        action: [
          A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
          A.EMIT_SOLIDUS_CHARACTER_TOKEN,
          A.EMIT_END_OF_FILE_TOKEN,
        ],
      };
    default:
      return {
        exception: new E.InvalidFirstCharacterOfTagNameParseError(),
        action: [A.CREATE_COMMENT_TOKEN, A.SET_COMMENT_TOKEN_WITH_EMPTY_DATA],
        nextState: BogusCommentState,
      };
  }
}
/* Note: 08. TagNameState */
function TagNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [A.APPEND_LOWERCASE_VERSION_TO_TAG_NAME],
    };
  } else if (char === C.EOF) {
    return {
      exception: new E.EofInTagParseError(),
      action: [A.EMIT_END_OF_FILE_TOKEN],
    };
  }
  let codeNum: number = char.charCodeAt(0);
  switch (codeNum) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BeforeAttributeNameState,
      };
    case C.SOLIDUS_CODE:
      return {
        nextState: SelfClosingStartTagState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_CURRENT_TAG_TOKEN],
        nextState: DataState,
      };
    case C.NULL_CODE:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_TAG_NAME],
      };
    default:
      return {
        action: [A.APPEND_TO_TAG_NAME],
      };
  }
}
/* Note: 09. RCDATALessThanSignState */
function RCDATALessThanSignState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.SOLIDUS:
      return {
        action: [A.CLEAN_TEMPORARY_BUFFER],
        nextState: RCDATAEndTagOpenState,
      };
    default:
      return {
        action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
        nextState: RCDATAState,
      };
  }
}
/* Note: 10. RCDATAEndTagOpenState */
function RCDATAEndTagOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [
        A.CREATE_NEW_END_TAG_TOKEN,
        A.SET_TAG_NAME_TO_EMPTY_STRING,
        A.APPEND_TO_TAG_NAME,
      ],
      nextState: RCDATAEndTagNameState,
    };
  }
  return {
    action: [
      A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
      A.EMIT_SOLIDUS_CHARACTER_TOKEN,
    ],
    nextState: RCDATAState,
  };
}
/* Note: 11. RCDATAEndTagNameState */
function RCDATAEndTagNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE
  ) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: BeforeAttributeNameState,
      };
    }
  } else if (charCodeNum === C.SOLIDUS_CODE) {
    // 反斜杠 /
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: SelfClosingStartTagState,
      };
    }
  } else if (charCodeNum === C.GREATER_THAN_SIGN_CODE) {
    // 大于号 >
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        action: [A.EMIT_CURRENT_TAG_TOKEN],
        nextState: DataState,
      };
    }
  } else if (
    charCodeNum >= C.A_UPPER_CASE_CODE &&
    charCodeNum <= C.Z_UPPER_CASE_CODE
  ) {
    return {
      action: [
        A.APPEND_LOWERCASE_VERSION_TO_TAG_NAME,
        A.APPEND_TO_TEMPORARY_BUFFER,
      ],
      nextState: RCDATAEndTagNameState,
    };
  } else if (
    charCodeNum >= C.A_LOWER_CASE_CODE &&
    charCodeNum <= C.Z_LOWER_CASE_CODE
  ) {
    return {
      action: [A.APPEND_TO_TAG_NAME, A.APPEND_TO_TEMPORARY_BUFFER],
      nextState: RCDATAEndTagNameState,
    };
  } else {
    return {
      action: [
        A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
        A.EMIT_SOLIDUS_CHARACTER_TOKEN,
        A.EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN,
      ],
      nextState: RCDATAState,
    };
  }
}
/* Note: 12. RAWTEXTLessThanSignState */
function RAWTEXTLessThanSignState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.SOLIDUS) {
    return {
      action: [A.CLEAN_TEMPORARY_BUFFER],
      nextState: RAWTEXTEndTagOpenState,
    };
  } else {
    return {
      action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
      nextState: RAWTEXTState,
    };
  }
}
/* Note: 13. RAWTEXTEndTagOpenState */
function RAWTEXTEndTagOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [A.CREATE_NEW_END_TAG_TOKEN, A.SET_TAG_NAME_TO_EMPTY_STRING],
      nextState: RAWTEXTEndTagNameState,
    };
  } else {
    return {
      action: [
        A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
        A.EMIT_SOLIDUS_CHARACTER_TOKEN,
      ],
      nextState: RAWTEXTState,
    };
  }
}
/* Note: 14. RAWTEXTEndTagNameState */
function RAWTEXTEndTagNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE
  ) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: BeforeAttributeNameState,
      };
    }
  } else if (charCodeNum === C.SOLIDUS_CODE) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: SelfClosingStartTagState,
      };
    }
  } else if (charCodeNum === C.GREATER_THAN_SIGN_CODE) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: DataState,
        action: [A.EMIT_CURRENT_TAG_TOKEN],
      };
    }
  } else if (
    charCodeNum >= C.A_UPPER_CASE_CODE &&
    charCodeNum <= C.Z_UPPER_CASE_CODE
  ) {
    return {
      action: [
        A.APPEND_LOWERCASE_VERSION_TO_TAG_NAME,
        A.APPEND_TO_TEMPORARY_BUFFER,
      ],
    };
  } else if (
    charCodeNum >= C.A_LOWER_CASE_CODE &&
    charCodeNum <= C.Z_LOWER_CASE_CODE
  ) {
    return {
      action: [A.APPEND_TO_TAG_NAME, A.APPEND_TO_TEMPORARY_BUFFER],
      nextState: RAWTEXTEndTagNameState,
    };
  }
  return {
    action: [
      A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
      A.EMIT_SOLIDUS_CHARACTER_TOKEN,
      A.EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN,
    ],
    nextState: RAWTEXTState,
  };
}
/* Note: 15. ScriptDataLessThanSignState */
function ScriptDataLessThanSignState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.SOLIDUS) {
    return {
      action: [A.CLEAN_TEMPORARY_BUFFER],
    };
  } else if (char === "!") {
    return {
      action: [
        A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
        A.EMIT_EXCLAMATION_MARK_CHARACTER_TOKEN,
      ],
    };
  } else {
    return {
      action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
      nextState: ScriptDataState,
    };
  }
}
/* Note: 16. ScriptDataEndTagOpenState */
function ScriptDataEndTagOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [A.CREATE_NEW_END_TAG_TOKEN, A.SET_TAG_NAME_TO_EMPTY_STRING],
      nextState: ScriptDataEndTagNameState,
    };
  } else {
    return {
      action: [
        A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
        A.EMIT_SOLIDUS_CHARACTER_TOKEN,
      ],
      nextState: ScriptDataState,
    };
  }
}
/* Note: 17. ScriptDataEndTagNameState */
function ScriptDataEndTagNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE
  ) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: BeforeAttributeNameState,
      };
    }
  } else if (charCodeNum === C.SOLIDUS_CODE) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: SelfClosingStartTagState,
      };
    }
  } else if (charCodeNum === C.GREATER_THAN_SIGN_CODE) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        action: [A.EMIT_CURRENT_TAG_TOKEN],
        nextState: DataState,
      };
    }
  } else if (
    charCodeNum >= C.A_UPPER_CASE_CODE &&
    charCodeNum <= C.Z_UPPER_CASE_CODE
  ) {
    return {
      action: [
        A.APPEND_LOWERCASE_VERSION_TO_TAG_NAME,
        A.APPEND_TO_TEMPORARY_BUFFER,
      ],
    };
  } else if (
    charCodeNum >= C.A_LOWER_CASE_CODE &&
    charCodeNum <= C.Z_LOWER_CASE_CODE
  ) {
    return {
      action: [A.APPEND_TO_TAG_NAME, A.APPEND_TO_TEMPORARY_BUFFER],
    };
  }
  return {
    action: [
      A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
      A.EMIT_SOLIDUS_CHARACTER_TOKEN,
      A.EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN,
    ],
    nextState: ScriptDataState,
  };
}
/* Note: 18. ScriptDataEscapeStartState */
function ScriptDataEscapeStartState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.HYPHEN_MINUS) {
    return {
      action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
      nextState: ScriptDataEscapeStartState,
    };
  } else {
    return {
      nextState: ScriptDataState,
    };
  }
}
/* Note: 19. ScriptDataEscapeStartDashState */
function ScriptDataEscapeStartDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.HYPHEN_MINUS) {
    return {
      action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
      nextState: ScriptDataEscapedDashDashState,
    };
  } else {
    return {
      nextState: ScriptDataState,
    };
  }
}
/* Note: 20. ScriptDataEscapedState */
function ScriptDataEscapedState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
        nextState: ScriptDataEscapedDashState,
      };
    case C.LESS_THAN_SIGN:
      return {
        nextState: ScriptDataEscapedLessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        action: [A.EMIT_END_OF_FILE_TOKEN],
        exception: new E.EofInScriptHtmlCommentLikeTextParseError(),
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 21. ScriptDataEscapedDashState */
function ScriptDataEscapedDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
        nextState: ScriptDataEscapedDashDashState,
      };
    case C.LESS_THAN_SIGN:
      return {
        nextState: ScriptDataEscapedLessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
        nextState: ScriptDataEscapedState,
      };
    case C.EOF:
      return {
        exception: new E.EofInScriptHtmlCommentLikeTextParseError(),
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_SOLIDUS_CHARACTER_TOKEN],
        nextState: ScriptDataEscapedState,
      };
  }
}
/* Note: 22. ScriptDataEscapedDashDashState */
function ScriptDataEscapedDashDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
      };
    case C.LESS_THAN_SIGN:
      return {
        nextState: ScriptDataEscapedLessThanSignState,
      };
    case C.GREATER_THAN_SIGN:
      return {
        action: [A.EMIT_GREATER_THAN_SIGN_CHARACTER_TOKEN],
        nextState: ScriptDataState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
        nextState: ScriptDataEscapedState,
      };
    case C.EOF:
      return {
        exception: new E.EofInScriptHtmlCommentLikeTextParseError(),
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: ScriptDataEscapedState,
      };
  }
}
/* Note: 23. ScriptDataEscapedLessThanSignState */
function ScriptDataEscapedLessThanSignState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [A.CLEAN_TEMPORARY_BUFFER, A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
      nextState: ScriptDataDoubleEscapeStartState,
    };
  }
  switch (char) {
    case C.SOLIDUS:
      return {
        action: [A.CLEAN_TEMPORARY_BUFFER],
        nextState: ScriptDataEscapedEndTagOpenState,
      };
    default:
      return {
        action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
        nextState: ScriptDataEscapedState,
      };
  }
}
/* Note: 24. ScriptDataEscapedEndTagOpenState */
function ScriptDataEscapedEndTagOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [A.CREATE_NEW_END_TAG_TOKEN, A.SET_TAG_NAME_TO_EMPTY_STRING],
      nextState: ScriptDataEscapedEndTagNameState,
    };
  }
  return {
    action: [
      A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
      A.EMIT_SOLIDUS_CHARACTER_TOKEN,
    ],
    nextState: ScriptDataEscapedState,
  };
}
/* Note: 25. ScriptDataEscapedEndTagNameState */
function ScriptDataEscapedEndTagNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE
  ) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: BeforeAttributeNameState,
      };
    }
  } else if (charCodeNum === C.SOLIDUS_CODE) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        nextState: SelfClosingStartTagState,
      };
    }
  } else if (charCodeNum === C.GREATER_THAN_SIGN_CODE) {
    if (nowToken?.type === T.APPROPRIATE_END_TAG_TOKEN) {
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: DataState,
      };
    }
  } else if (
    charCodeNum >= C.A_UPPER_CASE_CODE &&
    charCodeNum <= C.Z_UPPER_CASE_CODE
  ) {
    return {
      action: [
        A.APPEND_LOWERCASE_VERSION_TO_TAG_NAME,
        A.APPEND_TO_TEMPORARY_BUFFER,
      ],
    };
  } else if (
    charCodeNum >= C.A_LOWER_CASE_CODE &&
    charCodeNum <= C.Z_LOWER_CASE_CODE
  ) {
    return {
      action: [A.APPEND_TO_TAG_NAME, A.APPEND_TO_TEMPORARY_BUFFER],
    };
  }
  return {
    action: [
      A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN,
      A.EMIT_SOLIDUS_CHARACTER_TOKEN,
      A.EMIT_TEMPORARY_BUFFER_AS_CHARACTER_TOKEN,
    ],
    nextState: ScriptDataEscapedState,
  };
}
/* Note: 26. ScriptDataDoubleEscapeStartState */
function ScriptDataDoubleEscapeStartState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE ||
    charCodeNum === C.SOLIDUS_CODE ||
    charCodeNum === C.GREATER_THAN_SIGN_CODE
  ) {
    if (nowToken?.buffer === "script") {
      return {
        nextState: ScriptDataDoubleEscapedState,
      };
    } else {
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: ScriptDataEscapedState,
      };
    }
  } else if (
    charCodeNum >= C.A_UPPER_CASE_CODE &&
    charCodeNum <= C.Z_UPPER_CASE_CODE
  ) {
    return {
      action: [
        A.APPEND_LOWERCASE_VERSION_TO_TEMPORARY_BUFFER,
        A.EMIT_CURRENT_CHARACTER_TOKEN,
      ],
    };
  } else if (
    charCodeNum >= C.A_LOWER_CASE_CODE &&
    charCodeNum <= C.Z_LOWER_CASE_CODE
  ) {
    return {
      action: [A.APPEND_TO_TEMPORARY_BUFFER, A.EMIT_CURRENT_CHARACTER_TOKEN],
    };
  } else {
    return {
      nextState: ScriptDataEscapedState,
    };
  }
}
/* Note: 27. ScriptDataDoubleEscapedState */
function ScriptDataDoubleEscapedState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedDashState,
      };
    case C.LESS_THAN_SIGN:
      return {
        action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedLessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        exception: new E.EofInScriptHtmlCommentLikeTextParseError(),
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedState,
      };
  }
}
/* Note: 28. ScriptDataDoubleEscapedDashState */
function ScriptDataDoubleEscapedDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedDashDashState,
      };
    case "<":
      return {
        action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedLessThanSignState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        exception: new E.UnexpectedNullCharacterParseError(),
        nextState: ScriptDataDoubleEscapedState,
      };
    case C.EOF:
      return {
        exception: new E.EofInScriptHtmlCommentLikeTextParseError(),
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedState,
      };
  }
}
/* Note: 29. ScriptDataDoubleEscapedDashDashState */
function ScriptDataDoubleEscapedDashDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [A.EMIT_HYPHEN_MINUS_CHARACTER_TOKEN],
      };
    case C.LESS_THAN_SIGN:
      return {
        action: [A.EMIT_LESS_THAN_SIGN_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedLessThanSignState,
      };
    case C.GREATER_THAN_SIGN:
      return {
        action: [A.EMIT_GREATER_THAN_SIGN_CHARACTER_TOKEN],
        nextState: ScriptDataState,
      };
    case null:
      return {
        action: [A.EMIT_REPLACEMENT_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedState,
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.EOF:
      return {
        exception: new E.EofInScriptHtmlCommentLikeTextParseError(),
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedState,
      };
  }
}
/* Note: 30. ScriptDataDoubleEscapedLessThanSignState */
function ScriptDataDoubleEscapedLessThanSignState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  if (char === C.SOLIDUS) {
    return {
      action: [A.CLEAN_TEMPORARY_BUFFER, A.EMIT_SOLIDUS_CHARACTER_TOKEN],
      nextState: ScriptDataDoubleEscapeEndState,
    };
  } else {
    return {
      nextState: ScriptDataDoubleEscapedState,
    };
  }
}

/* Note: 31. ScriptDataDoubleEscapeEndState */
function ScriptDataDoubleEscapeEndState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE ||
    charCodeNum === C.SOLIDUS_CODE ||
    charCodeNum === C.GREATER_THAN_SIGN_CODE
  ) {
    if (buffer === "script") {
      return {
        nextState: ScriptDataEscapedState,
      };
    } else {
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
        nextState: ScriptDataDoubleEscapedState,
      };
    }
  } else if (
    charCodeNum >= C.A_UPPER_CASE_CODE &&
    charCodeNum <= C.Z_UPPER_CASE_CODE
  ) {
    return {
      action: [
        A.APPEND_LOWERCASE_VERSION_TO_TEMPORARY_BUFFER,
        A.EMIT_CURRENT_CHARACTER_TOKEN,
      ],
    };
  } else if (
    charCodeNum >= C.A_LOWER_CASE_CODE &&
    charCodeNum <= C.Z_LOWER_CASE_CODE
  ) {
    return {
      action: [A.APPEND_TO_TEMPORARY_BUFFER, A.EMIT_CURRENT_CHARACTER_TOKEN],
    };
  } else {
    return {
      nextState: ScriptDataDoubleEscapedState,
    };
  }
}
/* Note: 32. BeforeAttributeNameState */
function BeforeAttributeNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (
    charCodeNum === C.CHARACTER_TABULATION_CODE ||
    charCodeNum === C.LINE_FEED_CODE ||
    charCodeNum === C.FORM_FEED_CODE ||
    charCodeNum === C.SPACE_CODE
  ) {
    return {};
  } else if (
    charCodeNum === C.SOLIDUS_CODE ||
    charCodeNum === C.GREATER_THAN_SIGN_CODE ||
    char === C.EOF
  ) {
    return {
      nextState: AfterAttributeNameState,
    };
  } else if (charCodeNum === C.EQUALS_SIGN_CODE) {
    return {
      action: [
        A.CREATE_NEW_ATTRIBUTE_IN_CURRENT_TAG_TOKEN,
        A.SET_ATTRIBUTES_NAME_TO_CURRENT_CHARACTER,
        A.SET_ATTRIBUTE_VALUE_TO_EMPTY_STRING,
      ],
      exception: new E.UnexpectedEqualsSignBeforeAttributeNameParseError(),
      nextState: AttributeNameState,
    };
  } else {
    return {
      action: [
        A.CREATE_NEW_ATTRIBUTE_IN_CURRENT_TAG_TOKEN,
        A.SET_ATTRIBUTES_NAME_TO_EMPTY_STRING,
        A.SET_ATTRIBUTE_VALUE_TO_EMPTY_STRING,
      ],
      nextState: AttributeNameState,
    };
  }
}
/* Note: 33. AttributeNameState */
function AttributeNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      nextState: AfterAttributeNameState,
    };
  }
  if (/[A-Z]/.test(char)) {
    return {
      action: [A.APPEND_LOWERCASE_VERSION_TO_ATTRIBUTE_NAME],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
    case C.SOLIDUS_CODE:
    case C.GREATER_THAN_SIGN_CODE:
      return {
        nextState: AfterAttributeNameState,
      };
    case C.EQUALS_SIGN_CODE:
      return {
        nextState: BeforeAttributeValueState,
      };
    case C.NULL_CODE:
      return {
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_TAG_NAME],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    case C.QUOTATION_MARK_CODE:
    case C.APOSTROPHE_CODE:
    case C.LESS_THAN_CODE:
      return {
        exception: new E.UnexpectedCharacterInAttributeNameParseError(),
        action: [A.APPEND_TO_ATTRIBUTE_NAME],
      };
    default:
      return {
        action: [A.APPEND_TO_ATTRIBUTE_NAME],
      };
  }
}
/* Note: 34. AfterAttributeNameState */
function AfterAttributeNameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      exception: new E.EofInTagParseError(),
      action: [A.EMIT_END_OF_FILE_TOKEN],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.SOLIDUS_CODE:
      return {
        nextState: SelfClosingStartTagState,
      };
    case C.EQUALS_SIGN_CODE:
      return {
        nextState: BeforeAttributeValueState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_CURRENT_TAG_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        action: [
          A.CREATE_NEW_ATTRIBUTE_IN_CURRENT_TAG_TOKEN,
          A.SET_ATTRIBUTES_NAME_TO_EMPTY_STRING,
          A.SET_ATTRIBUTE_VALUE_TO_EMPTY_STRING,
        ],
        nextState: AttributeNameState,
      };
  }
}
/* Note: 35: BeforeAttributeValueState */
function BeforeAttributeValueState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.QUOTATION_MARK_CODE:
      return {
        nextState: AttributeValueDQState,
      };
    case C.APOSTROPHE_CODE:
      return {
        nextState: AttributeValueSQState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        exception: new E.MissingAttributeValueParseError(),
        nextState: DataState,
        action: [A.EMIT_CURRENT_TAG_TOKEN],
      };
    default:
      return {
        nextState: AttributeValueUQState,
      };
  }
}
/* Note: 36. AttributeValueDQState */
function AttributeValueDQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_END_OF_FILE_TOKEN],
      exception: new E.EofInTagParseError(),
    };
  }
  switch (char.charCodeAt(0)) {
    case C.QUOTATION_MARK_CODE:
      return {
        nextState: AfterAttributeValueQState,
      };
    // case AMPERSAND_CODE:
    //   return {
    //     returnState: AttributeValueDQState,
    //     nextState: CharacterReferenceState,
    //   };
    case C.NULL_CODE:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_ATTRIBUTE_VALUE],
      };
    default:
      return {
        action: [A.APPEND_TO_ATTRIBUTE_VALUE],
      };
  }
}
/* Note: 37. AttributeValueSQState */
function AttributeValueSQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      exception: new E.EofInTagParseError(),
      action: [A.EMIT_END_OF_FILE_TOKEN],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.APOSTROPHE_CODE:
      return {
        nextState: AfterAttributeValueQState,
      };
    // case AMPERSAND_CODE:
    //   return {
    //     returnState: AttributeValueSQState,
    //     nextState: CharacterReferenceState,
    //   };
    case C.NULL_CODE:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_ATTRIBUTE_VALUE],
      };
    default:
      return {
        action: [A.APPEND_TO_ATTRIBUTE_VALUE],
        nextState: AttributeValueSQState,
      };
  }
}
/* Note: 38. AttributeValueUQState */
function AttributeValueUQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      exception: new E.EofInTagParseError(),
      action: [A.EMIT_END_OF_FILE_TOKEN],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BeforeAttributeNameState,
      };
    // case AMPERSAND_CODE:
    //   return {
    //     returnState: AttributeValueUQState,
    //     nextState: CharacterReferenceState,
    //   };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_CURRENT_TAG_TOKEN],
        nextState: DataState,
      };
    case C.NULL_CODE:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_ATTRIBUTE_VALUE],
      };
    case C.QUOTATION_MARK_CODE:
    case C.APOSTROPHE_CODE:
    case C.LESS_THAN_CODE:
    case C.EQUALS_SIGN_CODE:
    case C.GRAVE_ACCENT_CODE:
      return {
        exception: new E.UnexpectedCharacterInUnquotedAttributeValueParseError(),
        action: [A.APPEND_TO_ATTRIBUTE_VALUE],
      };
    default:
      return {
        action: [A.APPEND_TO_ATTRIBUTE_VALUE],
      };
  }
}
/* Note: 39. AfterAttributeValueQState */
function AfterAttributeValueQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      exception: new E.EofInTagParseError(),
      action: [A.EMIT_CURRENT_TAG_TOKEN],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BeforeAttributeNameState,
      };
    case C.SOLIDUS_CODE:
      return {
        nextState: SelfClosingStartTagState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_CURRENT_TAG_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        exception: new E.MissingWhitespaceBetweenAttributesParseError(),
        nextState: BeforeAttributeNameState,
      };
  }
}
/* Note: 40. SelfClosingStartTagState */
function SelfClosingStartTagState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_END_OF_FILE_TOKEN],
      exception: new E.EofInTagParseError(),
    };
  } else if (char === C.GREATER_THAN_SIGN) {
    return {
      action: [A.SET_SELF_CLOSING_FLAG_OF_THIS_TAG, A.EMIT_CURRENT_TAG_TOKEN],
      nextState: DataState,
    };
  } else {
    return {
      exception: new E.UnexpectedSolidusInTagParseError(),
      nextState: BeforeAttributeNameState,
    };
  }
}
/* Note: 41. BogusCommentState */
function BogusCommentState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_COMMENT_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
    };
  } else if (char === C.GREATER_THAN_SIGN) {
    return {
      action: [A.EMIT_COMMENT_TOKEN],
      nextState: DataState,
    };
  } else if (char === null) {
    return {
      action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_COMMENT_TOKEN],
      exception: new E.UnexpectedNullCharacterParseError(),
    };
  } else {
    return {
      action: [A.APPEND_TO_COMMENT_DATA],
    };
  }
}
/* Note: 42. MarkupDeclarationOpenState */
function MarkupDeclarationOpenState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char.toLowerCase()) {
    case "--":
      return {
        action: [A.CREATE_COMMENT_TOKEN, A.SET_COMMENT_TOKEN_WITH_EMPTY_DATA],
        nextState: CommentStartState,
      };
    case "doctype":
      return {
        nextState: DOCTYPEState,
      };
    // case "[cdata[":
    //   return {
    //     action: ,
    //     nextState: BogusCommentState,
    //   };
    default:
      return {
        exception: new E.IncorrectlyOpenedCommentParseError(),
        action: [A.CREATE_COMMENT_TOKEN, A.SET_COMMENT_TOKEN_WITH_EMPTY_DATA],
        nextState: BogusCommentState,
      };
  }
}
/* Note: 43. CommentStartState */
function CommentStartState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        nextState: CommentStartDashState,
      };
    case C.GREATER_THAN_SIGN:
      return {
        action: [A.EMIT_COMMENT_TOKEN],
        exception: new E.AbruptClosingOfEmptyComment(),
        nextState: DataState,
      };
    default:
      return {
        nextState: CommentState,
      };
  }
}
/* Note: 44. CommentStartDashState */
function CommentStartDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_COMMENT_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
      exception: new E.EofInCommentParseError(),
    };
  }
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        nextState: CommentEndState,
      };
    case C.GREATER_THAN_SIGN:
      return {
        action: [A.EMIT_COMMENT_TOKEN],
        exception: new E.AbruptClosingOfEmptyComment(),
        nextState: DataState,
      };
    default:
      return {
        action: [A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA],
        nextState: CommentState,
      };
  }
}
/* Note: 45. CommentState */
function CommentState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_COMMENT_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
      exception: new E.EofInCommentParseError(),
    };
  }
  switch (char.charCodeAt(0)) {
    case C.LESS_THAN_CODE:
      return {
        action: [A.APPEND_TO_COMMENT_DATA],
        nextState: CommentLessThanSignState,
      };
    case C.HYPHEN_MINUS_CODE:
      return {
        nextState: CommentEndDashState,
      };
    case C.NULL_CODE:
      return {
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_COMMENT_TOKEN],
      };
    default:
      return {
        action: [A.APPEND_TO_COMMENT_DATA],
      };
  }
}
/* Note: 46. CommentLessThanSignState */
function CommentLessThanSignState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.EXCLAMATION_MARK:
      return {
        action: [A.APPEND_TO_COMMENT_DATA],
        nextState: CommentLessThanSignBangState,
      };
    case C.LESS_THAN_SIGN:
      return {
        action: [A.APPEND_TO_COMMENT_DATA],
      };
    default:
      return {
        nextState: CommentState,
      };
  }
}
/* Note: 47. CommentLessThanSignBangState */
function CommentLessThanSignBangState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        nextState: CommentLessThanSignBangDashState,
      };
    default:
      return {
        nextState: CommentState,
      };
  }
}
/* Note: 48. CommentLessThanSignBangDashState */
function CommentLessThanSignBangDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        nextState: CommentLessThanSignBangDashDashState,
      };
    default:
      return {
        nextState: CommentEndDashState,
      };
  }
}
/* Note: 49. CommentLessThanSignBangDashDashState */
function CommentLessThanSignBangDashDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  switch (char) {
    case C.GREATER_THAN_SIGN:
    case C.EOF:
      return {
        nextState: CommentEndState,
      };
    default:
      return {
        exception: new E.NestedCommentParseError(),
        nextState: CommentEndState,
      };
  }
}
/* Note: 50. CommentEndDashState */
function CommentEndDashState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        nextState: CommentEndState,
      };
    case C.EOF:
      return {
        action: [A.EMIT_COMMENT_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
        exception: new E.EofInCommentParseError(),
      };
    default:
      return {
        action: [A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA],
        nextState: CommentState,
      };
  }
}
/* Note: 51. CommentEndState */
function CommentEndState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_COMMENT_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
      exception: new E.EofInCommentParseError(),
    };
  }
  switch (char) {
    case C.GREATER_THAN_SIGN:
      return {
        nextState: DataState,
        action: [A.EMIT_COMMENT_TOKEN],
      };
    case C.EXCLAMATION_MARK:
      return {
        nextState: CommentEndBangState,
      };
    case C.HYPHEN_MINUS:
      return {
        action: [A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA],
      };
    default:
      return {
        action: [A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA],
        nextState: CommentState,
      };
  }
}
/* Note: 52. CommentEndBangState */
function CommentEndBangState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      action: [A.EMIT_COMMENT_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
      exception: new E.EofInCommentParseError(),
    };
  }
  switch (char) {
    case C.HYPHEN_MINUS:
      return {
        action: [
          A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA,
          A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA,
          A.APPEND_HYPHEN_EXCLAMATION_CHARACTER_TO_THE_COMMENT_DATA,
        ],
        nextState: CommentEndDashState,
      };
    case C.GREATER_THAN_SIGN:
      return {
        exception: new E.IncorrectlyClosedCommentParseError(),
        action: [A.EMIT_COMMENT_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        action: [
          A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA,
          A.APPEND_HYPHEN_MINUS_CHARACTER_TO_THE_COMMENT_DATA,
          A.APPEND_HYPHEN_EXCLAMATION_CHARACTER_TO_THE_COMMENT_DATA,
        ],
        nextState: CommentState,
      };
  }
}
/* Note: 53. DOCTYPEState */
function DOCTYPEState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.CREATE_DOCTYPE_TOKEN,
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
      ],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BeforeDOCTYPENameState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        nextState: AfterDOCTYPENameState,
      };
    default:
      return {
        exception: new E.MissingWhitespaceBeforeDoctypeNameParseError(),
        nextState: BeforeDOCTYPENameState,
      };
  }
}
/* Note: 54. BeforeDOCTYPENameState */
function BeforeDOCTYPENameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [
        A.CREATE_DOCTYPE_TOKEN,
        A.APPEND_LOWERCASE_VERSION_TO_DOCTYPE_TOKEN,
      ],
      nextState: DOCTYPENameState,
    };
  }
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.CREATE_DOCTYPE_TOKEN,
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [
          A.CREATE_DOCTYPE_TOKEN,
          A.SET_FORCE_QUIRKS_FLAG_TO_ON,
          A.EMIT_DOCTYPE_TOKEN,
        ],
        exception: new E.MissingDoctypeNameParseError(),
        nextState: DataState,
      };
    case C.NULL_CODE:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [
          A.CREATE_DOCTYPE_TOKEN,
          A.SET_FORCE_QUIRKS_FLAG_TO_ON,
          A.EMIT_DOCTYPE_TOKEN,
        ],
        nextState: BeforeDOCTYPENameState,
      };
    default:
      return {
        action: [A.CREATE_DOCTYPE_TOKEN, A.APPEND_TO_DOCTYPE_TOKEN],
        nextState: DOCTYPENameState,
      };
  }
}
/* Note: 55. DOCTYPENameState */
function DOCTYPENameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z]/.test(char)) {
    return {
      action: [A.APPEND_LOWERCASE_VERSION_TO_DOCTYPE_TOKEN],
    };
  }
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: AfterDOCTYPENameState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    case C.NULL_CODE:
      return {
        action: [A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_TOKEN_NAME],
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    default:
      return {
        action: [A.APPEND_TO_DOCTYPE_TOKEN],
        nextState: DOCTYPENameState,
      };
  }
}
/* Note: 56. AfterDOCTYPENameState */
/**
 * TODO: 此处忽略了Public和System namespace的doctype.
 * @param char
 * @param nowToken
 */
function AfterDOCTYPENameState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    default:
      break;
  }
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  } else if (char.toUpperCase() === "PUBLIC") {
    return {
      nextState: AfterDOCTYPEPublicKeywordState,
    };
  } else if (char.toUpperCase() === "SYSTEM") {
    return {
      nextState: AfterDOCTYPESystemKeywordState,
    };
  } else {
    return {
      exception: new E.InvalidCharacterSequenceAfterDoctypeNameParseError(),
      action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
      nextState: BogusDOCTYPEState,
    };
  }
}
/* Note: 57. AfterDOCTYPEPublicKeywordState */
function AfterDOCTYPEPublicKeywordState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BeforeDOCTYPEPublicIdentifierState,
      };
    case C.QUOTATION_MARK_CODE:
      return {
        exception: new E.MissingWhitespaceAfterDoctypePublicKeywordParseError(),
        action: [A.SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPEPublicIdentifierDQState,
      };
    case C.APOSTROPHE_CODE:
      return {
        exception: new E.MissingWhitespaceAfterDoctypePublicKeywordParseError(),
        action: [A.SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPEPublicIdentifierSQState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        exception: new E.MissingDoctypePublicIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        exception: new E.MissingQuoteBeforeDoctypePublicIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 58. BeforeDOCTYPEPublicIdentifierState */
function BeforeDOCTYPEPublicIdentifierState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
) {
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (char.charCodeAt(0)) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.QUOTATION_MARK_CODE:
      return {
        action: [A.SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPEPublicIdentifierDQState,
      };
    case C.APOSTROPHE_CODE:
      return {
        action: [A.SET_DOCTYPE_PUBLIC_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPEPublicIdentifierSQState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
        exception: new E.MissingDoctypePublicIdentifierParseError(),
        nextState: DataState,
      };
    default:
      return {
        exception: new E.EofInDoctypeParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 59. DOCTYPEPublicIdentifierDQState */
function DOCTYPEPublicIdentifierDQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.QUOTATION_MARK:
      return {
        nextState: AfterDOCTYPEPublicIdentifierState,
      };
    case null:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [
          A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER,
        ],
      };
    case C.GREATER_THAN_SIGN:
      return {
        exception: new E.AbruptDoctypePublicIdentifierParseError(),
        nextState: DataState,
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
      };
    case C.EOF:
      return {
        exception: new E.EofInDoctypeParseError(),
        action: [
          A.SET_FORCE_QUIRKS_FLAG_TO_ON,
          A.EMIT_DOCTYPE_TOKEN,
          A.EMIT_END_OF_FILE_TOKEN,
        ],
      };
    default:
      return {
        action: [A.APPEND_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER],
      };
  }
}
/* Note: 60. DOCTYPEPublicIdentifierSQState */
function DOCTYPEPublicIdentifierSQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.APOSTROPHE:
      return {
        nextState: AfterDOCTYPEPublicIdentifierState,
      };
    case null:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [
          A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER,
        ],
      };
    case C.GREATER_THAN_SIGN:
      return {
        exception: new E.AbruptDoctypePublicIdentifierParseError(),
        nextState: DataState,
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
      };
    case C.EOF:
      return {
        exception: new E.EofInDoctypeParseError(),
        action: [
          A.SET_FORCE_QUIRKS_FLAG_TO_ON,
          EMIT_DOCTYPE_TOKEN,
          A.EMIT_END_OF_FILE_TOKEN,
        ],
      };
    default:
      return {
        action: [A.APPEND_TO_CURRENT_DOCTYPE_PUBLIC_IDENTIFIER],
      };
  }
}
/* Note: 61. AfterDOCTYPEPublicIdentifierState */
function AfterDOCTYPEPublicIdentifierState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (charCodeNum) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BetweenDOCTYPEPublicAndSystemIdentifiersState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        nextState: DataState,
        action: [A.EMIT_DOCTYPE_TOKEN],
      };
    case C.QUOTATION_MARK_CODE:
      return {
        exception: new E.MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiersParseError(),
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPESystemIdentifierDQState,
      };
    case C.APOSTROPHE_CODE:
      return {
        exception: new E.MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiersParseError(),
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPESystemIdentifierSQState,
      };
    default:
      return {
        exception: new E.MissingQuoteBeforeDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 62. BetweenDOCTYPEPublicAndSystemIdentifiersState */
function BetweenDOCTYPEPublicAndSystemIdentifiersState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (charCodeNum) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.GREATER_THAN_SIGN_CODE:
      return {
        nextState: DataState,
        action: [A.EMIT_DOCTYPE_TOKEN],
      };
    case C.QUOTATION_MARK_CODE:
      return {
        nextState: DOCTYPESystemIdentifierDQState,
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
      };
    case C.APOSTROPHE_CODE:
      return {
        nextState: DOCTYPESystemIdentifierSQState,
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
      };
    default:
      return {
        exception: new E.MissingQuoteBeforeDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 63. AfterDOCTYPESystemKeywordState */
function AfterDOCTYPESystemKeywordState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (charCodeNum) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {
        nextState: BeforeDOCTYPESystemIdentifierState,
      };
    case C.QUOTATION_MARK_CODE:
      return {
        exception: new E.MissingWhitespaceAfterDoctypeSystemKeywordParseError(),
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPESystemIdentifierDQState,
      };
    case C.APOSTROPHE_CODE:
      return {
        exception: new E.MissingWhitespaceAfterDoctypeSystemKeywordParseError(),
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPESystemIdentifierSQState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        exception: new E.MissingDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        exception: new E.MissingQuoteBeforeDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 64. BeforeDOCTYPESystemIdentifierState */
function BeforeDOCTYPESystemIdentifierState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (charCodeNum) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.QUOTATION_MARK_CODE:
      return {
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPESystemIdentifierDQState,
      };
    case C.APOSTROPHE_CODE:
      return {
        action: [A.SET_DOCTYPE_SYSTEM_IDENTIFIER_TO_EMPTY_STRING],
        nextState: DOCTYPESystemIdentifierSQState,
      };
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
        exception: new E.MissingDoctypeSystemIdentifierParseError(),
      };
    default:
      return {
        exception: new E.MissingQuoteBeforeDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON],
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 65. Unfinished DOCTYPESystemIdentifierDQState */
function DOCTYPESystemIdentifierDQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.QUOTATION_MARK:
      return {
        nextState: AfterDOCTYPESystemIdentifierState,
      };
    case null:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [
          A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER,
        ],
      };
    case C.GREATER_THAN_SIGN:
      return {
        exception: new E.AbruptDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        action: [A.APPEND_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER],
      };
  }
}
/* Note: 66. Unfinished DOCTYPESystemIdentifierSQState */
function DOCTYPESystemIdentifierSQState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.APOSTROPHE:
      return {
        nextState: AfterDOCTYPESystemIdentifierState,
      };
    case null:
      return {
        nextState: DataState,
        exception: new E.UnexpectedNullCharacterParseError(),
        action: [
          A.APPEND_REPLACEMENT_CHARACTER_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER,
        ],
      };
    case C.GREATER_THAN_SIGN:
      return {
        exception: new E.AbruptDoctypeSystemIdentifierParseError(),
        action: [A.SET_FORCE_QUIRKS_FLAG_TO_ON, A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    case C.EOF:
      return {
        exception: new E.EofInDoctypeParseError(),
        action: [
          A.SET_FORCE_QUIRKS_FLAG_TO_ON,
          A.EMIT_DOCTYPE_TOKEN,
          A.EMIT_END_OF_FILE_TOKEN,
        ],
      };
    default:
      return {
        action: [A.APPEND_TO_CURRENT_DOCTYPE_SYSTEM_IDENTIFIER],
      };
  }
}
/* Note: 67. AfterDOCTYPESystemIdentifierState */
function AfterDOCTYPESystemIdentifierState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (char === C.EOF) {
    return {
      exception: new E.EofInDoctypeParseError(),
      action: [
        A.SET_FORCE_QUIRKS_FLAG_TO_ON,
        A.EMIT_DOCTYPE_TOKEN,
        A.EMIT_END_OF_FILE_TOKEN,
      ],
    };
  }
  switch (charCodeNum) {
    case C.CHARACTER_TABULATION_CODE:
    case C.LINE_FEED_CODE:
    case C.FORM_FEED_CODE:
    case C.SPACE_CODE:
      return {};
    case C.GREATER_THAN_SIGN_CODE:
      return {
        action: [A.EMIT_DOCTYPE_TOKEN],
        nextState: DataState,
      };
    default:
      return {
        exception: new E.UnexpectedCharacterAfterDoctypeSystemIdentifierParseError(),
        nextState: BogusDOCTYPEState,
      };
  }
}
/* Note: 68. BogusDOCTYPEState */
function BogusDOCTYPEState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  let charCodeNum = char.charCodeAt(0);
  if (char === C.EOF) {
    return {
      action: [A.EMIT_DOCTYPE_TOKEN, A.EMIT_END_OF_FILE_TOKEN],
    };
  }
  switch (charCodeNum) {
    case C.GREATER_THAN_SIGN_CODE:
      return {
        nextState: DataState,
        action: [A.EMIT_DOCTYPE_TOKEN],
      };
    case C.NULL_CODE:
      return {
        exception: new E.UnexpectedNullCharacterParseError(),
      };
    default:
      return {};
  }
}
/* Note: 69. CDATASectionState */
function CDATASectionState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.RIGHT_SQUARE_BRACKET:
      return {
        nextState: CDATASectionBracketState,
      };
    case C.EOF:
      return {
        exception: new E.EofInCdataParseError(),
        action: [A.EMIT_END_OF_FILE_TOKEN],
      };
    default:
      return {
        action: [A.EMIT_CURRENT_CHARACTER_TOKEN],
      };
  }
}
/* Note: 70, Unfinished CDATASectionBracketState */
function CDATASectionBracketState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.RIGHT_SQUARE_BRACKET:
      return {
        nextState: CDATASectionEndState,
      };
    default:
      return {
        action: [A.EMIT_RIGHT_SQUARE_BRACKET_CHARACTER_TOKEN],
        nextState: CDATASectionState,
      };
  }
}
/* Note: 71. Unfinished CDATASectionEndState */
function CDATASectionEndState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case C.RIGHT_SQUARE_BRACKET:
      return {
        action: [A.EMIT_RIGHT_SQUARE_BRACKET_CHARACTER_TOKEN],
      };
    case C.GREATER_THAN_SIGN:
      return {
        nextState: DataState,
      };
    default:
      return {
        action: [A.EMIT_RIGHT_SQUARE_BRACKET_CHARACTER_TOKEN],
        nextState: CDATASectionState,
      };
  }
}
/* Note: 72. CharacterReferenceState */
function CharacterReferenceState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  if (/[a-zA-Z0-9]/.test(char)) {
    return {
      nextState: NamedCharacterReferenceState,
      action: [
        A.CLEAN_TEMPORARY_BUFFER,
        A.APPEND_AMPERSAND_TO_TEMPORARY_BUFFER,
      ],
    };
  } else if (char === C.NUMBER_SIGN) {
    return {
      nextState: NumericCharacterReferenceState,
      action: [
        A.CLEAN_TEMPORARY_BUFFER,
        A.APPEND_AMPERSAND_TO_TEMPORARY_BUFFER,
        A.APPEND_TO_TEMPORARY_BUFFER,
      ],
    };
  } else {
    return {
      action: [A.EMIT_CURRENT_CHARACTER_TOKEN, A.RETURN_TO_RETURN_STATE],
    };
  }
}
/* Note: 73. NamedCharacterReferenceState */
function NamedCharacterReferenceState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: 74. AmbiguousAmpersandState */
function AmbiguousAmpersandState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: 75. NumericCharacterReferenceState */
function NumericCharacterReferenceState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: 77. HexadecimalCharacterReferenceStartState */
function HexadecimalCharacterReferenceStartState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: 76. DecimalCharacterReferenceStartState */
function DecimalCharacterReferenceStartState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: 77. HexadecimalCharacterReferenceState */
function HexadecimalCharacterReferenceState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: 80. DecimalCharacterReferenceState */
function DecimalCharacterReferenceState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
/* Note: NumericCharacterReferenceEndState */
function NumericCharacterReferenceEndState(
  char: string,
  nowToken: Token = null,
  buffer: string = ""
): StatesReturns {
  switch (char) {
    case "":
      return {};
    default:
      return {};
  }
}
