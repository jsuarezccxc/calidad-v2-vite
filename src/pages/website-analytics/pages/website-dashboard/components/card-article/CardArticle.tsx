import React from 'react';
import { ICardArticle } from '.';
import './CardArticle.scss';

const CardArticle: React.FC<ICardArticle> = ({ title, classTitle = '', classCard = '', children, id }) => {
    return (
        <article id={id} className={`card ${classCard}`}>
            {title && <p className={`text-sm leading-4 font-allerbold text-blue  ${classTitle}`}>{title}</p>}
            {children}
        </article>
    );
};

export default CardArticle;
