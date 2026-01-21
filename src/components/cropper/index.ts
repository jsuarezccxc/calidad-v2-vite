export * from './Cropper';

/**
 * Interface props from cropper component
 *
 * @typeParam url: string - Url img to render
 * @typeParam openModal: boolean - State to show modal cropper
 * @typeParam handleModal: () => void - Action to change state modal cropper
 * @typeParam getImageCropped: (image: File) => void - Action to get image cropped
 * @typeParam name: string - Optional name img to render
 * @typeParam cropWidth: number - Optional cropper width in number measurement (px)
 * @typeParam cropHeight: number - Optional cropper height in number measurement (px)
 * @typePram borderRadius: string - Optional border radius to crop area
 */
export interface ICropperProps {
    url: string;
    openModal: boolean;
    handleModal: () => void;
    getImageCropped: (image: File) => void;
    name?: string;
    cropWidth?: number;
    cropHeight?: number;
    borderRadius?: string;
}

/**
 * Default size visualization container cropper
 */
export enum DEFAULT_SIZE_CONTAINER {
    WIDTH = 575,
    HEIGHT = 400,
}

/**
 * Coincidence aws files
 */
export const AWS = 'amazonaws';
