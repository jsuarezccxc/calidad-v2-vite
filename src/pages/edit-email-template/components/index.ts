export * from './modal-preview/ModalPreview';

export const CONTENT = 'content';

/**
 * Possible titles for the image
 */
export enum ImageTitle {
    Image = 'imagen',
    ImagePreview = 'Previsualización imagen',
}

/**
 * Index to access the image url
 */
export const IMAGE_INDEX = 0;

/**
 * Function that return string without html tags
 *
 * @returns string
 */
export const escapeHtml = (text: string): string => {
    return text.replace(/<[^>]+>/g, '');
};
