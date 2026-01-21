import React from 'react';
import { IArrowProps } from '..';
import { ElementOption } from '@models/WebsiteNode';
import { Color } from '@constants/Color';

export const Arrow: React.FC<IArrowProps> = ({ onClick, nextArrow = false, top, option, mobileClass }) => (
    <div
        onClick={onClick}
        className={`carousel__arrow carousel__arrow--${nextArrow ? 'right' : 'left'}-${option} carousel__arrow--${
            nextArrow ? 'right' : 'left'
        }-${option}-${mobileClass}`}
        style={{ top }}
    >
        <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
            <path
                d={nextArrow ? 'M2 26L14 14L2 2' : 'M14 2L2 14L14 26'}
                stroke={option === ElementOption.Two ? Color.Secondary : Color.Primary}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);
