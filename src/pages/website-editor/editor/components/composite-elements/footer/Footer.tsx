import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { ElementOption, StyleKey } from '@models/WebsiteNode';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import Img from '@pages/website-editor/editor/components/Img';
import { RootState } from '@redux/rootReducer';
import { Link, SocialNetworks } from './components';
import { LOGO } from '../../element-editor';
import { DEFAULT_BUTTON_TEXT } from '../header';
import { DEFAULT_TOP_FOOTER, FOOTER_DATA_OPTION, FooterWrapper } from '.';
import './Footer.scss';

export const Footer: React.FC<IElementProps> = ({ data, styleKey }) => {
    const {
        company: { information },
    } = useSelector(({ company }: RootState) => ({
        company,
    }));
    const { option } = data;
    const item = FOOTER_DATA_OPTION[option];
    const mobile: boolean = styleKey === StyleKey.MobileStyle;

    const logoText = information?.name || item?.logo?.text;

    return (
        <FooterWrapper
            style={{ ...data.style, top: (data.style.top || 0) < DEFAULT_TOP_FOOTER ? DEFAULT_TOP_FOOTER : data.style.top }}
            className={`footer ${mobile ? 'footer-mobile' : ''}`}
        >
            {option === ElementOption.One && (
                <>
                    <div className="footer__logo">
                        {data?.setting?.logo ? (
                            <Img className="h-full" src={data?.setting?.logo} alt={LOGO} />
                        ) : (
                            <p className={`footer__logo-text ${mobile ? 'footer-mobile__logo-text' : ''}`}>{logoText}</p>
                        )}
                    </div>
                    <Link mobile={mobile} links={item.links} />
                    <div style={{ background: data?.style?.bgColor?.background }} className="footer__container">
                        <p className="footer__container-description footer__container-text">
                            {data?.setting?.description ||
                                'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                        </p>
                        <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                        <p className="footer__container-politic">
                            <span className="underline">{item.container.politic.privacy}</span> -
                            <span className="underline"> {item.container.politic.conditions}</span> -
                            <span> {item.container.politic.rights}</span>
                        </p>
                        {data?.setting?.includeContactButton && (
                            <button className={`footer__container-contact ${mobile ? 'footer-mobile__container-contact' : ''}`}>
                                {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                            </button>
                        )}
                    </div>
                </>
            )}

            {option === ElementOption.Two && (
                <>
                    <div style={{ background: data?.style?.bgColor?.background }} className="footer__container">
                        <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                        <p className="footer__container-description footer__container-text">
                            {data?.setting?.description ||
                                'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                        </p>
                        <p className="footer__container-politic">
                            <span className="underline">{item.container.politic.privacy}</span> -
                            <span className="underline"> {item.container.politic.conditions}</span> -
                            <span> {item.container.politic.rights}</span>
                        </p>
                        {data?.setting?.includeContactButton && (
                            <button className={`footer__container-contact ${mobile ? 'footer-mobile__container-contact' : ''}`}>
                                {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                            </button>
                        )}
                    </div>
                </>
            )}

            {option === ElementOption.Three && (
                <>
                    <div
                        style={{ background: data?.style?.bgColor?.background }}
                        className={`footer__container-three ${mobile ? 'footer-mobile__container-three' : ''}`}
                    >
                        <div
                            className={`footer__container-three-social ${mobile ? 'footer-mobile__container-three-social' : ''}`}
                        >
                            {data?.setting?.socialNetworks && (
                                <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                            )}
                            {mobile && (
                                <p className="footer__container-description footer__container-three-descriptions">
                                    {data?.setting?.description ||
                                        'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                                </p>
                            )}
                            {!mobile && data?.setting?.includeContactButton && (
                                <button className="footer__container-three-contact">
                                    {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                                </button>
                            )}
                        </div>
                        {mobile && data?.setting?.includeContactButton && (
                            <button className="footer__container-three-contact footer-mobile__container-three-contact">
                                {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                            </button>
                        )}
                        <div className={`footer__container-three-text ${mobile ? 'footer-mobile__container-three-text' : ''}`}>
                            {!mobile && (
                                <p className="footer__container-description footer__container-three-description">
                                    {data?.setting?.description ||
                                        'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                                </p>
                            )}

                            <p className="footer__container-three-politics">
                                <span className="underline">{item.container.politic.privacy}</span> -
                                <span className="underline"> {item.container.politic.conditions}</span>
                                &nbsp; -<span> {item.container.politic.rights}</span>
                            </p>
                        </div>
                    </div>
                </>
            )}

            {option === ElementOption.Four && (
                <>
                    <div
                        style={{ background: data?.style?.bgColor?.background }}
                        className={`footer__container-four ${mobile ? 'footer-mobile__container-four' : ''}`}
                    >
                        <div className={`footer__container-four-social ${mobile ? 'footer-mobile__container-four-social' : ''}`}>
                            {data?.setting?.logo ? (
                                <img className="my-4 mr-4 rounded-lg w-60 max-h-48" src={data?.setting?.logo} alt={LOGO} />
                            ) : logoText ? (
                                <p
                                    className={`footer__logo-text my-4.5 text-white ${mobile ? 'footer-mobile__logo-text' : ''}`}
                                    style={{ color: data?.style?.description?.color }}
                                >
                                    {logoText}
                                </p>
                            ) : (
                                <img
                                    className="my-4 mr-4 rounded-lg w-60"
                                    src={item.container.image.path}
                                    alt={item.container.image.alt}
                                />
                            )}

                            <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                            {!mobile && data?.setting?.includeContactButton && (
                                <button className="footer__container-four-contact">
                                    {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                                </button>
                            )}
                        </div>
                        {mobile && (
                            <p className="footer__container-description footer__container-four-description">
                                {data?.setting?.description ||
                                    'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                            </p>
                        )}
                        {mobile && data?.setting?.includeContactButton && (
                            <button className="footer__container-three-contact footer-mobile__container-three-contact">
                                {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                            </button>
                        )}
                        <div className={`footer__container-four-text ${mobile ? 'footer-mobile__container-four-text' : ''}`}>
                            {!mobile && (
                                <p className="footer__container-description footer__container-four-description">
                                    {data?.setting?.description ||
                                        'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                                </p>
                            )}
                            <p className="footer__container-four-politics">
                                <span className="underline">{item.container.politic.privacy}</span> -
                                <span className="underline"> {item.container.politic.conditions}</span>
                                &nbsp; -<span> {item.container.politic.rights}</span>
                            </p>
                        </div>
                    </div>
                </>
            )}

            {option === ElementOption.Five && (
                <>
                    <div
                        style={{ background: data?.style?.bgColor?.background }}
                        className={`footer__container-five ${mobile ? 'footer-mobile__container-five' : ''}`}
                    >
                        <div className={`footer__container-five-top ${mobile ? 'footer-mobile__container-five-top' : ''}`}>
                            <div
                                className={`footer__container-five-image ${mobile ? 'footer-mobile__container-five-image' : ''}`}
                            >
                                {data?.setting?.logo ? (
                                    <img className="my-4 mr-4 rounded-lg w-60 max-h-48" src={data?.setting?.logo} alt={LOGO} />
                                ) : logoText ? (
                                    <p
                                        className={`footer__logo-text text-white my-4.5 ${
                                            mobile ? 'footer-mobile__logo-text' : ''
                                        }`}
                                        style={{ color: data?.style?.description?.color }}
                                    >
                                        {logoText}
                                    </p>
                                ) : (
                                    <img
                                        className="my-4 mr-4 rounded-lg w-60"
                                        src={item.container.image.path}
                                        alt={item.container.image.alt}
                                    />
                                )}
                                <div className="w-45">
                                    {item?.container?.titles?.map((title: string) => (
                                        <p key={uuid()} className="leading-6 text-white footer__links-item">
                                            {title}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className={`footer__container-five-form ${mobile ? 'footer-mobile__container-five-form' : ''}`}>
                                <div
                                    className={`footer__container-five-form-text ${
                                        mobile ? 'footer-mobile__container-five-form-text' : ''
                                    }`}
                                >
                                    <label
                                        className={`text-center text-white font-aller mb-2.5 ${mobile ? 'text-tiny' : ''}`}
                                        htmlFor="input-form"
                                    >
                                        {item.container.contactButton.title}
                                    </label>
                                    <input
                                        id="input-form"
                                        type="text"
                                        placeholder={data?.setting?.buttonPlaceholderText || 'Tu correo'}
                                    />
                                </div>
                                <button
                                    className={`footer__container-five-contact ${
                                        mobile ? 'footer-mobile__container-five-contact' : ''
                                    }`}
                                >
                                    {data?.setting?.buttonActionText || item.container.contactButton.text}
                                </button>
                            </div>
                        </div>
                        <div className={`footer__container-five-bottom ${mobile ? 'footer-mobile__container-five-bottom' : ''}`}>
                            <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                            <div className={`footer__container-five-text ${mobile ? 'footer-mobile__container-five-text' : ''}`}>
                                <div
                                    className={`footer__container-five-text ${
                                        mobile ? 'footer-mobile__container-five-text' : ''
                                    }`}
                                >
                                    <p className="footer__container-description footer__container-five-description">
                                        {data?.setting?.description ||
                                            'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                                    </p>
                                </div>
                                <p className="footer__container-five-politics">
                                    <span className="underline">{item.container.politic.privacy}</span>
                                    &nbsp; -
                                    <span className="underline">
                                        &nbsp;
                                        {item.container.politic.conditions}
                                    </span>
                                    &nbsp; -<span> {item.container.politic.rights}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {option === ElementOption.Six && (
                <>
                    <div
                        style={{ background: data?.style?.bgColor?.background }}
                        className={`footer__container-six ${mobile ? 'footer-mobile__container-six' : ''}`}
                    >
                        <div className={`footer__container-six-top ${mobile ? 'footer-mobile__container-six-top' : ''}`}>
                            <div className={`footer__container-six-image ${mobile ? 'footer-mobile__container-six-image' : ''}`}>
                                {data?.setting?.logo ? (
                                    <img className="my-4 mr-4 rounded-lg w-60 max-h-48" src={data?.setting?.logo} alt={LOGO} />
                                ) : logoText ? (
                                    <p
                                        className={`footer__logo-text text-white my-4.5 ${
                                            mobile ? 'footer-mobile__logo-text' : ''
                                        }`}
                                        style={{ color: data?.style?.description?.color }}
                                    >
                                        {logoText}
                                    </p>
                                ) : (
                                    <img
                                        className="my-4 mr-4 rounded-lg w-60"
                                        src={item.container.image.path}
                                        alt={item.container.image.alt}
                                    />
                                )}
                            </div>
                            <div className="footer__container-six-text">
                                <p className="footer__container-description footer__container-six-description">
                                    {data?.setting?.description ||
                                        'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)'}
                                </p>
                            </div>
                            <div className="footer__container-six-social">
                                <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                                {data?.setting?.includeContactButton && (
                                    <button
                                        className={`footer__container-six-contact ${
                                            mobile ? 'footer-mobile__container-six-contact' : ''
                                        }`}
                                    >
                                        {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className={`footer__container-six-politics ${mobile ? 'mt-4.5' : ''}`}>
                            <span className="underline">{item.container.politic.privacy}</span> -
                            <span className="underline"> {item.container.politic.conditions}</span> -
                            <span> {item.container.politic.rights}</span>
                        </p>
                    </div>
                </>
            )}
        </FooterWrapper>
    );
};
