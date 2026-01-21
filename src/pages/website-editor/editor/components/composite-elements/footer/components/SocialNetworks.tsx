import React from 'react';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';

export const SocialNetworks: React.FC<IGenericRecord> = ({ netWorks, mobile }) => {
    return (
        <div className={`footer__social-networks ${mobile ? 'footer-mobile__social-networks' : ''}`}>
            {netWorks?.map((icon: IGenericRecord) => (
                <Icon key={icon.name} name={icon.icon} />
            ))}
        </div>
    );
};
