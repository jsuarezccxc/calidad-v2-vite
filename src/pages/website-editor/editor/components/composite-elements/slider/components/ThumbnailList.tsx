import React, { useMemo } from 'react';
import defaultThumbnail from '@assets/images/carousel/default-thumbnail.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { IThumbnailListProps, getThumbnails } from '.';

export const ThumbnailList: React.FC<IThumbnailListProps> = ({ activeSlide, items, mobileClass, option }) => {
    const images = useMemo(() => getThumbnails({ activeImage: activeSlide, items, option }), [activeSlide, items, option]);

    return (
        <div className={`carousel__thumbnail-list--${option} carousel__thumbnail-list--${option}-${mobileClass}`}>
            {images.map((image: IGenericRecord, index: number) => (
                <img key={`item${index}`} alt="Thumbnail item" src={image?.src || defaultThumbnail} />
            ))}
        </div>
    );
};
