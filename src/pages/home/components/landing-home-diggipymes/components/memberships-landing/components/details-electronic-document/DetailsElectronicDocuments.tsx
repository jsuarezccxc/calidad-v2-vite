import React from 'react';
import information from '@assets/images/info-green.svg';
import { Tooltip } from '@components/tooltip';
import { useAccordion } from '@hooks/useAccordion';
import usePopper from '@hooks/usePopper';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DetailButton } from '../buttons';
import { DETAILS_ELECTRONIC_DOCUMENTS } from '../..';
import './DetailsElectronicDocuments.scss';

// Static imports for Vite compatibility
import detail1 from '@assets/images/plans/electronic-documents/detail1.svg';
import detail2 from '@assets/images/plans/electronic-documents/detail2.svg';
import detail3 from '@assets/images/plans/electronic-documents/detail3.svg';
import detail4 from '@assets/images/plans/electronic-documents/detail4.svg';
import detail5 from '@assets/images/plans/electronic-documents/detail5.svg';
import detail6 from '@assets/images/plans/electronic-documents/detail6.svg';
import detail7 from '@assets/images/plans/electronic-documents/detail7.svg';
import detail8 from '@assets/images/plans/electronic-documents/detail8.svg';
import detail9 from '@assets/images/plans/electronic-documents/detail9.svg';

const detailImages = [detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9];

export const DetailsElectronicDocuments: React.FC = () => {
    const { activePopper, anchorEl, mouseProps } = usePopper();

    const { getActiveClass, open, toggleOpening } = useAccordion();

    const { title, description } = DETAILS_ELECTRONIC_DOCUMENTS[Number(activePopper ?? 0)];

    return (
        <DetailButton
            id={generateId({
                module: ModuleApp.LANDING,
                submodule: `details-membership-electronic-documents`,
                action: ActionElementType.INFO,
                elementType: ElementType.BTN,
            })}
            open={open}
            toggleOpening={toggleOpening}
        >
            <div className={`details ${getActiveClass('details')}`}>
                {DETAILS_ELECTRONIC_DOCUMENTS.map(({ title }, index) => (
                    <div className="detail" key={title}>
                        <div className="detail__image-container">
                            <img
                                alt="Detail"
                                src={detailImages[index]}
                                className="w-8 h-8"
                            />
                        </div>
                        <p className="detail__information">
                            <img id={String(index)} alt="information" src={information} {...mouseProps} />
                            <span className="detail__description">{title}</span>
                        </p>
                    </div>
                ))}
                <Tooltip
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'details-membership-electronic-documents-content-tooltip',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TOOL,
                    })}
                    anchorEl={anchorEl}
                    iconName="infoBlue"
                    description={description}
                    placement="bottom-start"
                    title={`${title}:`}
                />
            </div>
        </DetailButton>
    );
};
