import React, { useMemo } from 'react';

// Vite dynamic imports for template images
const templateImages = import.meta.glob<{ default: string }>('/src/assets/images/template/*.svg', { eager: true });
const getTemplateImage = (option: string): string => {
    const path = `/src/assets/images/template/element-${option}.svg`;
    return templateImages[path]?.default || '';
};
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import addIcon from '@assets/images/template/add.svg';
import eyeIcon from '@assets/images/template/eye.svg';
import { Icon } from '@components/icon';
import { TEMPLATE } from '@constants/WebsiteNode';
import { ElementOption } from '@models/WebsiteNode';
import { CAROUSEL_SETTINGS, getImageOptions, IImageCarouselProps } from '.';

export const ImageCarousel: React.FC<IImageCarouselProps> = React.memo(({ selectTemplate, templateType }) => {
    const imageOptions = useMemo(() => getImageOptions(templateType), [templateType]);

    const viewTemplate = (option: ElementOption): void => localStorage.setItem(TEMPLATE, option);

    return (
        <Slider
            {...CAROUSEL_SETTINGS}
            className="sidebar__template-carousel"
            nextArrow={<Icon name="arrowRightGreen" classIcon="w-5 h-5 cursor-pointer" />}
            prevArrow={<Icon name="arrowLeftGreen" classIcon="w-5 h-5 cursor-pointer" />}
        >
            {imageOptions.map(option => (
                <div className="sidebar__template-option" key={option}>
                    <img
                        alt="template"
                        src={getTemplateImage(option)}
                        className="img--template m-auto cursor-pointer"
                    />
                    <div className="sidebar__image-shadow">
                        <img
                            alt="Add template"
                            className="w-3.5 h-3.5"
                            onClick={(): void => {
                                selectTemplate(option);
                            }}
                            src={addIcon}
                        />
                        <Link target="_blank" to="?page=preview">
                            <img
                                alt="View template"
                                className="w-3.5 h-3.5"
                                onClick={(): void => viewTemplate(option)}
                                src={eyeIcon}
                            />
                        </Link>
                    </div>
                </div>
            ))}
        </Slider>
    );
});
