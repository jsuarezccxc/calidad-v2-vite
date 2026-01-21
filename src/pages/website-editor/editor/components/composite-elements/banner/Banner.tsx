import React from 'react';
import { Card, Texts } from './components';
import image1 from '@assets/images/banner/default-one.svg';
import image2 from '@assets/images/banner/default-two.svg';
import image3 from '@assets/images/banner/default-three.svg';
import { ElementOption } from '@models/WebsiteNode';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { IProduct } from '@pages/website-editor/editor/components/element-editor/composite-editor/banner-editor';
import { Wrapper } from '.';
import './Banner.scss';

export const Banner: React.FC<IElementProps> = ({ data, isMobile = false }) => {
    const { Four, One, Two } = ElementOption;

    const { option, setting, style } = data;
    const products: IProduct[] = setting?.products ?? [];
    const [singleProduct] = products;

    const mobileClassName = isMobile ? 'mobile' : '';

    const textsProps = { description: setting?.description, title: setting?.title, option, mobileClassName };

    return (
        <Wrapper
            className={`banner banner--${option} banner--${option}-${mobileClassName}`}
            style={style}
            hasBackground={option !== One}
        >
            {option === Two ? (
                <div className={`banner__items--${option} banner__items--${option}-${mobileClassName}`}>
                    <div className="flex-1">
                        <Card
                            className={`card--${option}-${mobileClassName}`}
                            image={image2}
                            option={option}
                            product={singleProduct}
                            mobileClassName={mobileClassName}
                        />
                    </div>
                    <div className="flex-1">
                        <Texts {...textsProps} />
                    </div>
                </div>
            ) : (
                <>
                    <Texts {...textsProps} />
                    <div className={`banner__items--${option} banner__items--${option}-${mobileClassName}`}>
                        {products.slice(0, isMobile ? 3 : products.length).map((product, index) => {
                            const isBigImage = !index || option === Four;
                            const image = option === One ? image1 : isBigImage ? image2 : image3;
                            return (
                                <Card
                                    key={index}
                                    className={`col-span-${isBigImage ? '2' : '1'} card--${option}-${mobileClassName}`}
                                    image={image}
                                    option={option}
                                    product={product}
                                    mobileClassName={mobileClassName}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </Wrapper>
    );
};
