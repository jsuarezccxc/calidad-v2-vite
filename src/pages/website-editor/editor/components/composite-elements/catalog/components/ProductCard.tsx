import React, { useState } from 'react';
import defaultProduct from '@assets/images/catalog/default-catalog.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';
import { formatMoney } from '@utils/Decimals';
import { ZERO } from '@constants/UtilsConstants';
import { Icon } from '@components/icon';

export const ProductCard: React.FC<{
    item: IGenericRecord;
    showUnitValue: boolean;
    classContainer?: string;
    option?: string;
}> = ({ item, showUnitValue = true, classContainer, option }) => {
    const [activeCard, setActiveCard] = useState(false);
    const [addIconBag, setAddIconBag] = useState(true);

    const addIconBagCard = option === ElementOption.Three && addIconBag;
    const valueDiscount = item.discount_website
        ? item.value_with_taxes - (item.value_with_taxes * item.discount_website) / 100
        : ZERO;

    return (
        <article
            className={`product-card w-full  ${classContainer}`}
            onMouseEnter={(): void => setActiveCard(true)}
            onMouseLeave={(): void => setActiveCard(false)}
        >
            <figure
                className={`relative rounded-lg product-card__image-wrapper w-full h-full product-card__image-wrapper-${option}`}
                onMouseEnter={(): void => setAddIconBag(false)}
                onMouseLeave={(): void => setAddIconBag(true)}
            >
                {addIconBagCard && <Icon name="shoppingBagGreen" className="absolute top-0 right-0 mt-2 mr-2" />}
                {activeCard &&
                    (option === ElementOption.One ? (
                        <div className="absolute w-full h-full">
                            <div className="w-full h-full rounded-lg bg-green-ultraLight" />
                            <p className="absolute z-40 flex items-center justify-center w-5/6 h-6 bg-white rounded-full cursor-pointer bottom-2 left-3 text-green text-xtiny">
                                AGREGAR A CARRITO
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="absolute w-full h-full rounded-lg product-card__active" />
                            <div className="absolute flex flex-col items-center justify-center w-full h-full ">
                                <p className="bg-green cursor-pointer rounded-2.5xl w-3/4 h-6 text-white flex justify-center items-center text-xtiny mb-5">
                                    Ver detalle
                                </p>
                                <p className="bg-white cursor-pointer rounded-2.5xl w-3/4 h-6 text-green flex justify-center items-center text-xtiny border border-green">
                                    Agregar al carrito
                                </p>
                            </div>
                        </>
                    ))}
                <img
                    alt="product"
                    className={`m-auto rounded-lg product-card__image-${option}`}
                    src={item?.unique_product_images?.length ? item?.unique_product_images[ZERO]?.url : defaultProduct}
                />
            </figure>
            <p className={`product-card__name text-primary ${option === ElementOption.Three ? 'text-center' : ''}`}>
                {item.name}
            </p>
            {showUnitValue && (
                <div className={`${option === ElementOption.Three ? 'flex justify-center' : ''}`}>
                    <span className={`product-card__price product-card__price-${option}`}>
                        {formatMoney(valueDiscount ? valueDiscount : item?.value_with_taxes, ZERO)}
                    </span>
                    {!!valueDiscount && (
                        <span className={`product-card__discount product-card__discount-${option}`}>
                            {formatMoney(item.value_with_taxes, ZERO)}
                        </span>
                    )}
                </div>
            )}
        </article>
    );
};
