export const removeSpace = (text: string, word: string): string => {
    return text.split(word).join(' ') + `\n${word}`;
};

export const lowerCase = (word = ''): string => word?.toLowerCase();

export const upperCase = (word: string): string => word?.toUpperCase();

export const removeAccents = (word: string): string => {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const getIconName = (name: string): string => {
    let result = '';
    for (let i = 0; i < name.length; i++) {
        const letter = name[i];
        result += letter === upperCase(letter) ? `-${lowerCase(letter)}` : letter;
    }
    return result;
};

export const toCamelCase = (key: string): string => {
    const array = key.split('_');
    let result = '';
    array.forEach((letter, index) => (result += !index ? letter : upperCase(letter[0]) + letter.slice(1)));
    return result;
};

export const removeTags = (data: string): string => data?.replace(/(<([^>]+)>)/gi, '');

export const hasSpecialCharacters = (text: string): boolean => !/^[a-zA-Z0-9]+$/.test(text);

export const removeSpecialCharacters = (text: string): string => (text ? text?.replace(/[^\w\s]/gi, '') : '');

export const firstLetterToUpperCase = (text: string): string => {
    return text ? `${text[0].toUpperCase()}${text.slice(1)}` : '';
};

/**
 * This const is the number maximum the characters in string
 */
const MAXIMUM_TEXT_CHARACTERS = 18;

/**
 * This const is the number maximum the characters in string input
 */
const MAXIMUM_TEXT_CHARACTERS_INPUT = 17;

/**
 * Function that cuts a string at 18 characters and replaces the rest with ".."
 *
 * @param str: string - String to be cut
 * @returns string
 */
export const cutString = (str: string, maxCharacters = MAXIMUM_TEXT_CHARACTERS): string => {
    return str?.length <= maxCharacters ? str : str?.substring(0, maxCharacters) + '...';
};

/**
 * Converts pixel size to rem and accepts the base as second argument. default base is 16px
 *
 * @param  px : number - Number px to parse
 * @param  base : number - Base to convert default rem
 * @return number
 */
export const pixelsToRem = (px: number, base = 16): number => {
    return (1 / base) * px;
};

/**
 * Function that cuts a string at 18 characters and replaces the rest with ".."
 *
 * @param word: string - String to limit
 * @param length: string - String to length text
 * @returns string
 */
export const getWordLimit = (word: string, length = MAXIMUM_TEXT_CHARACTERS_INPUT): string => {
    if (!word?.length) return '';
    return word.length > length ? `${word.slice(0, length)}...` : word;
};

/**
 * Function that formats a given text so that no word is longer than the specified limit.
 * If a word exceeds the limit, it truncates the word and appends '- ' to it.
 *
 * @param text - The input text to be formatted.
 * @param limit - The maximum number of characters a word can have before it gets truncated.
 * @return string
 */
export const shortWordFormatter = (text: string, limit: number): string => {
    const words = text.split(' ');
    const processedWords = words.map(word => {
        if (word.length > limit) {
            return word.substring(0, 9) + '- ';
        }
        return word;
    });
    return processedWords.join(' ');
};

/**
 * This removes the accents and keeps the ñ
 *
 * @param value: string - Value to format
 * @returns string
 */
export const removeSpanishAccents = (value: string): string => {
    return value
        .normalize('NFD')
        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
        .normalize();
};

/**
 * This formats the search value
 *
 * @param value: string - Search value
 * @returns string
 */
export const formatSearchValue = (value: string): string => removeSpanishAccents(lowerCase(value));

/**
 * This pluralize the first word on phrase
 *
 * @param phrase: string - phrase
 * @returns string
 */
export const pluralizeFirstWord = (phrase: string): string => {
    if (!phrase) return phrase;
    const words = phrase.split(' ');

    if (words.length === 0) return phrase;
    words[0] = words[0] + 's';

    return words.join(' ');
};

/**
 * This function removes special characters and numbers
 *
 * @param text: string - text
 * @returns string
 */
export const removeSpecialCharactersNumbers = (text: string): string => (text ? text?.replace(/[^a-zA-Z\s]/g, '') : '');

/**
 * This removes all characters from a text
 *
 * @param value: string - Text value
 * @param character: string - Character to delete
 * @returns string
 */
export const removeCharacters = (value: string, character = '+'): string => value?.replaceAll(character, ' ');

/**
 * This removes non text characters
 *
 * @param value: string - Text value
 * @returns string
 */
export const returnOnlyText = (value: string): string => value.replace(/[^a-zA-Z\s]/g, '');

/**
 * This function determines the appropriate CSS word-wrap class based on the input text
 *
 * @param word - string - Text to evaluate
 * @returns string
 */
export const getWordWrap = (word = ''): string => (word.split(' ').length > 1 ? 'break-normal' : 'break-all');
