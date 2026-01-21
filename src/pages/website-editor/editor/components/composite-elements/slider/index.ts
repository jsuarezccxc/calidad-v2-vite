import styled, { CSSObject } from '@emotion/styled';
import defaultOne from '@assets/images/carousel/default-one.svg';
import defaultThree from '@assets/images/carousel/default-three.svg';
import defaultFive from '@assets/images/carousel/default-five.svg';
import { ElementOption } from '@models/WebsiteNode';
import { createStyle } from '@utils/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';

export * from './components';
export * from './Slider';

export enum SlideAction {
    Forward = 'FORWARD',
    Backward = 'BACKWARD',
}

export interface ISetting {
    carouselWidth: number;
    carouselHeight: number;
    slideWidth: number;
    slideHeight: number;
    slides: number;
    padding: number;
}

/**
 * This interface describes the wrapper
 *
 * @typeParam hasBackground: boolean - Optional prop that indicates whether it is a previous or next arrow
 * @typeParam style: IGenericRecord - Indicates whether the element has a background color
 *
 */
export interface IWrapper {
    hasBackground: boolean;
    style: IGenericRecord;
}

/**
 * Carousel wrapper used to change styles dynamically
 */
export const Wrapper = styled.div<IWrapper>`
    .carousel {
        &__image {
            &-data {
                background: ${({ style: { card } }: IGenericRecord): string => card?.background};
            }

            &-description {
                ${({ style: { description, title }, hasBackground }): CSSObject => {
                    return createStyle(hasBackground ? title : description);
                }}
            }

            &-title {
                ${({ style: { title } }): CSSObject => createStyle(title)}
            }
        }

        &__slide-list {
            ${({ style: { listWidth } }): CSSObject => ({ width: listWidth })}
        }
    }
`;

/**
 * Slide wrapper to move the items on the x axis
 */
export const SlideWrapper = styled.li<{ x: number }>`
    ${({ x }): CSSObject => ({ transform: `translateX(${x}px)` })}
`;

/**
 * Default images used when an element does not have its own
 */
export const DEFAULT_IMAGES: { [key: string]: string } = {
    [ElementOption.One]: defaultOne,
    [ElementOption.Two]: defaultOne,
    [ElementOption.Three]: defaultThree,
    [ElementOption.Four]: defaultThree,
    [ElementOption.Five]: defaultFive,
};

/**
 * This is used to sleep the component
 *
 * @param time: number - Promise time
 * @returns Promise<unknown>
 */
export const sleepSlider = (time = 0): Promise<unknown> => new Promise(resolve => setTimeout(resolve, time));

/**
 * It's used to compare the number of elements
 */
export const ONE = 1;

/**
 * It's used to validate the current screen
 */
export const MOBILE = 'mobile';

/**
 * It's used to validate the current screen
 */
export const DESKTOP = 'desktop';

/**
 * This returns the carousel style validating the position
 *
 * @param isPreview: boolean - This indicates whether the view is preview
 * @param style: IGenericRecord - Carousel style
 * @returns IGenericRecord
 */
export const getCarouselStyle = (isPreview: boolean, style: IGenericRecord): IGenericRecord => {
    if (isPreview) {
        const newStyle = { ...style };
        delete newStyle.position;
        return newStyle;
    }
    return style;
};

/**
 * This returns the preview style
 *
 * @param coordinates: IGenericRecord - Carousel coordinates
 * @param isPreview: boolean - This indicates whether the view is preview
 * @returns IGenericRecord
 */
export const getPreviewStyle = ({ left, top, position }: IGenericRecord, isPreview: boolean): IGenericRecord => {
    const previewStyle = { left, top, position };
    return isPreview ? previewStyle : {};
};

/**
 * Width in pixels of the arrows
 */
export const ARROW_WIDTH = 48;
