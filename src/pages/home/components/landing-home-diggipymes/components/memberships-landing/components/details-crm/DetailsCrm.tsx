import React from 'react';

// Vite dynamic imports for CRM plan images
const crmPlanImages = import.meta.glob<{ default: string }>('/src/assets/images/plans/crm/*.svg', { eager: true });
const getCrmPlanImage = (index: number): string => {
    const path = `/src/assets/images/plans/crm/detail${index}.svg`;
    return crmPlanImages[path]?.default || '';
};
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useAccordion } from '@hooks/useAccordion';
import { DetailButton } from '../buttons';
import { DETAILS_CRM } from '../..';
import './DetailsCrm.scss';

export const DetailsCrm: React.FC = () => {
    const { getActiveClass, open, toggleOpening } = useAccordion();

    return (
        <DetailButton
            id={generateId({
                module: ModuleApp.LANDING,
                submodule: `details-membership-crm`,
                action: ActionElementType.INFO,
                elementType: ElementType.BTN,
            })}
            open={open}
            toggleOpening={toggleOpening}
        >
            <div className={`details ${getActiveClass('details')}`}>
                {DETAILS_CRM.map(({ title }, index) => (
                    <div className="detail" key={title}>
                        <div className="detail__image-container">
                            <img
                                alt="Detail"
                                src={getCrmPlanImage(index + 1)}
                                className="w-8 h-8"
                            />
                        </div>
                        <p className="detail__information">
                            <span className="detail__description">{title}</span>
                        </p>
                    </div>
                ))}
            </div>
        </DetailButton>
    );
};
