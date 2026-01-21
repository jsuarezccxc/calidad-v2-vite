import React from 'react';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useAccordion } from '@hooks/useAccordion';
import { DetailButton } from '../buttons';
import { DETAILS_CRM } from '../..';
import './DetailsCrm.scss';

// Static imports for Vite compatibility
import detail1 from '@assets/images/plans/crm/detail1.svg';
import detail2 from '@assets/images/plans/crm/detail2.svg';
import detail3 from '@assets/images/plans/crm/detail3.svg';
import detail4 from '@assets/images/plans/crm/detail4.svg';
import detail5 from '@assets/images/plans/crm/detail5.svg';
import detail6 from '@assets/images/plans/crm/detail6.svg';
import detail7 from '@assets/images/plans/crm/detail7.svg';
import detail8 from '@assets/images/plans/crm/detail8.svg';

const detailImages = [detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8];

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
                                src={detailImages[index]}
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
