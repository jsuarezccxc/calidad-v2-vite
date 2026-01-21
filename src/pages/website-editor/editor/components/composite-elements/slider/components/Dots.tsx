import React from 'react';
import { IDotsProps } from '..';

export const Dots: React.FC<IDotsProps> = ({ activeSlide, items, option, selectSlide, mobileClass }) => (
    <div
        className={`carousel__dots carousel__dots--${option} carousel__dots--${option}-${mobileClass} carousel__dots--${mobileClass}`}
    >
        {items.map((_, index) => (
            <div
                key={index}
                onClick={(): void => selectSlide(index)}
                className={`carousel__point transition-all rounded-full cursor-pointer w-2.5 h-2.5 ${
                    index === activeSlide ? 'bg-blue' : 'bg-gray-200'
                }`}
            />
        ))}
    </div>
);
