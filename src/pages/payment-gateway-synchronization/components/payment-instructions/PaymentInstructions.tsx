import React, { useEffect, useMemo, useState } from 'react';

// Vite dynamic imports for wompi payment gateway images
const wompiImages = import.meta.glob<{ default: string }>('/src/assets/images/payment-gateway/wompi/*.png', { eager: true });
const getWompiImage = (name: string): string => {
    const path = `/src/assets/images/payment-gateway/wompi/${name}.png`;
    return wompiImages[path]?.default || '';
};
import { useHistory, useLocation } from 'react-router-dom';
import { Routes } from '@constants/Paths';
import { ONE } from '@constants/ElectronicInvoice';
import { ADD_PRODUCT } from '@constants/AssembleProduct';
import { ParamPaymentGateway, SUB_TITLE } from '@constants/PaymentGatewaySynchronization';
import { getRoute } from '@utils/Paths';
import LocalStorage from '@utils/LocalStorage';
import { ModuleApp } from '@utils/GenerateId';
import Character from '@assets/images/character.png';
import useWompiForm from '@pages/payment-gateway-synchronization/hooks/useWompiForm';
import { MODAL_INFORMATION, PAYMENT_INSTRUCTIONS } from '@information-texts/PaymentGatewaySynchronization';
import { Button } from '@components/button';
import { SharedModal } from '@components/modal';
import { TooltipButton } from '@components/tooltip';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PaginatorSteps } from '@components/paginator-steps';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { FormWompi } from '../form';
import { IInstructionsProps, UTILS } from '.';
import { getLocalStorage, routesToSteps } from '..';
import './PaymentInstructions.scss';

export const PaymentInstructions: React.FC<IInstructionsProps> = ({ step, type }) => {
    const [history, { pathname, search }, numberStep] = [useHistory(), useLocation(), Number(step)];
    const [internalStep, setInternalStep] = useState<number>(ONE);

    const paymentInstructions = PAYMENT_INSTRUCTIONS[type];
    const { TITLE, INSTRUCTIONS, ID, ...MoreProps } = paymentInstructions[step];
    const { title, className, ...instruction } = useMemo(() => INSTRUCTIONS[internalStep - ONE] || UTILS.DEFAULT_INSTRUCTION, [
        internalStep,
        step,
    ]);

    const { activeModal, handleModal, ...propsForm } = useWompiForm(ID);

    const isLastPosition = title === UTILS.LAST;

    const replaceURL = (stepNumber: number): string => `${pathname}?type=${type}&step=${stepNumber}`;

    const handleBack = (): void => {
        if (numberStep === ONE) return history.goBack();
        return history.push(replaceURL(numberStep - ONE));
    };

    const handleNext = (): void => {
        if (numberStep < Object.keys(paymentInstructions).length) {
            const { stepComplete, upperType } = getLocalStorage(type);
            const url = `${pathname}${search}`;
            LocalStorage.set(upperType, [...stepComplete, url].join(','));
            return history.push(replaceURL(numberStep + ONE));
        }
        return history.push(`${getRoute(Routes.PRODUCT_DATABASE)}?${ADD_PRODUCT}=true`);
    };

    const switchForm = (type: string): JSX.Element => {
        if (type === ParamPaymentGateway.Wompi) return <FormWompi {...propsForm} isInstructionView />;
        return <>Mercado Pago Proximamente</>;
    };

    useEffect(() => {
        setInternalStep(ONE);
    }, [step]);

    return (
        <>
            {activeModal && <SharedModal open finalAction={handleModal} {...MODAL_INFORMATION[activeModal]} />}
            <BreadCrumb routes={routesToSteps(type)} />
            <Information title={SUB_TITLE} classNameSubContainer="justify-center items-center" classNameTitle="sub-title-pages" />
            <section className="content-instructions">
                <article className="content-instructions__card-title">
                    <h3>{TITLE}</h3>
                </article>
                <article className={`content-instructions__content-img${isLastPosition ? '--step-final' : ''}`}>
                    {!isLastPosition ? (
                        <>
                            <section className="content-instructions__content-img__content-card">
                                <div className="content-instructions__content-img__circle">
                                    <span>
                                        {step}.{internalStep}
                                    </span>
                                </div>
                                <div className="content-instructions__content-img__card-title">{title}</div>
                            </section>
                            <section className="flex gap-x-20 mb-13">
                                {instruction.img && (
                                    <img
                                        src={getWompiImage(instruction.img)}
                                        className={className}
                                        alt="step image"
                                    />
                                )}
                                {instruction.isForm && switchForm(type)}
                            </section>
                        </>
                    ) : (
                        <>
                            <section className="payment-instructions__step-last">
                                <section className="payment-instructions__paragraph">
                                    <h3 className="text-4xl text-blue font-allerbold">¡Felicidades!</h3>
                                    {instruction.description}
                                </section>
                                <img src={Character} alt="Image character" />
                            </section>
                            <Button text={instruction.titleButton} onClick={handleNext} classes={className} />
                        </>
                    )}
                    <section className="content-instructions__content-step-button">
                        <TooltipButton
                            iconName="infoGreen"
                            tooltipProps={{
                                title: 'Paginador:',
                                description: 'Herramienta que le permite avanzar y retroceder en las instrucciones.',
                                iconName: 'infoBlue',
                            }}
                        />
                        <PaginatorSteps
                            data={INSTRUCTIONS}
                            wrapperClassName="mx-auto"
                            currentPage={internalStep}
                            setCurrentPage={setInternalStep}
                        />
                    </section>
                </article>
            </section>
            <PageButtonsFooter
                moduleId={ModuleApp.PAYMENT_GATEWAY_WEBSITE}
                classNameBtnLeft="px-2.5"
                onClickButtonLeft={handleBack}
                titleButtonLeft={MoreProps.TITLE_BUTTON_lEFT}
                onClickButtonRight={handleNext}
                titleButtonRight={MoreProps.TITLE_BUTTON_RIGHT}
                className="payment-instructions__page-buttons-footer"
            />
        </>
    );
};
