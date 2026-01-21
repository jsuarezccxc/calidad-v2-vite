import React from 'react';
import { BreadCrumb } from '@components/bread-crumb';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import { routes } from '.';

export const WebsiteLayout: React.FC<{ firstTime: boolean }> = ({ children, firstTime }) => {
    return (
        <div className="mt-7 xs:px-2">
            <p className={`text-base ${!firstTime ? 'mb-2' : 'title-website'} text-blue font-allerbold`}>
                {WEBSITE_DESIGN_AND_ADMINISTRATION}
            </p>
            <BreadCrumb routes={routes()} />

            <div className="layout">
                <h1 className="layout__title">Cómo promocionar y optimizar el sitio web</h1>
            </div>

            {children}
        </div>
    );
};
