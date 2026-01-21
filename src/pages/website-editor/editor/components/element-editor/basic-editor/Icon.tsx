import React from 'react';

// Vite dynamic imports for general images
const generalImages = import.meta.glob<{ default: string }>('/src/assets/images/*.svg', { eager: true });
const getGeneralImage = (name: string): string => {
    const path = `/src/assets/images/${name}.svg`;
    return generalImages[path]?.default || '';
};
import { ICON_PROPS, IIconProps } from '.';

export const Icon: React.FC<IIconProps> = ({ id, name, onClick, className = '' }) => {
    const { icon, tooltip } = ICON_PROPS[name];

    return (
        <div id={id} aria-label={tooltip} className={`basic-editor__icon ${className}`} onClick={onClick}>
            <img alt="text size blue" src={getGeneralImage(icon)} />
        </div>
    );
};
