import React from 'react';
import { SimpleButton } from '@components/button';
import { IButtonsProps } from '.';

export const Buttons: React.FC<IButtonsProps> = ({ activateButton, activeButton, buttons }) => {
    return (
        <div className="carousel__buttons flex justify-center mb-3.5">
            {buttons.map(({ name }, index) => (
                <SimpleButton
                    className={`carousel__button carousel__button--${index === activeButton ? 'active' : 'inactive'}`}
                    key={name}
                    onClick={(): void => activateButton(index)}
                >
                    {name}
                </SimpleButton>
            ))}
        </div>
    );
};
