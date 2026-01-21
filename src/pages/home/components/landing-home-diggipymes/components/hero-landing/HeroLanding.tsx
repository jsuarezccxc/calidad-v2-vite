import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { useLocation } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import { LandingContext } from '@pages/home/context/LandingContext';
import { Button } from '@components/button';
import { SharedModal } from '@components/modal';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DEMO, HASH_QUERY_INDEX } from '.';
import './HeroLanding.scss';

export const HeroLanding: React.FC = () => {
    const { hash } = useLocation();
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const [captchaValue, setCaptchaValue] = useState<string | null>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const { setOpenScheduling } = useContext(LandingContext);

    const queryParam = useMemo(() => new URLSearchParams(hash.split('?')[HASH_QUERY_INDEX]).get(DEMO), [hash]);

    useEffect(() => {
        recaptchaRef.current && recaptchaRef.current.reset();
    }, []);

    useEffect(() => {
        if (queryParam) setOpenScheduling(true);
    }, [queryParam]);

    const handleContinueModal = (): boolean => {
        return !captchaValue;
    };

    const handleOpenModal = (): void => {
        setShowModal(showModal => !showModal);
    };

    return (
        <section className="flex flex-col items-center w-full mt-8 hero-landing">
            <div className="hero-landing__header">
                <h1
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'hero-landing-title',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    className="text-white md:text-5xl xs:text-xl hero-landing__title"
                >
                    El 51.6% de los colombianos compra algo <span className="text-gradient">diggi</span>talmente cada semana
                </h1>
                <div
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'hero-landing-url',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    className="my-8 hero-landing__source text-blue"
                >
                    <span>
                        Fuente:{' '}
                        <a
                            href="https://www.mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/98220:El-19-de-los-internautas-colombianos-compra-y-paga-sus-productos-o-servicios-en-linea"
                            target="_blank"
                            rel="noreferrer"
                            className="hero-landing__source--link"
                        >
                            https://www.mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/98220:El-19-de-los-internautas-colombianos-compra-y-paga-sus-productos-o-servicios-en-linea
                        </a>
                    </span>
                </div>
                <p
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'hero-landing-subtitle',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    className="hero-landing__subtitle"
                >
                    ¡Pásate a <span className="text-gradient">diggi</span> <span className="text-purple">pymes</span>!
                </p>
            </div>
            <div
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'hero-landing-description',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="hero-landing__description-container"
            >
                <div className="hero-landing__description-container--text ">
                    Su administrador <span className="text-gradient">diggi</span>tal bueno, bonito y barato
                </div>
                <p className="hero-landing__description-container--price-text-l1">
                    Desde <span>$16.666</span> pesos
                </p>
                <p className="hero-landing__description-container--price-text-l2">al mes</p>
            </div>
            <div className="hero-landing__buttons-container">
                <Button
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'schedule demo',
                        action: ActionElementType.SUBMIT,
                        elementType: ElementType.BTN,
                    })}
                    text="Agendar demostración"
                    classes="hero-landing__buttons-container--button hero-landing__buttons-container--button-schedule"
                    onClick={handleOpenModal}
                />
            </div>
            {showModal && (
                <SharedModal moduleId={ModuleApp.LANDING} className="captcha-modal" open finalAction={(): void => {}}>
                    <div className="captcha-modal__children">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                            onChange={(token): void => setCaptchaValue(token)}
                        />
                        <div className="captcha-modal__buttons">
                            <Button
                                id={generateId({
                                    module: ModuleApp.LANDING,
                                    submodule: 'schedule demo',
                                    action: ActionElementType.CLOSE,
                                    elementType: ElementType.BTN,
                                })}
                                text="Cerrar"
                                onClick={handleOpenModal}
                            />
                            <Button
                                id={generateId({
                                    module: ModuleApp.LANDING,
                                    submodule: 'schedule demo',
                                    action: ActionElementType.NEXT,
                                    elementType: ElementType.BTN,
                                })}
                                text="Continuar"
                                disabled={handleContinueModal()}
                                onClick={(): void => setOpenScheduling(true)}
                            />
                        </div>
                    </div>
                </SharedModal>
            )}
        </section>
    );
};
