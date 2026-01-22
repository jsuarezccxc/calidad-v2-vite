import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { Source } from '@constants/Onboarding';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';

export const Footer: React.FC = () => {
    const history = useHistory();

    const { handlePostConfirmation } = useOnboardingNavigation(Source.ElectronicDocuments);

    const handleNextRoute = (): void => {
        handlePostConfirmation(() => history.push(getRoute(Routes.GENERATE_SALES_INVOICE)));
    };

    return (
        <PageButtonsFooter
            {...buttonsFooterProps(ModuleApp.ELECTRONIC_DOCUMENTS, history, handleNextRoute, {
                name: getRouteName(Routes.GENERATE_SALES_INVOICE),
                moduleName: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            })}
            className="buttons-footer"
        />
    );
};
