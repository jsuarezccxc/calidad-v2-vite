/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Section } from '@components/bread-crumb';
import { ACCEPTED_FILES, IMAGE_ERROR, SIZE_IMAGE_LIMIT } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthGreaterThanZero } from './Length';

/**
 * This interface defines file type
 *
 * @typeParam pdf: string - Define pdf type
 * @typeParam xlsx: string - Define xlsx type
 */
export interface IFileType {
    pdf: string;
    xlsx: string;
}

export const fileType: IFileType = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

/**
 * Function that allows validate extension file
 *
 * @param file: IGenericRecord - File's array data
 * @param name: string - File's name
 * @param fileExtensionAccept: string - File's extension accept
 * @returns boolean
 */
export const validateFile = (file: IGenericRecord, name: string, fileExtensionAccept = fileType.pdf): boolean => {
    const item = file?.filter((fileFilter: IGenericRecord) => fileFilter.name === name)[0];
    const format = file?.filter((fileFilter: IGenericRecord) => fileFilter.name === name)[0]?.files[0]?.name;
    if (fileExtensionAccept?.toLowerCase().includes(format?.substr(format.length - 3).toLowerCase())) {
        return false;
    } else {
        return lengthGreaterThanZero(item?.files);
    }
};

/**
 * Function that create a new image
 *
 * @param image: any - Image
 * @returns string
 */
export const createImage = (image: any): string => {
    return typeof image === STRING || !image ? image : URL.createObjectURL(image);
};

/**
 * Function that return the size image in mb
 *
 * @param size: number - Size image
 * @returns number
 */
export const getMbSize = (size: number): number => Number((size / (1024 * 1024)).toFixed(2));

/**
 * Function that validate the extension of the images
 *
 * @param fileExtensionAccept: string - Extension accepted for the image
 * @param imageName: string - Image name
 * @returns boolean
 */
export const isValidExtension = (fileExtensionAccept: string, imageName: string): boolean => {
    if (!imageName) return false;
    const [extension = '', extensions] = [imageName?.split('.').pop(), fileExtensionAccept?.split(',')];
    return extensions.some(item => item.includes(extension.toLowerCase()));
};

/**
 * Function that return the image error
 *
 * @param file: File - Current file
 * @returns string
 */
export const getImageError = (file: File): string => {
    if (getMbSize(file.size) > SIZE_IMAGE_LIMIT) return IMAGE_ERROR.SIZE;
    if (!isValidExtension(ACCEPTED_FILES, file.name)) return IMAGE_ERROR.EXTENSION;
    return '';
};

/**
 * Function that validate the size file
 *
 * @param file: IGenericRecord - File
 * @param name: string - Name of the file
 * @param sizeMaxMB: number - Maximum size for the file
 *
 * @returns boolean
 */
export const validateSizeFile = (file: IGenericRecord, name: string, sizeMaxMB: number): boolean => {
    const sizeFile = file?.filter((fileFilter: IGenericRecord) => fileFilter.name === name)[0]?.files[0]?.size;
    return sizeFile > sizeMaxMB;
};

/**
 * Function that return the image name
 *
 * @param name: string - Image name
 * @returns string
 */
export const getImageName = (name = ''): string => (!name ? '' : `${name.slice(0, 12)}.${name?.split('.').pop()}`);

/**
 * Function that return the BreadCrumb in string
 *
 * @param routes: Section - PATHS
 * @returns string
 */
export const getRouteFile = (routes: Section[]): string =>  {
    let name = "";
    routes.map((route) => (
        routes[routes.length - 1].name === route.name ? name += route.name: name+= route.name +" > "
    ));
    return name;
}

/**
 * Validates blob response and ensures correct MIME type
 * Basic validation - backend is responsible for file format integrity
 *
 * @typeParam blob: Blob - Blob response from server
 * @typeParam type: string - File type ('pdf' or 'xlsx')
 * @returns Blob - Blob with correct MIME type for download
 */
export const validateBlobResponse = (blob: Blob, type: string): Blob => {
    if (!blob || !(blob instanceof Blob) || blob.size === 0) {
        throw new Error('Invalid or empty file received from server');
    }

    if (blob.type === 'application/octet-stream' || !blob.type) {
        const mimeType = fileType[type as keyof typeof fileType] || fileType.pdf;
        return new Blob([blob], { type: mimeType });
    }

    return blob;
};

/**
 * String constant
 */
export const STRING = 'string';
