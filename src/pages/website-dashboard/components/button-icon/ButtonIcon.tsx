import React from 'react';
import { Icon } from '@components/icon';
import { SimpleButton } from '@components/button';
import { IButtonIconProps } from '.';

export const ButtonIcon: React.FC<IButtonIconProps> = ({ iconName, classIcon, children, ...buttonProps }) => {
    const { className, disabled, ...otherProps } = buttonProps;

    return (
        <SimpleButton className={`${disabled ? `${className}-disabled` : className}`} {...otherProps}>
            <Icon name={iconName} classIcon={classIcon} />
            {children}
        </SimpleButton>
    );
};
