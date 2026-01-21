import websiteModule from '@assets/images/landing/website-module.svg';
import electronicDocumentModule from '@assets/images/landing/electronic-document-module.svg';
import accountingModule from '@assets/images/landing/accounting-module.svg';
import electronicPayrollModule from '@assets/images/landing/electronic-payroll-module.svg';
import marketingModule from '@assets/images/landing/marketing-module.svg';
import planningModule from '@assets/images/landing/planning-module.svg';
import marketModule from '@assets/images/landing/market-module.svg';
import legalModule from '@assets/images/landing/legal-module.svg';

export enum ModuleHash {
    WEBSITE_MODULE = 'website-module',
    ELECTRONIC_DOCUMENT_MODULE = 'electronic-document-module',
    ACCOUNTING_MODULE = 'accounting-module',
    ELECTRONIC_PAYROLL_MODULE = 'electronic-payroll-module',
    MARKETING_MODULE = 'marketing-module',
    PLANNING_MODULE = 'planning-module',
    MARKET_MODULE = 'market-module',
    LEGAL_MODULE = 'legal-module',
}

export const MODULES = [
    {
        title: `Sitio web y </br><span>tienda <span style='background: linear-gradient(to bottom, rgba(18, 128, 195, 1), rgba(0, 171, 158, 1));-webkit-background-clip: text;-webkit-text-fill-color: transparent;'>diggi</span>tal</span>`,
        image: websiteModule,
        hash: ModuleHash.WEBSITE_MODULE,
    },
    {
        title: 'Documentos electrónicos',
        image: electronicDocumentModule,
        hash: ModuleHash.ELECTRONIC_DOCUMENT_MODULE,
    },
    {
        title: 'CRM',
        image: marketingModule,
        hash: ModuleHash.MARKETING_MODULE,
    },
    {
        title: 'Planeación y organización',
        image: planningModule,
        hash: ModuleHash.PLANNING_MODULE,
    },
    {
        title: `Vendedor </br><span><span style='background: linear-gradient(to bottom, rgba(18, 128, 195, 1), rgba(0, 171, 158, 1));-webkit-background-clip: text;-webkit-text-fill-color: transparent;'>diggi</span>tal</span>`,
        image: marketModule,
        hash: ModuleHash.MARKET_MODULE,
    },
    {
        title: 'Administración de nómina',
        image: electronicPayrollModule,
        hash: ModuleHash.ELECTRONIC_PAYROLL_MODULE,
    },
    {
        title: 'Contabilidad y finanzas',
        image: accountingModule,
        hash: ModuleHash.ACCOUNTING_MODULE,
    },
    {
        title: 'Control </br> interno y legal',
        image: legalModule,
        hash: ModuleHash.LEGAL_MODULE,
    },
];
