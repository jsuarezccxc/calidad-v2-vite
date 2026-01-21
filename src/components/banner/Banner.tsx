import React from 'react';
import { IBannerProps } from '.';

export const Banner: React.FC<IBannerProps> = ({ text, className, classNameTagP }) => {
    return (
        <div className={`${className} w-full h-15 bg-green-extraLight absolute left-0`}>
            <p className={`${classNameTagP} text-base leading-6 font-poppinsmedium text-blue`}>{text}</p>
        </div>
    );
};
