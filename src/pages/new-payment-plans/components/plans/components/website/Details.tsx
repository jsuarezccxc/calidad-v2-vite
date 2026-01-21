import React, { useMemo } from 'react';
import { Icon } from '@components/icon';
import { GRADIENTS } from '@constants/PaymentPlans';
import { useAccordion } from '@hooks/useAccordion';
import { PLAN_DETAIL } from '@information-texts/PaymentPlans';
import { DetailButton } from '..';

export const Details: React.FC = () => {
    const { getActiveClass, open, toggleOpening } = useAccordion();

    const details = useMemo(() => Object.entries(PLAN_DETAIL), []);

    return (
        <DetailButton open={open} toggleOpening={toggleOpening}>
            <div className={`details ${getActiveClass('details')}`}>
                {details.map(([plan, items], index) => {
                    const gradient = GRADIENTS[index];
                    return (
                        <div key={plan} className={`detail detail--${gradient}`}>
                            {items.map(({ description, including }) => (
                                <p
                                    className={`detail__description ${including ? '' : 'detail__description--disabled'}`}
                                    key={description}
                                >
                                    <Icon name={including ? 'successMulticolor' : 'cancel'} className="icon--detail" />
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
