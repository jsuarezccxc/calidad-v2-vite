import styled, { CSSObject } from '@emotion/styled';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';
import { ISetting } from '..';
import { createTextStyle } from '@utils/WebsiteNode';

export * from './Arrow';
export * from './Buttons';
export * from './Dots';
export * from './Slide';
export * from './ThumbnailList';

/**
 * This interface describes the arrow props
 *
 * @typeParam nextArrow: boolean - Optional prop that indicates whether it is a previous or next arrow
 * @typeParam onClick: () => void - Optional function to click the arrow
 * @typeParam top: number - Arrow top
 * @typeParam option: ElementOption - Element option
 * @typeParam mobileClass: string - Mobile class
 *
 */
export interface IArrowProps {
    nextArrow?: boolean;
    onClick: () => void;
    top: number;
    option: ElementOption;
    mobileClass: string;
}

/**
 * This interface describes the props of the buttons
 *
 * @typeParam activateButton: (index: number) => void - Used to activate a button
 * @typeParam activeButton: number - Active button
 * @typeParam buttons: IGenericRecord[] - Button list
 * @typeParam style: IGenericRecord - Button style
 */
export interface IButtonsProps {
    activateButton: (index: number) => void;
    activeButton: number;
    buttons: IGenericRecord[];
    style: IGenericRecord;
}

/**
 * This interface describes the dots props
 *
 * @typeParam activeSlide: number - Active slide
 * @typeParam items: number[] - Slider items
 * @typeParam selectSlide: (index: number) => void - Function to select a slide
 * @typeParam option: ElementOption - Element option
 * @typeParam mobileClass: string - Mobile class
 */
export interface IDotsProps {
    activeSlide: number;
    items: number[];
    selectSlide: (index: number) => void;
    option: ElementOption;
    mobileClass: string;
}

/**
 * This interface describes the slide props
 *
 * @typeParam position: number - Active slide
 * @typeParam item: IGenericRecord - Slide data
 * @typeParam setting: ISetting - Slider setting
 * @typeParam option: ElementOption - Element option
 * @typeParam mobileClass: string - Mobile class
 * @typeParam handleImage:  () => void - Function selected image
 */
export interface ISlideProps {
    position: number;
    item: IGenericRecord;
    setting: ISetting;
    option: ElementOption;
    mobileClass: string;
    handleImage?: (idPage: string, categories: string[]) => void;
}

/**
 * This interface describes the thumbnail list props
 *
 * @typeParam activeSlide: number - Active slide index
 * @typeParam items: IGenericRecord[] - Optional carousel items used to create the thumbnails
 * @typeParam option: ElementOption - Carousel type
 * @typeParam mobileClass: string - Mobile class
 */
export interface IThumbnailListProps {
    activeSlide: number;
    items: IGenericRecord[];
    option: ElementOption;
    mobileClass: string;
}

/**
 * Number of thumbnails per carousel
 */
export enum Thumbnails {
    CarouselSix = 6,
    CarouselEight = 4,
}

/**
 * This returns the thumbnails
 *
 * @param type: ElementOption - Carousel type
 * @returns IGenericRecord[]
 */
export const getThumbnails = ({ activeImage, option, items }: IGenericRecord): IGenericRecord[] => {
    const slides = option === ElementOption.Six ? Thumbnails.CarouselSix : Thumbnails.CarouselEight;
    const list = items.slice(activeImage, activeImage + slides);
    return list.length < slides
        ? [...list, ...items.slice(0, (items.length < slides ? items.length : slides) - list.length)]
        : list;
};

/**
 * Slide wrapper to move the items on the x axis
 */
export const ButtonsWrapper = styled.div<{ buttonStyle: IGenericRecord }>`
    > button {
        ${({ buttonStyle }): CSSObject => ({
            ...(buttonStyle ? createTextStyle(buttonStyle) : {}),
            textAlign: 'center',
        })}
    }
`;

/**
 * Constant max length description slide
 */
export const MAX_LENGTH_DESCRIPTION = 23;
