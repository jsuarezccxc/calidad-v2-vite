import React from 'react';
import { formatMoney } from '@utils/Decimals';
import Img from '@pages/website-editor/editor/components/Img';
import { ICardProps } from '.';

export const Card: React.FC<ICardProps> = ({ className = '', image, option, product, mobileClassName = '' }) => {
    const { unitValue, discount } = product ?? { unitValue: 0, discount: 0 };

    const getDiscountedPrice = (): string => {
        if (unitValue) {
            if (discount) return formatMoney(unitValue * ((100 - Number(discount)) / 100));
            return formatMoney(unitValue);
        }
        return '$000.000';
    };

    return (
        <div className={`card ${className} card--${mobileClassName}`}>
            {product && (
                <>
                    <div className={`card__figure--${option} card__figure--${option}--${mobileClassName}`}>
                        {<Img className="w-full h-full" src={product?.src || image} alt="product" />}
                    </div>
                    <div className={`card__bg card__bg--${option} card__bg card__bg--${option}--${mobileClassName}`}>
                        <span
                            className={`card__product-name card__product-name--${mobileClassName} card__product-name--${option}`}
                        >
                            {product?.name || 'Nombre producto'}
                        </span>
                        <span className={`card__product-value card__product-value--${option}`}>{getDiscountedPrice()}</span>
                    </div>
                </>
            )}
        </div>
    );
};
