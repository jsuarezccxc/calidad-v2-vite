import React from 'react';
import { ICON_PROPS, IIconProps } from '.';

// Vite dynamic imports for icon images
const iconModules = import.meta.glob<{ default: string }>('/src/assets/images/*.svg', { eager: true });

const getIconSrc = (iconName: string): string => {
    const path = `/src/assets/images/${iconName}.svg`;
    return iconModules[path]?.default || '';
};

export const Icon: React.FC<IIconProps> = ({ id, name, onClick, className = '' }) => {
    const { icon, tooltip } = ICON_PROPS[name];

    return (
        <div id={id} aria-label={tooltip} className={`basic-editor__icon ${className}`} onClick={onClick}>
            <img alt="text size blue" src={getIconSrc(icon)} />
        </div>
    );
};
