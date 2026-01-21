import React from 'react';
import { IFooterLinkProps } from '.';

export const Link: React.FC<IFooterLinkProps> = ({ links, mobile }) => {
    return (
        <div className={`footer__links ${mobile ? 'footer-mobile__links' : ''}`}>
            {links.map((link, index) => (
                <p key={index} className={`footer__links-item ${mobile ? 'footer-mobile__links-item' : ''}`}>
                    {link.text}
                </p>
            ))}
        </div>
    );
};
