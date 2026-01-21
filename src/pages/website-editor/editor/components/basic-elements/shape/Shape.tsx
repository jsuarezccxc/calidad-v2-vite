import React from 'react';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { WITH_FILLING } from '../../element-editor';
import './Shape.scss';

export const Shape: React.FC<IElementProps> = ({ data }) => {
    return (
        <span
            style={{ ...data.style, fontSize: data.style.width }}
            className={`material-symbols-outlined ${data.style.filling === WITH_FILLING ? 'with-filling' : 'unfilled'}`}
        >
            {data.value}
        </span>
    );
};
