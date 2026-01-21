import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_KEY } from '@constants/Translate';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { Link, LinkColor, LinkIcons } from '@components/button';
import { SectionsHash } from '../../constants/sections';
import { IFooterLandingProps, ROUTES_DIGGI } from '.';
import './FooterLanding.scss';

export const FooterLanding: React.FC<IFooterLandingProps> = ({ openScheduling, setOpenScheduling }) => {
    const [translate] = useTranslation(LANGUAGE_KEY);

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

        if (location.hash !== `#${SectionsHash.HOME}`) window.location.hash = SectionsHash.CONTACT;
    };

    return (
        <div className="landing-footer">
            <div className="landing-footer--body">
                <div className="flex gap-x-16 xs:mt-8">
                    <LinkIcons
                        id={generateId({
                            module: ModuleApp.FOOTER,
                            submodule: 'icons-instagram',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.ICO,
                        })}
                        nameIcon="instagramWhite"
                        href={ROUTES_DIGGI.INSTAGRAM}
                        classIcon="landing-footer--icon"
                        target="_blank"
                        className="m-auto"
                    />
                    <LinkIcons
                        id={generateId({
                            module: ModuleApp.FOOTER,
                            submodule: 'icons-linkedin',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.ICO,
                        })}
                        nameIcon="linkedinWhite"
                        href={ROUTES_DIGGI.LINKEDIN}
                        classIcon="landing-footer--icon"
                        target="_blank"
                    />
                    <LinkIcons
                        id={generateId({
                            module: ModuleApp.FOOTER,
                            submodule: 'icons-youtube',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.ICO,
                        })}
                        nameIcon="youtubeWhite"
                        href={ROUTES_DIGGI.YOUTUBE}
                        classIcon="landing-footer--icon"
                        target="_blank"
                        className="m-auto"
                    />
                </div>
                <div className="landing-footer--information">
                    <div className="sm:px-24">
                        <p className="text-center xs:text-xtiny font-poppinsmedium">
                            Centro de Consultoría para la Competitividad CCxC Colombia SAS&nbsp;
                            <span className="xs:hidden">&nbsp; • &nbsp;</span> NIT 901.084.754-3 &nbsp; • &nbsp; Calle 26 #68C-61
                            &nbsp; • &nbsp; Código postal: 110931 &nbsp; • &nbsp; Edificio Torre Central, oficina 301
                        </p>
                    </div>
                    <div className="flex justify-center mt-1 xs:mt-2 xs:text-xtiny">
                        <Link
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'home-terms-conditions',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            href={ROUTES_DIGGI.TERMS}
                            text="Términos y condiciones"
                            target="_blank"
                            download
                            linkColor={LinkColor.WHITE}
                            classes="xs:text-xtiny text-base"
                            hover={false}
                        />
                        <p className="mx-1">&nbsp; • &nbsp;</p>
                        <Link
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'home-privacy-politic',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            href={ROUTES_DIGGI.DATA_TREATMENT}
                            text={translate('footer.politics')}
                            target="_blank"
                            download
                            linkColor={LinkColor.WHITE}
                            classes="xs:text-xtiny text-base"
                            hover={false}
                        />
                        <p className="mx-1">&nbsp; • &nbsp;</p>
                        <Link
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'home-suggestions',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            href="#home-page-contact"
                            text=" Sugerencias y reclamos"
                            onClick={handleScrollContact}
                            linkColor={LinkColor.WHITE}
                            classes="xs:text-xtiny text-base"
                            hover={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
