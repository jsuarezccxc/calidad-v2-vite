import React from 'react';
import { Icon } from '@components/icon';
import { ICardImgProps, ICardSectionProps } from '.';
import './Card.scss';

// Vite dynamic imports for payment-gateway images
const paymentGatewayImages = import.meta.glob<{ default: string }>('/src/assets/images/payment-gateway/*.svg', { eager: true });
const getPaymentGatewayImage = (img: string): string => {
    const path = `/src/assets/images/payment-gateway/${img}.svg`;
    return paymentGatewayImages[path]?.default || '';
};

export const SimpleCard: React.FC<{ className: string; onClick: () => void }> = ({ className, children, onClick }) => {
    return (
        <article className={className} role="button" onClick={onClick}>
            {children}
        </article>
    );
};

export const CardImg: React.FC<ICardImgProps> = ({ img, label, onClick }) => {
    return (
        <SimpleCard className="payment-gateway-card__card" onClick={onClick}>
            <img alt="icon-payment-gateway" src={getPaymentGatewayImage(img)} className="payment-gateway-card__card__img" />
            <h3 className="payment-gateway-card__card__title">{label}</h3>
        </SimpleCard>
    );
};

export const CardSection: React.FC<ICardSectionProps> = ({ title, iconStep, isCheck, onClick, isNotBlocked }) => {
    const handleClick = isNotBlocked ? onClick : (): void => {};
    return (
        <SimpleCard className="payment-gateway-card__card-instructions" onClick={handleClick}>
            <Icon alt="icon step" name={iconStep} className="payment-gateway-card__card-instructions__icon-step" />
            <h3 className="payment-gateway-card__card-instructions__title">{title}</h3>
            <Icon name="arrowRightDGray" className="w-5.5 h-5.5" alt="icon arrow" />
            {isCheck && (
                <Icon alt="icon check" name="checkMulticolor" className="payment-gateway-card__card-instructions__icon-check" />
            )}
        </SimpleCard>
    );
};
