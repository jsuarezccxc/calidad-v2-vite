export * from './HeaderEditor';

/**
 * This select type size
 */
export enum DimensionInput {
    HEIGHT = 'height',
    WIDTH = 'width',
}

/**
 * Logo size numeric constants
 */
export const LOGO_SIZES = {
    MAX_HEIGHT: 130,
    MAX_WIDTH: 304,
    DEFAULT_HEIGHT: 70,
};

/**
 * Debounce delay in milliseconds
 */
export const DEBOUNCE_DELAY = 500;

/**
 * Default dimensions for the header
 */
export const INITIAL_DIMENSIONS = { width: 0, height: 0 };

/**
 * Default maximun dimensions for the header
 */
export const INITIAL_MAX_DIMENSIONS = { width: LOGO_SIZES.MAX_WIDTH, height: LOGO_SIZES.MAX_HEIGHT };

/**
 * Represents the properties required to calculate dimensions.
 *
 * @typeParam name: string - The name associated with the dimensions.
 * @typeParam numericValue: number - A numeric value used in the calculation.
 * @typeParam aspectRatio: number - The aspect ratio to be considered for the dimensions.
 */
export interface ICalculateDimentionsProps {
    name: string;
    numericValue: number;
    aspectRatio: number;
}

/**
 * Represents the new dimensions of an element after resizing.
 *
 * @typeParam newWidth: number -  new width of the element.
 * @typeParam newHeight: number - new height of the element.
 */
export interface INewDimensions {
    newWidth: number;
    newHeight: number;
}
