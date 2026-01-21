import React from 'react';
import imageMaintenance from './assets/images/maintenance.svg';
import diggyLogo from './assets/images/diggy-logo.svg';
import instagramLogo from './assets/images/instagram-logo.svg';
import linkedinLogo from './assets/images/linkedin-logo.svg';
import maintenanceWorkResponsive from './assets/images/maintenance-work-responsive.svg';
import maintenanceWork from './assets/images/maintenance-work.svg';
import youtubeLogo from './assets/images/youtube-logo.svg';

import './index.scss';

export const PageMaintenance: React.FC = (): React.ReactElement => {
    return (
        <>
            <header className='header-maintenance items-center'>
                <div>
                    <img src={diggyLogo} alt="diggy-logo" className="maintenance-container__diggy-logo" />
                    <img src={imageMaintenance} alt="maintenance-image" className="maintenance-image" />
                </div>
            </header>
            <div className="image-container-maintenance">
                <img src={maintenanceWorkResponsive} alt="maintenance-work-responsive" className="image-maintenance" />
                <img src={maintenanceWork} alt="maintenance-work" className="image-responsive-maintenance" />
            </div>
            <footer className='footer-maintenance'>
                <div className="footer-maintenance__social">
                    <a className='footer-maintenance-a' href="https://www.instagram.com/diggipymes/">
                        <img src={instagramLogo} alt="instagram" />
                    </a>
                    <a className='footer-maintenance-a' href="https://www.linkedin.com/company/ccxc">
                        <img src={linkedinLogo} alt="linkedin" />
                    </a>
                    <a className='footer-maintenance-a' href="https://www.youtube.com/channel/UClPmwyTAXJdvtTwYWcSWceg">
                        <img src={youtubeLogo} alt="youtube" />
                    </a>
                </div>
                <p className='footer-maintenance-p'>Centro de Consultoría para la Competitvidad CCxC Colombia SAS
                    &nbsp;
                    •
                    &nbsp;
                    NIT 901.084.754-3
                    &nbsp;
                    •
                    &nbsp;
                    Calle 26 #68C-61 Edificio
                    Torre Central, oficina 301</p>
                <p className='footer-maintenance-p'>
                    <a className='footer-maintenance-a' href="https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/3006b3a2-332c-4244-970a-67c72d9901b8/security/politic/2024-06-12-b55ce68b-981e-4d24-ad7f-b02329c0212f-1718204352.pdf"
                    >
                        Términos y condiciones
                    </a>
                    &nbsp;
                    •
                    &nbsp;
                    <a className='footer-maintenance-a' href="https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/3006b3a2-332c-4244-970a-67c72d9901b8/security/politic/2024-07-24-bdab638c-be41-456e-b5c4-c30216450206-1721855113.pdf"
                    >
                        Política
                    </a>
                    &nbsp;
                    •
                    &nbsp;
                    <a className='footer-maintenance-a' href="https://ccxc.co/">
                        Sugerencias y reclamos
                    </a>
                </p>

            </footer>
        </>
    );
};
