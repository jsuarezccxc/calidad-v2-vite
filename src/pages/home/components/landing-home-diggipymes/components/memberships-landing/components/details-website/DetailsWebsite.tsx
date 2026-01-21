import React, { useMemo } from 'react';
import { Icon } from '@components/icon';
import { GRADIENTS } from '@constants/PaymentPlans';
import { useAccordion } from '@hooks/useAccordion';
import { ONE } from '@pages/home';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DetailButton } from '../buttons';
import { DETAILS_DIGGITAL_SELLER_MODULE, DETAILS_WEBSITE } from '../..';
import './DetailsWebsite.scss';

export const DetailsWebsite: React.FC<{ isWebsite?: boolean }> = ({ isWebsite = false }) => {
    const { getActiveClass, open, toggleOpening } = useAccordion();

    const details = useMemo(() => Object.entries(isWebsite ? DETAILS_WEBSITE : DETAILS_DIGGITAL_SELLER_MODULE), []);

    return (
        <DetailButton
            id={generateId({
                module: ModuleApp.LANDING,
                submodule: `details-membership-${isWebsite ? 'website' : 'diggital-seller'}`,
                action: ActionElementType.INFO,
                elementType: ElementType.BTN,
            })}
            open={open}
            toggleOpening={toggleOpening}
        >
            <div className={`details-website ${getActiveClass('details-website')}`}>
                {details.map(([plan, items], index) => {
                    const gradient = isWebsite ? GRADIENTS[index] : GRADIENTS[ONE];
                    return (
                        <div key={plan} className={`detail-website detail-website--${gradient}`}>
                            {items.map(({ description, including }) => (
                                <p
                                    className={`detail-website__description ${
                                        including ? '' : 'detail-website__description--disabled'
                                    }`}
                                    key={description}
                                >
                                    <Icon
                                        id={generateId({
                                            module: ModuleApp.LANDING,
                                            submodule: `details-membership-${isWebsite ? 'website' : 'diggital-seller'}`,
                                            action: including ? ActionElementType.SUCCESS : ActionElementType.CANCEL,
                                            elementType: ElementType.ICO,
                                        })}
                                        name={including ? 'successMulticolor' : 'cancelMulticolor'}
                                        classIcon="detail-website__icon"
                                    />
                                    <span>{description}</span>
                                </p>
                            ))}
                        </div>
                    );
                })}
            </div>
        </DetailButton>
    );
};
