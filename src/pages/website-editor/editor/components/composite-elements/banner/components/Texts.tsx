import React from 'react';
import { ITextsProps } from '.';

export const Texts: React.FC<ITextsProps> = ({ description, option, title, mobileClassName }) => (
    <>
        <h2 className={`title title--${option} title--${option}-${mobileClassName}`}>{title}</h2>
        {description && (
            <p className={`description description--${option} description--${option}-${mobileClassName}`}>{description}</p>
        )}
    </>
);
