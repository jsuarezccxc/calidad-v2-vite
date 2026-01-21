import React from 'react';
import { formatMoney } from '@utils/Decimals';
import { getWordLimit } from '@utils/Text';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';
import Img from '@pages/website-editor/editor/components/Img';
import { DEFAULT_IMAGES, SlideWrapper, ISlideProps, ONE, MAX_LENGTH_DESCRIPTION } from '..';

export const Slide: React.FC<ISlideProps> = ({ position, item, setting, option, mobileClass, handleImage = (): void => {} }) => {
    const { slideWidth, slideHeight, slides, padding = 0 } = setting;

    const getStyle = (position: number, slides: number): IGenericRecord => ({
        width: Number(slides === ONE ? slideWidth : slideWidth),
        maxWidth: slideWidth,
        height: slideHeight,
        minWidth: slideWidth,
        x: slides === ONE ? slideWidth * (position + ONE) : position * (slideWidth + padding),
    });

    const style = getStyle(position, slides);
    const title = item?.showProductData ? item?.productName : item?.title ?? '';
    const rawDescription = item?.showProductData ? item?.productValue : item?.description ?? '';

    const getFormattedDescription = (): string => {
        if (item?.showProductData) return formatMoney(Number(rawDescription));
        if (option === ElementOption.Four) return rawDescription;
        return getWordLimit(rawDescription, MAX_LENGTH_DESCRIPTION);
    };

    return (
        <SlideWrapper className="absolute transition-all duration-300" style={style} x={style.x}>
            <div
                className="relative flex w-full h-full overflow-hidden"
                onClick={(): void => handleImage(item?.page?.id, item?.categories)}
            >
                <Img
                    src={item?.src || DEFAULT_IMAGES[option]}
                    alt={item?.title}
                    className={`carousel__image carousel__image--${option} carousel__image--${option}-${mobileClass}`}
                />
            </div>
            <div
                className={`carousel__image-data carousel__image-data--${option} carousel__image-data--${option}-${mobileClass}`}
            >
                <h4 className="text-xl font-allerbold carousel__image-title">{title}</h4>
                <p className="text-green carousel__image-description">{getFormattedDescription()}</p>
            </div>
        </SlideWrapper>
    );
};
