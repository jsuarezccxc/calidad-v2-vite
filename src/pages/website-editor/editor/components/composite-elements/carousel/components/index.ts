import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';

export * from './Arrow';
export * from './Buttons';
export * from './ImageData';
export * from './ThumbnailList';

/**
 * This interface describes the thumbnail list props
 *
 * @typeParam activeImage: number - Active image index
 * @typeParam option: ElementOption - Carousel type
 * @typeParam items: IGenericRecord[] - Optional carousel items used to create the thumbnails
 * @typeParam isMobile: boolean - This indicates if the screen is in mobile size
 */
export interface IThumbnailListProps {
    activeImage: number;
    option: ElementOption;
    items?: IGenericRecord[];
    isMobile: boolean;
}

/**
 * This interface describes the arrow props
 *
 * @typeParam option: ElementOption - Carousel type
 * @typeParam color: string - Optional arrow color
 * @typeParam nextArrow: boolean - Optional prop that indicates whether it is a previous or next arrow
 * @typeParam onClick: () => void - Optional function to click the arrow
 */
export interface IArrowProps {
    option: ElementOption;
    color?: string;
    nextArrow?: boolean;
    onClick?: () => void;
}

/**
 * This interface describes the image data props
 *
 * @typeParam item: IGenericRecord - Carousel item
 * @typeParam option: ElementOption - Carousel type
 */
export interface IImageDataProps {
    item: IGenericRecord;
    option: ElementOption;
}

/**
 * This interface describes the props of the buttons
 *
 * @typeParam activateButton: (index: number) => void - Used to activate a button
 * @typeParam activeButton: number - Active button
 * @typeParam buttons: IGenericRecord[] - Button list
 */
export interface IButtonsProps {
    activateButton: (index: number) => void;
    activeButton: number;
    buttons: IGenericRecord[];
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
