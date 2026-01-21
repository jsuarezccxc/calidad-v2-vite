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
import { DetailButton } from '..';
import { DETAILS } from '.';

export const Details: React.FC = () => {
    const { activePopper, anchorEl, mouseProps } = usePopper();

    const { getActiveClass, open, toggleOpening } = useAccordion();

    const { title, description } = DETAILS[Number(activePopper ?? 0)];

    return (
        <DetailButton open={open} toggleOpening={toggleOpening}>
            <div className={`details ${getActiveClass('details')}`}>
                {DETAILS.map(({ title }, index) => (
                    <div className="detail" key={title}>
                        <div className="detail__image-container">
                            <img
                                alt="Detail"
                                src={getElectronicDocsPlanImage(index + 1)}
                            />
                        </div>
                        <p className="detail__information">
                            <img id={String(index)} alt="information" className="w-5.5 h-5.5" src={information} {...mouseProps} />
                            <span className="detail__description">{title}</span>
                        </p>
                    </div>
                ))}
                <Tooltip
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
