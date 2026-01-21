import React from 'react';
import { Slider as Component } from '@mui/material';
import { ISliderProps, DEFAULT_LIMITS } from '.';

export const Slider: React.FC<ISliderProps> = ({ className = '', handleChange, limits = DEFAULT_LIMITS, unit = '%', value }) => {
    const { min, max } = limits;
    return (
        <>
            <Component
                aria-label="Small"
                size="small"
                value={value}
                min={min}
                max={max}
                onChange={(e_, value): void => handleChange(value)}
                className={className}
            />
            <small className="text-xtiny text-gray-dark">
                {value}
                {unit}
            </small>
        </>
    );
};
