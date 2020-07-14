/**
 * File: exceptions.ts
 * Created Date: 2020-06-24  21:36:26 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-28 22:05:55 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
/**
 * This error occurs if the parser encounters an empty comment that is abruptly
 * closed by a U+003E (>) code point (i.e., <!--> or <!--->).
 * The parser behaves as if the comment is closed correctly.
 */
class AbruptClosingOfEmptyComment implements Error {
  name = "AbruptClosingOfEmptyCommentException";
  message = "AbruptClosingOfEmptyComment";
}
class AbruptDoctypePublicIdentifierParseError implements Error {
  name = "AbruptDoctypePublicIdentifierParseErrorException";
  message = "AbruptDoctypePublicIdentifierParseError";
}
class AbruptDoctypeSystemIdentifierParseError implements Error {
  name = "AbruptDoctypeSystemIdentifierParseErrorException";
  message = "AbruptDoctypeSystemIdentifierParseError";
}
class AbsenceOfDigitsInNumericCharacterReferenceParseError implements Error {
  name = "AbsenceOfDigitsInNumericCharacterReferenceParseErrorException";
  message = "AbsenceOfDigitsInNumericCharacterReferenceParseError";
}
class CdataInHtmlContentParseError implements Error {
  name = "CdataInHtmlContentParseErrorException";
  message = "CdataInHtmlContentParseError";
}
class CharacterReferenceOutsideUnicodeRangeParseError implements Error {
  name = "CharacterReferenceOutsideUnicodeRangeParseErrorException";
  message = "CharacterReferenceOutsideUnicodeRangeParseError";
}
class ControlCharacterInInputStreamParseError implements Error {
  name = "ControlCharacterInInputStreamParseErrorException";
  message = "ControlCharacterInInputStreamParseError";
}
class ControlCharacterReferenceParseError implements Error {
  name = "ControlCharacterReferenceParseErrorException";
  message = "ControlCharacterReferenceParseError";
}
class EndTagWithAttributesParseError implements Error {
  name = "EndTagWithAttributesParseErrorException";
  message = "EndTagWithAttributesParseError";
}
class DuplicateAttributeParseError implements Error {
  name = "DuplicateAttributeParseErrorException";
  message = "DuplicateAttributeParseError";
}
class EndTagWithTrailingSolidusParseError implements Error {
  name = "EndTagWithTrailingSolidusParseErrorException";
  message = "EndTagWithTrailingSolidusParseError";
}
/**
 * This error occurs if the parser encounters the end of the input stream
 * where a tag name is expected. In this case the parser treats the beginning
 * of a start tag (i.e., <) or an end tag (i.e., </) as text content.
 */
class EofBeforeTagNameParseError implements Error {
  name = "EofBeforeTagNameParseErrorException";
  message = "EofBeforeTagNameParseError";
}
class EofInCdataParseError implements Error {
  name = "EofInCdataParseErrorException";
  message = "EofInCdataParseError";
}
class EofInCommentParseError implements Error {
  name = "EofInCommentParseErrorException";
  message = "EofInCommentParseError";
}
class EofInDoctypeParseError implements Error {
  name = "EofInDoctypeParseErrorException";
  message = "EofInDoctypeParseError";
}
class EofInScriptHtmlCommentLikeTextParseError implements Error {
  name = "EofInScriptHtmlCommentLikeTextParseErrorException";
  message = "EofInScriptHtmlCommentLikeTextParseError";
}
class EofInTagParseError implements Error {
  name = "EofInTagParseErrorException";
  message = "EofInTagParseError";
}
class IncorrectlyClosedCommentParseError implements Error {
  name = "IncorrectlyClosedCommentParseErrorException";
  message = "IncorrectlyClosedCommentParseError";
}
class IncorrectlyOpenedCommentParseError implements Error {
  name = "IncorrectlyOpenedCommentParseErrorException";
  message = "IncorrectlyOpenedCommentParseError";
}
class InvalidCharacterSequenceAfterDoctypeNameParseError implements Error {
  name = "InvalidCharacterSequenceAfterDoctypeNameParseErrorException";
  message = "InvalidCharacterSequenceAfterDoctypeNameParseError";
}
class InvalidFirstCharacterOfTagNameParseError implements Error {
  name = "InvalidFirstCharacterOfTagNameParseErrorException";
  message = "InvalidFirstCharacterOfTagNameParseError";
}
class MissingAttributeValueParseError implements Error {
  name = "MissingAttributeValueParseErrorException";
  message = "MissingAttributeValueParseError";
}
class MissingDoctypeNameParseError implements Error {
  name = "MissingDoctypeNameParseErrorException";
  message = "MissingDoctypeNameParseError";
}
class MissingDoctypePublicIdentifierParseError implements Error {
  name = "MissingDoctypePublicIdentifierParseErrorException";
  message = "MissingDoctypePublicIdentifierParseError";
}
class MissingDoctypeSystemIdentifierParseError implements Error {
  name = "MissingDoctypeSystemIdentifierParseErrorException";
  message = "MissingDoctypeSystemIdentifierParseError";
}
class MissingEndTagNameParseError implements Error {
  name = "MissingEndTagNameParseErrorException";
  message = "MissingEndTagNameParseError";
}
class MissingQuoteBeforeDoctypePublicIdentifierParseError implements Error {
  name = "MissingQuoteBeforeDoctypePublicIdentifierParseErrorException";
  message = "MissingQuoteBeforeDoctypePublicIdentifierParseError";
}
class MissingQuoteBeforeDoctypeSystemIdentifierParseError implements Error {
  name = "MissingQuoteBeforeDoctypeSystemIdentifierParseErrorException";
  message = "MissingQuoteBeforeDoctypeSystemIdentifierParseError";
}
class MissingSemicolonAfterCharacterReferenceParseError implements Error {
  name = "MissingSemicolonAfterCharacterReferenceParseErrorException";
  message = "MissingSemicolonAfterCharacterReferenceParseError";
}
class MissingWhitespaceAfterDoctypePublicKeywordParseError implements Error {
  name = "MissingWhitespaceAfterDoctypePublicKeywordParseErrorException";
  message = "MissingWhitespaceAfterDoctypePublicKeywordParseError";
}
class MissingWhitespaceAfterDoctypeSystemKeywordParseError implements Error {
  name = "MissingWhitespaceAfterDoctypeSystemKeywordParseErrorException";
  message = "MissingWhitespaceAfterDoctypeSystemKeywordParseError";
}
class MissingWhitespaceBeforeDoctypeNameParseError implements Error {
  name = "MissingWhitespaceBeforeDoctypeNameParseErrorException";
  message = "MissingWhitespaceBeforeDoctypeNameParseError";
}
class MissingWhitespaceBetweenAttributesParseError implements Error {
  name = "MissingWhitespaceBetweenAttributesParseErrorException";
  message = "MissingWhitespaceBetweenAttributesParseError";
}
class MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiersParseError
  implements Error {
  name = " implemException";
  message = " implem";
}
class NestedCommentParseError implements Error {
  name = "NestedCommentParseErrorException";
  message = "NestedCommentParseError";
}
class NoncharacterCharacterReferenceParseError implements Error {
  name = "NoncharacterCharacterReferenceParseErrorException";
  message = "NoncharacterCharacterReferenceParseError";
}
class NoncharacterInInputStreamParseError implements Error {
  name = "NoncharacterInInputStreamParseErrorException";
  message = "NoncharacterInInputStreamParseError";
}
class NonVoidHtmlElementStartTagWithTrailingSolidusParseError implements Error {
  name = " implemException";
  message = " implem";
}
class NullCharacterReferenceParseError implements Error {
  name = "NullCharacterReferenceParseErrorException";
  message = "NullCharacterReferenceParseError";
}
class SurrogateCharacterReferenceParseError implements Error {
  name = "SurrogateCharacterReferenceParseErrorException";
  message = "SurrogateCharacterReferenceParseError";
}
class SurrogateInInputStreamParseError implements Error {
  name = "SurrogateInInputStreamParseErrorException";
  message = "SurrogateInInputStreamParseError";
}
class UnexpectedCharacterAfterDoctypeSystemIdentifierParseError
  implements Error {
  name = " implemException";
  message = " implem";
}
class UnexpectedCharacterInAttributeNameParseError implements Error {
  name = "UnexpectedCharacterInAttributeNameParseErrorException";
  message = "UnexpectedCharacterInAttributeNameParseError";
}
class UnexpectedCharacterInUnquotedAttributeValueParseError implements Error {
  name = "UnexpectedCharacterInUnquotedAttributeValueParseErrorException";
  message = "UnexpectedCharacterInUnquotedAttributeValueParseError";
}
class UnexpectedEqualsSignBeforeAttributeNameParseError implements Error {
  name = "UnexpectedEqualsSignBeforeAttributeNameParseErrorException";
  message = "UnexpectedEqualsSignBeforeAttributeNameParseError";
}
class UnexpectedNullCharacterParseError implements Error {
  name = "UnexpectedNullCharacterParseErrorException";
  message = "UnexpectedNullCharacterParseError";
}
class UnexpectedQuestionMarkInsteadOfTagNameParseError implements Error {
  name = "UnexpectedQuestionMarkInsteadOfTagNameParseErrorException";
  message = "UnexpectedQuestionMarkInsteadOfTagNameParseError";
}
class UnexpectedSolidusInTagParseError implements Error {
  name = "UnexpectedSolidusInTagParseErrorException";
  message = "UnexpectedSolidusInTagParseError";
}
class UnknownNamedCharacterReferenceParseError implements Error {
  name = "UnknownNamedCharacterReferenceParseErrorException";
  message = "UnknownNamedCharacterReferenceParseError";
}

export {
  AbruptClosingOfEmptyComment,
  AbruptDoctypePublicIdentifierParseError,
  AbruptDoctypeSystemIdentifierParseError,
  AbsenceOfDigitsInNumericCharacterReferenceParseError,
  CdataInHtmlContentParseError,
  CharacterReferenceOutsideUnicodeRangeParseError,
  ControlCharacterInInputStreamParseError,
  ControlCharacterReferenceParseError,
  EndTagWithAttributesParseError,
  DuplicateAttributeParseError,
  EndTagWithTrailingSolidusParseError,
  EofBeforeTagNameParseError,
  EofInCdataParseError,
  EofInCommentParseError,
  EofInDoctypeParseError,
  EofInScriptHtmlCommentLikeTextParseError,
  EofInTagParseError,
  IncorrectlyClosedCommentParseError,
  IncorrectlyOpenedCommentParseError,
  InvalidCharacterSequenceAfterDoctypeNameParseError,
  InvalidFirstCharacterOfTagNameParseError,
  MissingAttributeValueParseError,
  MissingDoctypeNameParseError,
  MissingDoctypePublicIdentifierParseError,
  MissingDoctypeSystemIdentifierParseError,
  MissingEndTagNameParseError,
  MissingQuoteBeforeDoctypePublicIdentifierParseError,
  MissingQuoteBeforeDoctypeSystemIdentifierParseError,
  MissingSemicolonAfterCharacterReferenceParseError,
  MissingWhitespaceAfterDoctypePublicKeywordParseError,
  MissingWhitespaceAfterDoctypeSystemKeywordParseError,
  MissingWhitespaceBeforeDoctypeNameParseError,
  MissingWhitespaceBetweenAttributesParseError,
  MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiersParseError,
  NestedCommentParseError,
  NoncharacterCharacterReferenceParseError,
  NoncharacterInInputStreamParseError,
  NonVoidHtmlElementStartTagWithTrailingSolidusParseError,
  NullCharacterReferenceParseError,
  SurrogateCharacterReferenceParseError,
  SurrogateInInputStreamParseError,
  UnexpectedCharacterAfterDoctypeSystemIdentifierParseError,
  UnexpectedCharacterInAttributeNameParseError,
  UnexpectedCharacterInUnquotedAttributeValueParseError,
  UnexpectedEqualsSignBeforeAttributeNameParseError,
  UnexpectedNullCharacterParseError,
  UnexpectedQuestionMarkInsteadOfTagNameParseError,
  UnexpectedSolidusInTagParseError,
  UnknownNamedCharacterReferenceParseError,
};
