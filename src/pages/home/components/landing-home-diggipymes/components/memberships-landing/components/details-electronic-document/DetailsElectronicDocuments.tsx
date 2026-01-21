import React from 'react';

// Vite dynamic imports for electronic documents plan images
const electronicDocsPlanImages = import.meta.glob<{ default: string }>('/src/assets/images/plans/electronic-documents/*.svg', { eager: true });
const getElectronicDocsPlanImage = (index: number): string => {
    const path = `/src/assets/images/plans/electronic-documents/detail${index}.svg`;
    return electronicDocsPlanImages[path]?.default || '';
};
import information from '@assets/images/info-green.svg';
import { Tooltip } from '@components/tooltip';
import { useAccordion } from '@hooks/useAccordion';
import usePopper from '@hooks/usePopper';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DetailButton } from '../buttons';
import { DETAILS_ELECTRONIC_DOCUMENTS } from '../..';
import './DetailsElectronicDocuments.scss';

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
                                src={getElectronicDocsPlanImage(index + 1)}
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
