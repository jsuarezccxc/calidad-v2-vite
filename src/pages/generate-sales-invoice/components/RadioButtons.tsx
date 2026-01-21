import React from 'react';
import informationIcon from '@assets/images/info-green.svg';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { getTooltipData, PERSONAL_DATA_OPTIONS, IRadioButtonsProps } from '.';

export const RadioButtons: React.FC<IRadioButtonsProps> = ({ formData, handleChange, disabled = false }) => {
    const { activePopper, anchorEl, mouseProps } = usePopper();

    const tooltipData = getTooltipData(PERSONAL_DATA_OPTIONS, activePopper);

    return (
        <div className="radio-buttons">
            <h3 className="mb-2 font-allerbold text-gray-dark">*Seleccione la opción que aplique para su cliente:</h3>
            <fieldset className="flex flex-col gap-7 lg:flex-row">
                {PERSONAL_DATA_OPTIONS.map(({ id, label, value }) => (
                    <div key={id} className="radio-button">
                        <input
                            disabled={disabled}
                            checked={formData?.not_information_customer === value}
                            id={label}
                            onChange={(): void => handleChange(value)}
                            type="radio"
                        />
                        <label className="border radio-button__option" htmlFor={label}>
                            {label}
                            <img
                                id={id}
                                className="w-5.5 h-5.5 cursor-pointer"
                                src={informationIcon}
                                alt="Information"
                                {...mouseProps}
                            />
                        </label>
                    </div>
                ))}
            </fieldset>
            <Tooltip
                anchorEl={anchorEl}
                iconName="infoBlue"
                title={`${tooltipData?.label}:`}
                description={tooltipData?.description}
            />
        </div>
    );
};
