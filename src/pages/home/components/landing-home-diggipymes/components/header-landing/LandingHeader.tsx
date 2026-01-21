import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setDataCompanyLanding } from '@redux/session/actions';
import { RootState } from '@redux/rootReducer';
import HeaderLogoWhite from '@assets/images/landing/header-logo-white.svg';
import HeaderLogoColor from '@assets/images/landing/header-logo-color.svg';
import { Button } from '@components/button';
import { LandingContext } from '@pages/home/context/LandingContext';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { SectionsHash } from '../../constants/sections';
import { HeaderButton } from './components/HeaderButton';
import { ILandingHeader, CREATED_ACCOUNT_BUTTON, LOGIN_BUTTON } from './';
import './LandingHeader.scss';

export const LandingHeader: React.FC<ILandingHeader> = ({ darkMode = true }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { dataCompanyLanding } = useSelector(({ session }: RootState) => ({
        ...session,
    }));
    const history = useHistory();
    const { toggleLogin, toggleCreateAccount, openScheduling, setOpenScheduling } = useContext(LandingContext);

    const headerStyle = darkMode ? 'buttons__container--dark' : 'buttons__container--light';
    const selectLogo = darkMode ? HeaderLogoWhite : HeaderLogoColor;

    const scrollContact = (): void => {
        const element = document.getElementById(SectionsHash.CONTACT);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrollContact = (): void => {
        if (openScheduling) {
            setOpenScheduling(false);
            setTimeout(() => {
                scrollContact();
            }, 2000);
        }

        if (dataCompanyLanding) {
            dispatch(setDataCompanyLanding());
            setTimeout(() => {
                scrollContact();
            }, 2000);
        }

        scrollContact();

        if (location.hash !== `#${SectionsHash.HOME}`) {
            window.location.hash = SectionsHash.CONTACT;
        }
    };

    const redirectHome = (): void => {
        if (openScheduling) setOpenScheduling(false);
        if (dataCompanyLanding) dispatch(setDataCompanyLanding());
        history.push('/');
    };

    return (
        <header className="header-mobile">
            <div className="logo__container">
                <img src={selectLogo} alt="diggipymes logo" onClick={redirectHome} />
            </div>
            <div className={`buttons__container buttons-header-mobile ${headerStyle}`}>
                <Button
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'contact-us',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    text="Contáctenos"
                    classes="buttons__container--contact-us position-mobile xs:w-full"
                    onClick={handleScrollContact}
                />
                <HeaderButton
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'created-account',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    darkMode={darkMode}
                    buttonText={CREATED_ACCOUNT_BUTTON}
                    onClick={toggleCreateAccount}
                />
                <HeaderButton
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'login',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    darkMode={darkMode}
                    buttonText={LOGIN_BUTTON}
                    onClick={toggleLogin}
                />
            </div>
        </header>
    );
};
