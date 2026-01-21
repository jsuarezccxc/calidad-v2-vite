import React from 'react';
import { ElementOption } from '@models/WebsiteNode';
import { IImageDataProps } from '..';

export const ImageData: React.FC<IImageDataProps> = ({ option, item }) => {
    const title = item?.showProductData ? item?.productName : item?.title ?? '';
    const description = item?.showProductData ? item?.productValue : item?.description;

    return (
        <p className={`carousel__image-data carousel__image-data--${option}`}>
            <span
                className={`carousel__image-title block text-center w-max m-auto ${
                    option === ElementOption.Thirteen ? '' : 'mb-2'
                } `}
            >
                {title}
            </span>
            {option !== ElementOption.Thirteen && (
                <span className="carousel__image-description" title={description}>
                    {description}
                </span>
            )}
        </p>
    );
};
