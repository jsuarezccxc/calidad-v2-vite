import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Routes } from '@constants/Paths';
import { LANGUAGE_KEY } from '@constants/Translate';
import { Icon } from '@components/icon';
import { Link, LinkColor } from '@components/button';
import { RootState } from '@redux/rootReducer';
import { setType } from '@redux/personalized-consulting/actions';
import { urls } from '@api/urls';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { currentDateInUnix, getDateFromUnix } from '@utils/Date';
import { IFooterProps } from '.';

/**
 * Footer is a component that allows show a disclaimer with privacy policy and treatment of personal data
 */
const Footer: React.FC<IFooterProps> = ({ className, isFooterSidebar = false }) => {
    const { accessToken } = useSelector((state: RootState) => state.session);
    const dispatch = useDispatch();
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { pathname, search } = useLocation();
    const isWebsitePage: boolean = pathname === getRoute(Routes.WEBSITE_EDITOR) && !search;

    return (
        <>
            {isFooterSidebar ? (
                <footer className="flex flex-col justify-center items-start bg-green h-13 my-4.5 ml-5.5">
                    <div className="flex">
                        <Icon
                            id={generateId({
                                module: ModuleApp.FOOTER,
                                submodule: 'sidebar-logo-ccxc',
                                action: ActionElementType.INFO,
                                elementType: ElementType.ICO,
                            })}
                            name="logoCcxc"
                            className="h-5 xs:my-auto w-11 mr-2.5"
                        />
                        <span className="bg-white border-0 h-4 border-l-0.5" />
                        <Icon
                            id={generateId({
                                module: ModuleApp.FOOTER,
                                submodule: 'sidebar-property',
                                action: ActionElementType.INFO,
                                elementType: ElementType.ICO,
                            })}
                            name="faviconWhite"
                            className="w-10 h-5"
                        />
                        <span className="bg-white border-0 h-4 border-l-0.5" />
                        <p className="text-white  text-ntiny font-aller ml-2.5 leading-xtiny w-32.7">
                            {translate('footer.property')} {getDateFromUnix(currentDateInUnix()).year} ©
                        </p>
                    </div>
                    <div className="flex justify-center w-full mt-1.5">
                        <Link
                            id={generateId({
                                module: ModuleApp.FOOTER,
                                submodule: 'sidebar-personalized-consulting',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            text={translate('footer.support')}
                            href="/personalized-consultancy"
                            linkColor={LinkColor.WHITE}
                            classes="text-white text-xntiny font-aller leading-xtiny hover:text-white"
                            hover={false}
                            onClick={(): void => {
                                dispatch(setType({ key: 4, type: 'Contáctenos' }));
                            }}
                        />
                        <span className="text-white  text-ntiny font-aller ml-1.5 leading-xtiny ">I</span>
                        <Link
                            id={generateId({
                                module: ModuleApp.FOOTER,
                                submodule: 'sidebar-terms',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            text={translate('footer.terms')}
                            href={urls.footer.terms}
                            linkColor={LinkColor.WHITE}
                            classes="text-white text-xntiny font-aller ml-1.5 leading-xtiny mr-5"
                            target="_blank"
                            download
                        />
                    </div>
                    <Link
                        id={generateId({
                            module: ModuleApp.FOOTER,
                            submodule: 'sidebar-superintendence',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.LNK,
                        })}
                        text={translate('footer.superintendence')}
                        href="https://www.sic.gov.co/"
                        linkColor={LinkColor.WHITE}
                        classes="w-full mt-1 text-center text-white  text-xntiny font-aller leading-xtiny pr-5"
                        target="_blank"
                        download
                    />
                </footer>
            ) : (
                <footer
                    className={`sm:py-6.70  ${accessToken ? 'w-auto lg:w-full pl-7 xs:pl-0' : 'flex justify-center md:pl-2 '} ${
                        isWebsitePage ? 'hidden' : ''
                    } ${className}`}
                >
                    <p className="leading-3 text-xtiny text-blue">
                        {translate('footer.platform-terms')} &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.FOOTER,
                                submodule: 'privacy-politic',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            text={translate('footer.politics')}
                            linkColor={LinkColor.PURPLE}
                            href={urls.footer.politics}
                            classes="text-xtiny"
                            target="_blank"
                            download
                        />
                        &nbsp; {translate('footer.information-terms')}.
                    </p>
                </footer>
            )}
        </>
    );
};

export default Footer;
