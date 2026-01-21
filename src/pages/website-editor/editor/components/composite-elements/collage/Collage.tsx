import React, { Fragment } from 'react';
import imageCollage from '@assets/images/collage.png';
import { createArray } from '@utils/Array';
import { ElementOption, StyleKey } from '@models/WebsiteNode';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import Img from '@pages/website-editor/editor/components/Img';
import { COLLAGE_OPTION } from '.';
import './Collage.scss';

export const Collage: React.FC<IElementProps> = ({ data, styleKey }) => {
    const { option, setting } = data;
    const options = createArray(COLLAGE_OPTION[option]);
    const imageOptions = Object.values(ElementOption);
    const collageFixed = [ElementOption.Five, ElementOption.Six, ElementOption.Seven];
    const mobile: boolean = styleKey === StyleKey.MobileStyle;

    return (
        <div
            style={{
                ...data.style,
                width: collageFixed.includes(option) ? '' : data.style.width,
                height: collageFixed.includes(option) ? '' : data.style.height,
            }}
        >
            <div className={`collage ${mobile ? 'collage--' + option + '__mobile' : ''} collage--${option} `}>
                {option === ElementOption.Three && <div className={`collage--${option}-empty-one shadow-templateDesign`} />}
                {options?.map((image: number, index: number) => (
                    <Fragment key={image}>
                        <div
                            className={`collage--${option}-image-${imageOptions[index]} collage--${option}-image shadow-templateDesign`}
                        >
                            <Img
                                src={setting?.images?.[index] || imageCollage}
                                alt="product"
                                className="object-cover w-full h-full pointer-events-none"
                            />
                        </div>
                    </Fragment>
                ))}
                {option === ElementOption.Three && <div className={`collage--${option}-empty-two shadow-templateDesign`} />}
            </div>
        </div>
    );
};
