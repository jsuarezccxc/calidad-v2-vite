import React from 'react';
import styled, { CSSObject } from '@emotion/styled';
import defaultOne from '@assets/images/carousel/default-one.svg';
import defaultThree from '@assets/images/carousel/default-three.svg';
import defaultFive from '@assets/images/carousel/default-five.svg';
import defaultSix from '@assets/images/carousel/default-six.svg';
import defaultSeven from '@assets/images/carousel/default-seven.svg';
import defaultEight from '@assets/images/carousel/default-eight.svg';
import defaultNine from '@assets/images/carousel/default-nine.svg';
import defaultTen from '@assets/images/carousel/default-ten.svg';
import defaultEleven from '@assets/images/carousel/default-eleven.svg';
import defaultTwelve from '@assets/images/carousel/default-twelve.svg';
import defaultThirteen from '@assets/images/carousel/default-thirteen.svg';
import { Arrow } from './components';
import { IGenericRecord } from '@models/GenericRecord';
import { Color } from '@constants/Color';
import { ElementOption } from '@models/WebsiteNode';
import { createStyle, createTextStyle } from '@utils/WebsiteNode';

export * from './components';
export * from './Carousel';

/**
 * This interface describes the carousel settings
 *
 * @typeParam slides: number - Carousel slides
 * @typeParam type: ElementOption - Carousel type
 * @typeParam dotsColor: string - Optional dots color
 * @typeParam pointsUp: boolean - Optional points up
 * @typeParam pointsUp: boolean - This indicates if it is the mobile version
 */
interface ICarouselSettings {
    slides: number;
    option: ElementOption;
    dotsColor?: string;
    pointsUp?: boolean;
    isMobile: boolean;
}

/**
 * Carousel items
 */
export enum CAROUSEL_ITEMS {
    ONE = 1,
    THREE = 3,
    FOUR = 4,
    SIX = 6,
}

/**
 * Function that returns the class fot he active item
 *
 * @param carouselData: IGenericRecord - Data used to get the active class
 * @returns string
 */
export const getActiveClass = ({ activeImage, index, slides, type }: IGenericRecord): string => {
    if (type !== ElementOption.Nine) return '';

    const activeIndex = activeImage >= slides ? activeImage - slides : activeImage + 2;

    return activeIndex === index ? `carousel__image-${type}--active` : '';
};

/**
 * Function that returns the arrow props
 *
 * @param option: ElementOption - Carousel type
 * @returns IGenericRecord
 */
export const getArrowProps = (option: ElementOption): IGenericRecord => {
    const commonProps = { option, color: option === ElementOption.Eleven ? Color.Secondary : Color.Primary };
    return {
        nextArrow: <Arrow nextArrow {...commonProps} />,
        prevArrow: <Arrow {...commonProps} />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    nextArrow: <Arrow nextArrow {...commonProps} />,
                    prevArrow: <Arrow {...commonProps} />,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 2,
                    initialSlide: 2,
                    centerMode: false,
                    nextArrow: <Arrow nextArrow {...commonProps} />,
                    prevArrow: <Arrow {...commonProps} />,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                    nextArrow: <Arrow nextArrow {...commonProps} />,
                    prevArrow: <Arrow {...commonProps} />,
                },
            },
        ],
    };
};

/**
 * Function that returns the carousel settings
 *
 * @param settings: ICarouselSettings - Dynamic settings
 * @returns IGenericRecord
 */
export const getSettings = ({
    dotsColor = '#0B2C4C',
    slides,
    option,
    pointsUp = false,
    isMobile,
}: ICarouselSettings): IGenericRecord => ({
    appendDots: (dots: React.ReactNode): JSX.Element => <Dots color={dotsColor}>{dots}</Dots>,
    centerMode: isMobile ? false : CAROUSELS_WITH_CENTER_MODE.includes(option),
    className: `carousel carousel--${option} carousel--${isMobile ? 'mobile' : option}`,
    dots: !CAROUSELS_WITHOUT_BUTTONS.includes(option),
    dotsClass: `carousel__dots carousel__dots--${pointsUp ? 'up' : 'down'}`,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: isMobile ? 1 : slides,
    speed: 500,
    ...getArrowProps(option),
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: false,
            },
        },
    ],
});

/**
 * Function that returns the slides number
 *
 * @param items: IGenericRecord[] - Carousel items
 * @param type: ElementOption - Carousel type
 * @returns number
 */
export const getSlidesNumber = (items: IGenericRecord[] = [], option: ElementOption): number => {
    if (!items.length || items.length === CAROUSEL_ITEMS.ONE) return CAROUSEL_ITEMS.ONE;
    const carouselSlides = SLIDES_BY_TYPE[option];
    return (items.length > carouselSlides ? carouselSlides : items.length - 1) || 1;
};

/**
 * This is used to get the number of slides for each carousel
 */
export const SLIDES_BY_TYPE: { [key: string]: number } = {
    [ElementOption.One]: 4,
    [ElementOption.Two]: 4,
    [ElementOption.Three]: 1,
    [ElementOption.Four]: 1,
    [ElementOption.Five]: 3,
    [ElementOption.Six]: 1,
    [ElementOption.Seven]: 4,
    [ElementOption.Eight]: 1,
    [ElementOption.Nine]: 5,
    [ElementOption.Ten]: 5,
    [ElementOption.Eleven]: 4,
    [ElementOption.Twelve]: 1,
    [ElementOption.Thirteen]: 2,
};

/**
 * Path used for dynamic import of images
 */
export const IMAGE_PATH = 'assets/images/carousel';

/**
 * Default images used when an element does not have its own
 */
export const DEFAULT_IMAGES: { [key: string]: string } = {
    [ElementOption.One]: defaultOne,
    [ElementOption.Two]: defaultOne,
    [ElementOption.Three]: defaultThree,
    [ElementOption.Four]: defaultThree,
    [ElementOption.Five]: defaultFive,
    [ElementOption.Six]: defaultSix,
    [ElementOption.Seven]: defaultSeven,
    [ElementOption.Eight]: defaultEight,
    [ElementOption.Nine]: defaultNine,
    [ElementOption.Ten]: defaultTen,
    [ElementOption.Eleven]: defaultEleven,
    [ElementOption.Twelve]: defaultTwelve,
    [ElementOption.Thirteen]: defaultThirteen,
    [ElementOption.Fourteen]: defaultEleven,
};

/**
 * This is used to give background to the image data
 */
export const CAROUSELS_WITH_BACKGROUND = [ElementOption.Two, ElementOption.Four, ElementOption.Thirteen];

/**
 * This is used to give background to the image data
 */
export const CAROUSELS_WITHOUT_BUTTONS = [
    ElementOption.Eight,
    ElementOption.Nine,
    ElementOption.Ten,
    ElementOption.Eleven,
    ElementOption.Fourteen,
];

/**
 * This is used to give background to carousel arrows
 */
export const CAROUSELS_WITH_TRANSPARENT_ARROWS = [
    ElementOption.Three,
    ElementOption.Four,
    ElementOption.Twelve,
    ElementOption.Thirteen,
];

/**
 * This is used to center the carousel according to the type
 */
const CAROUSELS_WITH_CENTER_MODE = [ElementOption.Five, ElementOption.Seven];

/**
 * The goal of this is to give classes to the thumbnails based on the type of carousel
 */
export const THUMBNAIL_CLASSES: { [carouselType: string]: IGenericRecord } = {
    [ElementOption.Six]: {
        container: 'carousel__thumbnail-list carousel__thumbnail-list--long',
        item: 'carousel__thumbnail-item carousel__thumbnail-item--square',
    },
    [ElementOption.Eight]: {
        container: 'carousel__thumbnail-list carousel__thumbnail-list--small',
        item: 'carousel__thumbnail-item carousel__thumbnail-item--round',
    },
};

/**
 * Custom carousel dots, created with styled components to change the color dynamically
 */
export const Dots = styled.ul`
    .slick-active > button {
        background: ${(props: IGenericRecord): string => props.color};
    }
`;

/**
 * Carousel wrapper used to change styles dynamically
 */
export const Wrapper = styled.div<{ hasBackground: boolean; style: IGenericRecord }>`
    .carousel {
        &__image {
            &-data {
                background: ${({ style: { card } }: IGenericRecord): string => card?.background};
            }

            &-description {
                ${({ style: { description, title }, hasBackground }): CSSObject =>
                    createStyle(hasBackground ? title : description)}
            }
            &-title {
                ${({ style: { title } }): CSSObject => createStyle(title)}
            }
        }

        &__buttons {
            > button {
                ${({ style: { buttons } }): CSSObject => ({
                    ...(buttons ? createTextStyle(buttons) : {}),
                    textAlign: 'center',
                })}
            }
        }
    }
`;

/**
 * Default element setting
 */
export const DEFAULT_SETTING = {
    buttons: [],
    images: [],
    hideData: false,
};
