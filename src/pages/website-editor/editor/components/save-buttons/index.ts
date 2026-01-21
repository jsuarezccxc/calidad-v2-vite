import { ElementType } from '@models/WebsiteNode';
import { IDraggableElement, MANDATORY_ELEMENTS } from '../drag-and-drop';

export * from './SaveButtons';

/**
 * Interface props for message button component
 *
 * @typeParam statusSave: string - status type when the user save
 * @typeParam isDraft: boolean - website selected is draft
 * @typeParam publish: Date - date of publish website
 * @typePram messagePublish: string - message publish website
 */
export interface IMessageButtonProps {
    statusSave: TypeStatusSave;
    isDraft: boolean;
    publish: Date;
    messagePublish: string;
}

/**
 * This describes the type of elements there are
 *
 * @typeParam commonElements: IDraggableElement[] - These are the fixed elements that all pages have
 * @typeParam individualElements: IDraggableElement[] - These are the unique elements of each page
 */
export interface IElements {
    commonElements: IDraggableElement[];
    individualElements: IDraggableElement[];
}

/**
 * Type status save website
 */
export type TypeStatusSave = 'save' | 'minute' | 'error' | '';

/**
 * This hour data object
 */
export const autoSaveTimes = {
    thousandMilSeconds: 1000,
    sixtySeconds: 60,
    oneMinutesMil: 60000,
    twoMinutesMil: 120000,
    valueDay: 24,
    valueMonth: 30,
    differenceOneDay: 1,
};

/**
 * This key select message options save
 */
export const MESSAGE_SAVE_KEY: { [key: string]: string } = {
    save: 'Cambios guardados',
    minute: 'Guardado hace 1 min',
    error: 'No se han guardado los últimos cambios',
    '': '',
};

/**
 * This constant image type
 */
export const IMAGE_TYPE = 'image/png';

/**
 * This saved messages object
 */
export const propMessage = {
    save: 'save',
    minute: 'minute',
    error: 'error',
};

/**
 * This action buttons
 */
export const actionButtons = ['Guardar', 'Publicar'];

/**
 * This constant max character
 */
export const MAX_CHARACTER = 512;

/**
 * Function to convert image to type Blob
 *
 * @param dataUrl: string - File image
 * @returns Blob
 */
export const dataURLtoBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const byteCharacters = atob(parts[1]);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += MAX_CHARACTER) {
        const slice = byteCharacters.slice(offset, offset + MAX_CHARACTER);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};

/**
 * This indicates whether the current element is one in common
 *
 * @param type: string - Element type
 * @returns boolean
 */
export const isCommonElement = (type: string): boolean => MANDATORY_ELEMENTS.includes(type as ElementType);

/**
 * This is responsible for separating the elements according to their type
 *
 * @param elements: IDraggableElement[] - Page elements
 * @returns IElements
 */
export const separateElements = (elements: IDraggableElement[]): IElements => {
    const data: IElements = { individualElements: [], commonElements: [] };
    elements.forEach(element => data[isCommonElement(element.type) ? 'commonElements' : 'individualElements'].push(element));
    return data;
};
