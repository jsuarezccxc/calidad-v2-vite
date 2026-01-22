import React, { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { Contact } from '../../contact';
import { ModuleHash } from '../constants/modules';
import { HeroLanding } from '../components/hero-landing';
import { ModulesLanding } from '../components/modules-landing';
import {
    AccountingModule,
    ElectronicDocument,
    MarketingModule,
    MarketModule,
    PayrollModule,
    PlanningModule,
    WebsiteModule,
    LegalModule,
} from '../components/modules';
import { SectionsHash } from '../constants/sections';
import { LandingHeader } from '../components/header-landing';
import { MembershipsLanding } from '../components/memberships-landing';
import { TestimonialsLanding } from '../components/testimonials-landing';

/**
 * This describes what the hook returns.
 *
 * @typeParam toggleScheduling: () => void - This opens the schedule demo section
 * @typeParam toggleAccount: () => void - This opens the registration modal
 * @typeParam toggleLogin: () => void - This opens the login modal
 */

export const useSwitchModules = (): ReactElement | undefined => {
    const { hash } = useLocation();
    const moduleName = hash?.replace('#', '');

    switch (moduleName) {
        case ModuleHash.WEBSITE_MODULE:
            return <WebsiteModule />;
        case ModuleHash.ELECTRONIC_DOCUMENT_MODULE:
            return <ElectronicDocument />;
        case ModuleHash.ACCOUNTING_MODULE:
            return <AccountingModule />;
        case ModuleHash.ELECTRONIC_PAYROLL_MODULE:
            return <PayrollModule />;
        case ModuleHash.MARKETING_MODULE:
            return <MarketingModule />;
        case ModuleHash.PLANNING_MODULE:
            return <PlanningModule />;
        case ModuleHash.MARKET_MODULE:
            return <MarketModule />;
        case ModuleHash.LEGAL_MODULE:
            return <LegalModule />;
        default:
            return (
                <>
                    <div className="landing--section-one">
                        <LandingHeader />
                        <HeroLanding />
                        <ModulesLanding />
                    </div>

                    <div id={SectionsHash.MEMBERSHIPS}>
                        <MembershipsLanding />
                    </div>

                    <TestimonialsLanding />
                    <div className="w-full mt-14.75 xs:mt-7 xs:pt-7 landing--section-contact" id="container">
                        <div
                            className="flex justify-center p-8 mt-10 xs:py-0 xs:px-4 max-h xs:justify-start"
                            id={SectionsHash.CONTACT}
                        >
                            <Contact />
                        </div>
                    </div>
                </>
            );
    }
};
