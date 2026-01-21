import React from 'react';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';

export const SocialNetworks: React.FC<IGenericRecord> = ({ netWorks, mobile }) => {
    return (
        <div className={`header__social-networks ${mobile ? 'header-mobile__social-networks' : ''}`}>
            {netWorks?.map((icon: IGenericRecord) => (
                <Icon key={icon.name} name={icon.icon} />
            ))}
        </div>
    );
};
