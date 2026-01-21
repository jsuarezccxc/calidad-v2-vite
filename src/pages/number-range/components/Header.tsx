import React from 'react';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageTitle } from '@components/page-title';
import usePopper from '@hooks/usePopper';
import { NUMBER_RANGE } from '@information-texts/NumberRange';
import { routes } from '@pages/number-range';

export const Header: React.FC = () => {
    const { anchorEl, togglePopper } = usePopper();

    const { TITLE, SUBTITLE, DESCRIPTION, PAGE_CONTENT } = NUMBER_RANGE(anchorEl, togglePopper);
    return (
        <>
            <PageTitle pageContent={SUPPORT_DOCUMENTS_SUBTITLE} title={PAGE_CONTENT} />
            <BreadCrumb routes={routes()} />
            <h2 className="text-26lg font-allerbold text-center w-full py-4.5 text-blue">{TITLE}</h2>
            <Information
                classNameContainer="mb-4.5"
                classNameTitle="text-blue text-lg"
                title={SUBTITLE}
                description={DESCRIPTION}
            />
        </>
    );
};
