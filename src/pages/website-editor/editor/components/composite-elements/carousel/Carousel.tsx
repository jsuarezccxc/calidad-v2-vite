import React, { Fragment, useMemo, useState } from 'react';
import Slider from 'react-slick';
import { Buttons, ImageData, ThumbnailList } from './components';
import { ElementOption } from '@models/WebsiteNode';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import Img from '@pages/website-editor/editor/components/Img';
import {
    getActiveClass,
    getSettings,
    Wrapper,
    getSlidesNumber,
    DEFAULT_IMAGES,
    CAROUSELS_WITH_BACKGROUND,
    DEFAULT_SETTING,
} from '.';

export const Carousel: React.FC<IElementProps> = React.memo(({ data, isMobile = false }) => {
    const { style, option } = data;

    const { buttons = [], images = [], hideData: hideImageData } = data?.setting ?? DEFAULT_SETTING;

    const [activeButton, setActiveButton] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<number>(0);

    const items = useMemo(() => (buttons.length ? buttons[activeButton]?.contents : images), [images, buttons, activeButton]);

    const slides = useMemo(() => getSlidesNumber(items, option), [option, items]);

    const thumbnailProps = { activeImage, items, option, isMobile };

    const hasBackground = CAROUSELS_WITH_BACKGROUND.includes(option);

    return (
        <Wrapper
            className={`${items.length ? '' : 'border'} carousel-wrapper--${isMobile ? 'mobile' : ''}`}
            hasBackground={hasBackground}
            style={style}
        >
            {option === ElementOption.Six && <ThumbnailList {...thumbnailProps} />}
            {option === ElementOption.Fourteen && (
                <Buttons activeButton={activeButton} activateButton={(index): void => setActiveButton(index)} buttons={buttons} />
            )}
            <Slider
                afterChange={(index): void => setActiveImage(index)}
                {...getSettings({ slides, option, pointsUp: data?.setting?.pointsUp, isMobile })}
            >
                {items?.map(({ id = '', src = '', ...item }, index: number) => (
                    <Fragment key={id ?? index}>
                        <div
                            className={`carousel__image-wrapper carousel__image-wrapper-${option} carousel__image-wrapper-${
                                isMobile ? 'mobile' : ''
                            }`}
                        >
                            <Img
                                alt="carousel item"
                                className={`carousel__image-${option} carousel__image ${getActiveClass({
                                    activeImage,
                                    index,
                                    slides,
                                    option,
                                })}`}
                                src={src || DEFAULT_IMAGES[option]}
                            />
                        </div>
                        {!hideImageData && <ImageData item={item} option={option} />}
                    </Fragment>
                ))}
            </Slider>
            {option === ElementOption.Eight && <ThumbnailList {...thumbnailProps} />}
        </Wrapper>
    );
});
