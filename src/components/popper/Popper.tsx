import React from 'react';
import { Popper as MaterialPopper } from '@mui/material';
import { IPopperProps } from '.';
import './Popper.scss';

export const Popper: React.FC<IPopperProps> = ({
    anchorEl,
    description,
    descriptionClassName = '',
    title,
    wrapperClassName = '',
    placement = 'bottom-end',
    children,
    onClick = (): void => {},
}) => (
    <MaterialPopper anchorEl={anchorEl} className={`popper ${wrapperClassName}`} open={Boolean(anchorEl)} placement={placement}>
        {description && (
            <div className="popper__content" onClick={onClick}>
                {title && <h2 className="popper__title">{title}</h2>}
                {typeof description === 'string' ? (
                    <p className={`popper__description ${descriptionClassName}`}>{description}</p>
                ) : (
                    description
                )}
            </div>
        )}

        {children}
    </MaterialPopper>
);
