import React, { useContext } from 'react';
import { NumberRangeContext } from '../context';
import { TabContent, Tabs, TypeTab } from '.';

export const ContentWrapper: React.FC = () => {
    const { electronicInvoiceRanges, supportDocumentRange } = useContext(NumberRangeContext);
    const tabs = [
        {
            label: TypeTab.FE,
            content: <TabContent data={electronicInvoiceRanges} type={TypeTab.FE} />,
        },
        {
            label: TypeTab.SD,
            content: <TabContent data={supportDocumentRange} type={TypeTab.SD} />,
        },
    ];
    return <Tabs tabs={tabs} />;
};
