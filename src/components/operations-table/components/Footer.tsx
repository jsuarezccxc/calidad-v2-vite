import React from 'react';
import { useHistory } from 'react-router';
import { Link, LinkColor } from '@components/button';
import { urls } from '@api/urls';
import mail from '@assets/images/sidebar/mail.svg';
import logo from '@assets/images/sidebar/footer-logo.svg';
import arrow from '@assets/images/sidebar/footer-arrow.svg';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { CURRENT_YEAR, ROUTE_CONSULTANCY } from '..';

export const Footer: React.FC = () => {
    const history = useHistory();
    return (
        <footer
            id={generateId({
                module: ModuleApp.OPERATION_TABLE,
                submodule: ModuleApp.FOOTER,
                action: ActionElementType.CONTAINER,
                elementType: ElementType.CONT,
            })}
            className="sidebar-footer"
        >
            <button
                id={generateId({
                    module: ModuleApp.OPERATION_TABLE,
                    submodule: `${ModuleApp.FOOTER}-personalized-consultancy`,
                    action: ActionElementType.REDIRECT,
                    elementType: ElementType.BTN,
                })}
                className="sidebar-footer__button"
                type="button"
                onClick={(): void => {
                    history.push(ROUTE_CONSULTANCY);
                }}
            >
                Comunícate con un experto
                <img src={mail} alt="Mail" className="icon--mail" />
            </button>
            <div className="sidebar-footer__terms">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="icon-company" />
                    <hr className="sidebar-footer__line" />
                    <img src={arrow} alt="Arrow" className="icon-product" />
                    <hr className="sidebar-footer__line" />
                    <small className="sidebar-footer__copyright">
                        Esta página y todo su contenido es propiedad de CCxC. {CURRENT_YEAR} ©
                    </small>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Link
                        id={generateId({
                            module: ModuleApp.OPERATION_TABLE,
                            submodule: `${ModuleApp.FOOTER}-support`,
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.LNK,
                        })}
                        classes="sidebar-footer__link text-blue"
                        href={ROUTE_CONSULTANCY}
                        text="Soporte"
                    />
                    <hr className="sidebar-footer__line sidebar-footer__line--small" />
                    <Link
                        id={generateId({
                            module: ModuleApp.OPERATION_TABLE,
                            submodule: `${ModuleApp.FOOTER}-terms-conditions`,
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.LNK,
                        })}
                        text="Términos y condiciones"
                        href={urls.footer.terms}
                        linkColor={LinkColor.BLUE}
                        classes="sidebar-footer__link"
                        target="_blank"
                        download
                    />
                </div>

                <a className="text-center sidebar-footer__link" rel="noopener noreferrer" target="_blank" href={urls.footer.sic}>
                    Superintendencia de industria y comercio
                </a>
            </div>
        </footer>
    );
};
