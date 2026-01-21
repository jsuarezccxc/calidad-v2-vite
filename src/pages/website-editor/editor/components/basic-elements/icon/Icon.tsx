import React from 'react';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';

export const Icon: React.FC<IElementProps> = ({ data }) => {
    return (
        <span
            style={{ ...data.style, fontSize: data.style.height, display: 'flex', justifyContent: 'center' }}
            className="transition-all transform rotate-0 material-symbols-outlined"
        >
            {data.value}
        </span>
    );
};
