import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';

const Footer: React.FC = () => {
    const history = useHistory();
    const { handleSaveWebsiteInventory } = useContext(WebsiteInventoryContext);
    const { disabledInputs } = usePermissions();
    return (
        <PageButtonsFooter
            {...buttonsFooterProps(ModuleApp.WEBSITE, history, getRoute(Routes.WEBSITE_ANALYTICS), {
                name: getRouteName(Routes.WEBSITE_ANALYTICS),
                moduleName: getRouteName(Routes.WEBSITE_MENU),
            })}
            threeButtons
            disabledCenter={disabledInputs}
            onClickButtonCenter={handleSaveWebsiteInventory}
        />
    );
};

export default Footer;
