/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent } from '@components/input';

export * from './FileInput';

/**
 * This describes the file structure
 *
 * @typeParam name: string - File name
 * @typeParam src: string - File src
 * @typeParam error: string - Optional error when uploading file
 */
export interface IFile {
    name: string;
    src: string;
    error?: string;
}

/**
 * This describes the props of the file input
 *
 * @typeParam deleteFile: () => void - Action to delete file
 * @typeParam file: any - File
 * @typeParam handleChange: (e: ChangeEvent) => void - This is used to handle file change
 * @typeParam wrapperClassName: string - Optional className to customize the wrapper
 * @typeParam typeFile: string - Optional class for type file accepted
 * @typeParam textPlaceholder: string - Optional prop for placeholder into input
 * @typeParam inputClassName: string - Optional prop for input styles
 */
export interface IFileInputProps {
    deleteFile: () => void;
    file: any;
    handleChange: (e: ChangeEvent) => void;
    wrapperClassName?: string;
    label?: string;
    typeFile?: string;
    textPlaceholder?: string;
    inputClassName?: string;
}

/**
 * This constant is used to set the maximum length of the text input
 */
const MAX_LENGTH_TEXT = 28;

/**
 * Function that cut Text greater than 33 characters
 *
 * @param text:string - Text to cut
 * @returns
 */
export const cutName = (text: string): string => {
    if (text.length > MAX_LENGTH_TEXT) {
        return text.substring(0, MAX_LENGTH_TEXT) + ' ...';
    }
    return text;
};
