import React from 'react';
import { Icon } from '@components/icon';
import lefArrow from '@assets/images/arrow-left-blog.svg';
import { IArticleCardProps } from '.';

export const ArticleCard: React.FC<IArticleCardProps> = ({ activeArticle, returnActive }) => {
    return (
        <div className="flex h-full">
            <div className={`article-card ${activeArticle ? 'article-active' : 'article-inactive'}`}>
                {!activeArticle ? (
                    <div className="article-card__date">
                        <p className="text-white font-allerbold text-xtiny">dd/mm/aaaa</p>
                    </div>
                ) : (
                    <div className="mt-2 ml-2">
                        <img src={lefArrow} alt="left arrrow" onClick={returnActive} className="cursor-pointer" />
                    </div>
                )}
                {!activeArticle && (
                    <div className="mt-2.5">
                        <div className="mb-2 article-card__icon">
                            <Icon name="shareBlue" />
                        </div>
                        <div className="article-card__icon">
                            <Icon name="viewsBlue" />
                        </div>
                    </div>
                )}
            </div>
            {activeArticle && (
                <div className="mt-2.5 ml-4">
                    <div className="mb-2 article-card__icon shadow-blogArticle">
                        <Icon name="shareBlue" />
                    </div>
                    <div className="article-card__icon shadow-blogArticle">
                        <Icon name="viewsBlue" />
                    </div>
                </div>
            )}
        </div>
    );
};
