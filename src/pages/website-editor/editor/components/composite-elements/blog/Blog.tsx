import React from 'react';
import { lengthGreaterThanZero } from '@utils/Length';
import { IGenericRecord } from '@models/GenericRecord';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { SimpleButton } from '@components/button';
import { Icon } from '@components/icon';
import { BlogWrapper } from '.';
import './Blog.scss';

export const Blog: React.FC<IElementProps> = ({ data, isMobile = false }) => {
    const { setting } = data;

    const mobile: boolean = isMobile;

    return (
        <BlogWrapper className={`blog flex-wrap ${mobile ? 'flex flex-col' : ''}`} style={data.style}>
            {lengthGreaterThanZero(setting?.numberOfArticles) ? (
                setting?.numberOfArticles?.map((article: IGenericRecord, index: number) => (
                    <div className={`blog__container ${mobile ? 'blog__container-mobile' : ''}`} key={data.option + index}>
                        <div
                            className={`blog__image ${mobile ? 'blog__image-mobile' : ''}`}
                            style={{ backgroundImage: `url(${article?.image})` }}
                        >
                            <div className="blog__image-date">{article?.date}</div>
                            <div className="absolute top-2.5 right-2">
                                <div className="mb-2 bg-white rounded w-7 h-7">
                                    <Icon name="shareBlue" />
                                </div>
                                <Icon name="viewsBlue" className="h-7 w-7" />
                            </div>
                        </div>
                        <div className="blog__content">
                            <h3 className="text-left blog__content-title">{article?.name ?? 'Título principal artículo'} </h3>
                            <p className="mb-1 text-left blog__content-author">{article?.author ?? 'Nombre de autor'} </p>
                            <p className="text-left blog__content-author">
                                {article?.synthesis ??
                                    'Sed ut perspiciatis unde omnis iste natus error sit volup accusantium doloremque laudantium.'}
                            </p>
                            {article.reference && <p className="text-sm italic text-gray-dark mt-4.5">{article.reference}</p>}
                            <SimpleButton className="w-32 mt-4 text-white rounded-md blog__action-button bg-blue h-7 text-mtiny">
                                {setting.actionButton || 'Leer'}
                            </SimpleButton>
                        </div>
                    </div>
                ))
            ) : (
                <div className="blog__container" key={data.option}>
                    <div className="blog__image">
                        <div className="blog__image-date">dd/mm/aaaa</div>
                        <div className="absolute top-2.5 right-2">
                            <div className="mb-2 bg-white rounded w-7 h-7">
                                <Icon name="shareBlue" />
                            </div>
                            <Icon name="viewsBlue" className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="blog__content">
                        <h3 className="text-left blog__content-title">Título principal artículo</h3>
                        <p className="mb-1 text-left blog__content-author">Nombre de autor</p>
                        <p className="text-left blog__content-author">
                            Sed ut perspiciatis unde omnis iste natus error sit volup accusantium doloremque laudantium.
                        </p>
                        <SimpleButton className="w-32 mt-4 text-white rounded-md bg-blue h-7 text-mtiny">Leer</SimpleButton>
                    </div>
                </div>
            )}
        </BlogWrapper>
    );
};
