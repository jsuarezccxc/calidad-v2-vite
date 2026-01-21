import React from 'react';
import { Color } from '@constants/Color';
import { CAROUSELS_WITH_TRANSPARENT_ARROWS } from '..';
import { IArrowProps } from '.';

export const Arrow: React.FC<IArrowProps> = ({ option, color, onClick, nextArrow = false }) => (
    <div
        onClick={onClick}
        className={`carousel__arrow carousel__arrow--${nextArrow ? 'right' : 'left'} arrow--${nextArrow ? 'right' : 'left'}`}
        style={{
            background: CAROUSELS_WITH_TRANSPARENT_ARROWS.includes(option) ? Color.Transparent : Color.White,
        }}
    >
        <svg
            width="16"
            height="28"
            viewBox="0 0 16 28"
            fill="none"
            className={`carousel__arrow-icon ${nextArrow ? 'ml-1' : 'mr-1'}`}
        >
            <path
                d={nextArrow ? 'M2 26L14 14L2 2' : 'M14 2L2 14L14 26'}
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);
