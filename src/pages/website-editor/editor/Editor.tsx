//--- Libraries ---//
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { toggleMenu } from '@redux/menu/actions';
import { getCatalogWebsite, getCategories } from '@redux/product-catalog/actions';
import { getWebsite, getWebsites, postNewWebsite, setActivePage } from '@redux/website-node/actions';
//--- Components ---//
import { Icon } from '@components/icon';
import { ZERO } from './components/drag-and-drop';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Information, SaveButtons, Sidebar, WorkSpace } from './components';
//--- Hooks ---//
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import usePermissions from '@hooks/usePermissions';
//--- Utils ---//
import { buttonsFooterProps } from '@utils/Button';
import { getRouteName, getRoute } from '@utils/Paths';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { Source } from '@constants/Onboarding';
//--- Context ---//
import { ElementsContext } from './context';
//--- Root ---//
import { DEFAULT_FIRST_PAGE } from '.';
//--- Styles ---//
import './Editor.scss';

export const Editor: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];

    const { open } = useSelector(({ menu }: RootState) => menu);
    const { activeMemberships } = useSelector(({ company }: RootState) => company);

    const { saveChanges } = useContext(ElementsContext);

    const { disabledInputs } = usePermissions();
    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        getData();
        handleWebsite();
    }, [activeMemberships]);

    const goToAddPoliticsPage = async (): Promise<void> => {
        await saveChanges();
        await history.push(getRoute(Routes.INSTRUCTIONS_PAYU));
    };

    const handleWebsite = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const websites: any = await dispatch(getWebsites());
        if (lengthEqualToZero(websites)) {
            await dispatch(postNewWebsite());
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let website: any = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const websiteActive = websites.filter((website: any) => !website.is_draft);
            if (lengthEqualToZero(websiteActive)) {
                website = await dispatch(getWebsite(websites[ZERO].id));
            } else {
                website = await dispatch(getWebsite(websiteActive[ZERO].id));
            }
            if (lengthGreaterThanZero(website.website?.pages)) {
                dispatch(setActivePage(website.website?.pages[DEFAULT_FIRST_PAGE]));
            }
        }
    };

    const getData = async (): Promise<void> => {
        await Promise.all([dispatch(getCatalogWebsite()), dispatch(getCategories())]);
    };

    const toggleSidebarMenu = (): void => {
        dispatch(toggleMenu());
    };

    useEffect(() => {
        const bodyApp = document.querySelector('#bodyApp') as HTMLElement;
        if (!bodyApp) return;
        const originalOverflow = bodyApp.style.overflowY;
        bodyApp.style.overflowY = 'hidden';
        return (): void => {
            bodyApp.style.overflowY = originalOverflow;
        };
    }, []);

    return (
        <div className="editor">
            <main className="editor__main">
                <div className="flex flex-col w-full h-full">
                    <Information />
                    <WorkSpace />
                </div>
                <Sidebar />
            </main>
            <div>
                <SaveButtons />
                <button
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-menu`,
                        action: ActionElementType.TOGGLE,
                        elementType: ElementType.BTN,
                    })}
                    className="editor__menu-button"
                    onClick={toggleSidebarMenu}
                    style={{ left: '0' }}
                >
                    <Icon
                        className={`transition-all transform cursor-pointer ${open ? 'rotate-180' : ''}`}
                        name="arrowRightWhite"
                    />
                </button>
                <PageButtonsFooter
                    {...buttonsFooterProps(ModuleApp.WEBSITE, history, '', {
                        name: getRouteName(Routes.WEBSITE_EDITOR),
                        moduleName: getRouteName(Routes.WEBSITE_MENU),
                    })}
                    disabledRight={disabledInputs}
                    className="footer-editor__buttons"
                    {...(!disabledInputs && { onClickButtonRight: (): void => handlePostConfirmation(goToAddPoliticsPage) })}
                />
            </div>
        </div>
    );
};
