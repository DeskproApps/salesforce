const SOSL_SPECIAL_CHARS = ['?', '&', '|', '!', '{', '}', '(', ')', '^', '~', '*', ':', '\\', '"', "'", '+', '-'];

export const escapeSOSLTerm = (term: string) => SOSL_SPECIAL_CHARS
    .reduce((escaped, char) => escaped.replace(char, '\\'+char), term)
;
