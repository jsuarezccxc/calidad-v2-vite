import React from 'react';
import { Domains } from '@pages/website-active-domain/components';
import './ConfigDns.scss';
import { IConfigDnsProps } from '.';

export const ConfigDns: React.FC<IConfigDnsProps> = ({ domains, handleValidateStep }) => {
    return (
        <div className="config-dns">
            <div className="config-dns__content">
                <Domains domains={domains} customAction={handleValidateStep} />
            </div>
        </div>
    );
};
