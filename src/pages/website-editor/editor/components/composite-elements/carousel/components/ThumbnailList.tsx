import React, { useMemo } from 'react';
import defaultThumbnail from '@assets/images/carousel/default-thumbnail.svg';
import square from '@assets/images/carousel/square-thumbnail.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';
import Img from '@pages/website-editor/editor/components/Img';
import { THUMBNAIL_CLASSES } from '..';
import { getThumbnails, IThumbnailListProps } from '.';

export const ThumbnailList: React.FC<IThumbnailListProps> = ({ activeImage, option, items = [], isMobile }) => {
    const images = useMemo(() => getThumbnails({ activeImage, items, option }), [activeImage, items, option]);

    const { container, item } = THUMBNAIL_CLASSES[option];

    const imagesToShow = useMemo(() => (isMobile && option === ElementOption.Eight ? images.slice(0, 3) : images), [
        images,
        option,
        isMobile,
    ]);

    return (
        <section className={container}>
            {imagesToShow.map((image: IGenericRecord, index: number) => (
                <Img
                    key={`item${index}`}
                    alt="Thumbnail item"
                    className={item}
                    src={image?.src ? image?.src : option === ElementOption.Six ? square : defaultThumbnail}
                />
            ))}
        </section>
    );
};
