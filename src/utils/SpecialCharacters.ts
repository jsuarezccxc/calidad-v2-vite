import { removeAccents } from './Text';

export const removeSpecialCharacters = (text = ''): string => {
    return text ? removeAccents(text?.replace(/[^a-zA-ZÀ-ÿ ]/g, '')) : '';
};

export const lettersNumerics = (data: string): string => {
    return data?.replace(/[^a-zA-ZÀ-ÿ 0-9]/g, '');
};

export const numericsInput = (data: string): string => {
    return String(data).replace(/[^0-9]/g, '');
};

export const removeAlphanumeric = (text = ''): string => (text ? removeAccents(text).replace(/[^\w\s]/gi, '') : '');

export const letters = (data: string): string => {
    return data?.replace(/[^a-zA-ZÀ-ÿ]/g, '');
};
