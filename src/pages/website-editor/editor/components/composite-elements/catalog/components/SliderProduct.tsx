import React from 'react';
import Slider from 'react-slick';
import defaultProduct from '@assets/images/catalog/default-catalog.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMoney } from '@utils/Decimals';

export const SliderProduct: React.FC<{ slideOptionThree: IGenericRecord[] }> = ({ slideOptionThree }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true,
        centerPadding: '0',
        autoplay: true,
        autoplaySpeed: 5000,
    };

    return (
        <Slider {...settings}>
            {slideOptionThree?.map(product => (
                <div key={product.id} className="carousel-product-card">
                    <div className="image-section">
                        <img src={product?.image || defaultProduct} alt={product.title} />
                    </div>
                    <div className="info-section">
                        <h2 className="price">
                            {formatMoney(product.price, 0)}
                            {!!product.priceDiscount && <span className="discount">{formatMoney(product.priceDiscount, 0)}</span>}
                        </h2>
                        <h3 className="title">{product.title}</h3>
                        <h3 className="title-description">Descripción del producto</h3>
                        <p className="description">{product?.description}</p>
                        <p className="detail-button">Ver detalle</p>
                    </div>
                </div>
            ))}
        </Slider>
    );
};
