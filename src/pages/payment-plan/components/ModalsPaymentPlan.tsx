import React from 'react';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { ModalType } from '@components/modal';
import { Button } from '@components/button';
import {
    ACTIVE_RENOVATION,
    AUTOMATIC_RENOVATION,
    CANCEL_RENOVATION,
    CONFIRM_CANCEL_AUTORENOVATION,
    CONFIRM_CANCEL_RENOVATION,
    CONTINUE_RENOVATION,
    EXPIRATION_PLAN,
    EXPIRATION_PLAN_TODAY,
    EXPIRED_PLAN,
    REACTIVATE_PLAN,
    REMEMBER,
    RENOVATION_PLAN,
    SUCCESS_ACTIVATION,
    SUCCESS_CANCEL_PLAN,
    SUCCESS_REACTIVATE,
    THANKS_DIGGI,
} from '@information-texts/PaymentPlans';
import { generateId, ActionElementType, ElementType, ModuleApp } from '@utils/GenerateId';
import { getDateFromUnix } from '@utils/Date';
import { IModalPaymentPlan } from '..';

export const ConfirmCancelPlan: React.FC<IModalPaymentPlan> = ({ show, showModal, handleMainButton, handleLeftButton, data }) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: `${ModuleApp.MODALS}-confirm-cancel-plan`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="canceled-plan"
        classesModal="canceled-plan"
        closeIcon={false}
    >
        <div className="canceled-modal">
            <div className="canceled-modal__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-confirm-cancel-plan`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="alertMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{CONFIRM_CANCEL_RENOVATION.TITLE(data?.nameModule || '')}</label>
            </div>
            <div className="canceled-modal__body">
                <label className="subtitle--modal">{CONFIRM_CANCEL_RENOVATION.SUBTITLE(data?.nameModule || '')}</label>
                <div className="description--canceled">
                    {CONFIRM_CANCEL_RENOVATION.FIRST_PARAGRAPH(
                        data?.nameModule || '',
                        getDateFromUnix(data?.expiration_date).formattedDate
                    )}
                </div>
                <div className="description--canceled">{CONFIRM_CANCEL_RENOVATION.SECOND_PARAGRAPH}</div>
            </div>
            <div className="canceled-modal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-confirm-cancel-plan`,
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text={CONFIRM_CANCEL_RENOVATION.BUTTON_LEFT}
                    background="gray"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-confirm-cancel-plan`,
                        action: ActionElementType.CONTINUE,
                        elementType: ElementType.BTN,
                    })}
                    text={CONFIRM_CANCEL_RENOVATION.BUTTON_RIGHT}
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const SuccessCancelPlan: React.FC<IModalPaymentPlan> = ({ show, handleMainButton, data }) => (
    <ModalType
        moduleId={`${ModuleApp.PAYMENT_PLANS}-success-cancel-plan`}
        iconName="successMulticolor"
        text={{
            title: SUCCESS_CANCEL_PLAN.TITLE,
            description: (
                <>
                    <p className="w-full text-base text-center text-gray-dark">
                        {SUCCESS_CANCEL_PLAN.DESCRIPTION(getDateFromUnix(data?.expiration_date).formattedDate)}
                    </p>
                    <p className="w-full mt-5 text-base text-center text-gray-dark">{SUCCESS_CANCEL_PLAN.SECOND_DESCRIPTION}</p>
                </>
            ),
        }}
        isChildText
        open={show}
        textButton={SUCCESS_CANCEL_PLAN.BUTTON}
        finalAction={handleMainButton}
    />
);

export const ContinuePlan: React.FC<IModalPaymentPlan> = ({ show, showModal, handleMainButton }) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: `${ModuleApp.MODALS}-continue-plan`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesModal="thanks-diggi"
        classesWrapper="thanks-diggi"
        closeIcon={false}
    >
        <div className="thanks-diggi__content">
            <div className="body--modal">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-continue-plan`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="successMulticolor"
                    classIcon="icon--width"
                />
                <label className="title--modal">{THANKS_DIGGI.TITLE}</label>
            </div>
            <div className="footer--modal">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-continue-plan`,
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={THANKS_DIGGI.BUTTON}
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const RememberRenewal: React.FC<IModalPaymentPlan> = ({ show, showModal, handleMainButton, handleLeftButton, data }) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: `${ModuleApp.MODALS}-remember-renewal`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesModal="remember-modal"
        classesWrapper="remember-modal"
        closeIcon={false}
    >
        <div className="remember-modal__content">
            <div className="title--modal">{REMEMBER.TITLE(data?.nameModule || '')}</div>
            <div className="container__buttons">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-remember-renewal`,
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text={REMEMBER.BUTTON_LEFT}
                    background="gray"
                    classes="px-2.5"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-remember-renewal`,
                        action: ActionElementType.RENEW,
                        elementType: ElementType.BTN,
                    })}
                    text={REMEMBER.BUTTON_RIGHT}
                    classes="px-2.5"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const ConfirmCancelAutoRenewalPlan: React.FC<IModalPaymentPlan> = ({
    show,
    showModal,
    handleMainButton,
    handleLeftButton,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: `${ModuleApp.MODALS}-confirm-cancel-autorenewal-plan`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="cancel-plan-autorenovation"
        classesModal="cancel-plan-autorenovation"
        closeIcon={false}
    >
        <div className="autorenovation">
            <div className="autorenovation__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-confirm-cancel-autorenewal-plan`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="alertMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{CONFIRM_CANCEL_AUTORENOVATION.TITLE}</label>
            </div>
            <div className="autorenovation__body">
                <label className="subtitle--modal">{CONFIRM_CANCEL_AUTORENOVATION.SUBTITLE}</label>
                <div className="description--canceled">{CONFIRM_CANCEL_AUTORENOVATION.DESCRIPTION}</div>
            </div>
            <div className="autorenovation__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-confirm-cancel-autorenewal-plan`,
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text={CONFIRM_CANCEL_AUTORENOVATION.BUTTON_LEFT}
                    background="gray"
                    classes="shadow--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: `${ModuleApp.MODALS}-confirm-cancel-autorenewal-plan`,
                        action: ActionElementType.RENEW,
                        elementType: ElementType.BTN,
                    })}
                    text={CONFIRM_CANCEL_AUTORENOVATION.BUTTON_RIGHT}
                    classes="shadow--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const SuccessCancelAutoRenewalPlan: React.FC<IModalPaymentPlan> = ({ show, handleMainButton }) => (
    <ModalType
        moduleId={`${ModuleApp.PAYMENT_PLANS}-success-cancel-autorenewal-plan`}
        iconName="successMulticolor"
        text={{
            title: CANCEL_RENOVATION.TITLE,
            description: CANCEL_RENOVATION.DESCRIPTION,
        }}
        classTitle="cancel-w-title"
        open={show}
        textButton={CANCEL_RENOVATION.BUTTON}
        finalAction={handleMainButton}
    />
);

export const ContinueAutoRenewalPlan: React.FC<IModalPaymentPlan> = ({ show, handleMainButton }) => (
    <ModalType
        moduleId={`${ModuleApp.PAYMENT_PLANS}-continue-autorenewal-plan`}
        iconName="successMulticolor"
        text={{
            title: CONTINUE_RENOVATION.TITLE,
            description: CONTINUE_RENOVATION.DESCRIPTION,
        }}
        open={show}
        textButton={CONTINUE_RENOVATION.BUTTON}
        finalAction={handleMainButton}
    />
);

export const ActivateRenewal: React.FC<IModalPaymentPlan> = ({ show, showModal, handleMainButton, handleLeftButton }) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'activate-renewal',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesModal="activate-renewal-modal"
        classesWrapper="activate-renewal-modal"
        closeIcon={false}
    >
        <div className="activate-renewal">
            <div className="activate-renewal__header">
                <div className="title--modal">{ACTIVE_RENOVATION.TITLE}</div>
            </div>
            <div className="activate-renewal__body">
                <div className="description--modal">{ACTIVE_RENOVATION.DESCRIPTION}</div>
            </div>
            <div className="activate-renewal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'activate-renewal',
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text={ACTIVE_RENOVATION.BUTTON_LEFT}
                    background="gray"
                    classes="shadow--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'activate-renewal',
                        action: ActionElementType.RENEW,
                        elementType: ElementType.BTN,
                    })}
                    text={ACTIVE_RENOVATION.BUTTON_RIGHT}
                    classes="shadow--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const SuccessActivationRenewal: React.FC<IModalPaymentPlan> = ({ show, handleMainButton, data }) => (
    <ModalType
        moduleId={`${ModuleApp.PAYMENT_PLANS}-success-activation-renewal`}
        iconName="successMulticolor"
        text={{
            title: SUCCESS_ACTIVATION.TITLE,
            description: SUCCESS_ACTIVATION.DESCRIPTION(getDateFromUnix(data?.expiration_date).formattedDate),
        }}
        open={show}
        classTitle="w-86"
        textButton={SUCCESS_ACTIVATION.BUTTON}
        finalAction={handleMainButton}
    />
);

export const RememberReactivatePlan: React.FC<IModalPaymentPlan> = ({
    show,
    showModal,
    handleMainButton,
    handleLeftButton,
    data,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'remember-reactivate-plan',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesModal="automatic-renovation"
        classesWrapper="automatic-renovation"
        closeIcon={false}
    >
        <div className="automatic-renovation__content">
            <div className="title--modal">
                {REACTIVATE_PLAN.TITLE(data?.nameModule || '', getDateFromUnix(data?.expiration_date).formattedDate)}
            </div>
            <div className="container__buttons">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-reactivate-plan',
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text={REACTIVATE_PLAN.BUTTON_LEFT}
                    background="gray"
                    classes="shadow--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-reactivate-plan',
                        action: ActionElementType.RENEW,
                        elementType: ElementType.BTN,
                    })}
                    text={REACTIVATE_PLAN.BUTTON_RIGHT}
                    classes="shadow--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const SuccessReactivatePlan: React.FC<IModalPaymentPlan> = ({ show, showModal, handleMainButton, data }) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'success-reactivate-plan',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="renewal-plan"
        classesModal="renewal-plan"
        closeIcon={false}
    >
        <div className="renewal-plan-modal">
            <div className="renewal-plan-modal__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'success-reactivate-plan',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="successMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{SUCCESS_REACTIVATE.TITLE(data?.nameModule || '')}</label>
            </div>
            <div className="renewal-plan-modal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'success-reactivate-plan',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={SUCCESS_REACTIVATE.BUTTON}
                    background="blue"
                    classes="button--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const RememberAutoRenewalPlan: React.FC<IModalPaymentPlan> = ({
    show,
    showModal,
    handleMainButton,
    handleLeftButton,
    data,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'remember-autorenewal-plan',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesModal="automatic-renovation"
        classesWrapper="automatic-renovation"
        closeIcon={false}
    >
        <div className="automatic-renovation__content">
            <div className="title--modal">
                {AUTOMATIC_RENOVATION.TITLE(data?.nameModule || '', getDateFromUnix(data?.expiration_date)?.formattedDate)}
            </div>
            <div className="description--modal">{AUTOMATIC_RENOVATION.DESCRIPTION}</div>
            <div className="container__buttons">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-autorenewal-plan',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={AUTOMATIC_RENOVATION.BUTTON_LEFT}
                    background="gray"
                    classes="shadow--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-autorenewal-plan',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    text={AUTOMATIC_RENOVATION.BUTTON_RIGHT}
                    classes="shadow--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const ConfirmRenewalPlan: React.FC<IModalPaymentPlan> = ({
    show,
    showModal,
    handleMainButton,
    handleLeftButton,
    data,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'confirm-renewal-plan',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="renewal-plan"
        classesModal="renewal-plan"
        closeIcon={false}
    >
        <div className="renewal-plan-modal">
            <div className="renewal-plan-modal__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'confirm-renewal-plan',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="alertMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{RENOVATION_PLAN.TITLE}</label>
            </div>
            {RENOVATION_PLAN.DESCRIPTION(data?.nameModule || '')}
            <div className="renewal-plan-modal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'confirm-renewal-plan',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={RENOVATION_PLAN.BUTTON_LEFT}
                    background="gray"
                    classes="button--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'confirm-renewal-plan',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    text={RENOVATION_PLAN.BUTTON_RIGHT}
                    classes="button--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const RememberExpirationDays: React.FC<IModalPaymentPlan> = ({
    show,
    showModal,
    handleMainButton,
    handleLeftButton,
    data,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'remember-expiration-days',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="plan-expires"
        classesModal="plan-expires"
        closeIcon={false}
    >
        <div className="plan-expires-modal">
            <div className="plan-expires-modal__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-expiration-days',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="alertMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{EXPIRATION_PLAN.TITLE}</label>
            </div>
            {EXPIRATION_PLAN.DESCRIPTION(data?.nameModule || '', {
                day: getDateFromUnix(data?.expiration_date)?.day,
                month: getDateFromUnix(data?.expiration_date)?.month,
                year: getDateFromUnix(data?.expiration_date)?.year,
            })}
            <div className="plan-expires-modal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-expiration-days',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={EXPIRATION_PLAN.BUTTON_LEFT}
                    background="gray"
                    classes="button--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-expiration-days',
                        action: ActionElementType.RENEW,
                        elementType: ElementType.BTN,
                    })}
                    text={EXPIRATION_PLAN.BUTTON_RIGHT}
                    classes="button--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const RememberExpirationToday: React.FC<IModalPaymentPlan> = ({
    show,
    showModal,
    handleMainButton,
    handleLeftButton,
    data,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'remember-expiration-today',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="plan-expires"
        classesModal="plan-expires"
        closeIcon={false}
    >
        <div className="plan-expires-modal">
            <div className="plan-expires-modal__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-expiration-today',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="alertMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{EXPIRATION_PLAN_TODAY.TITLE}</label>
            </div>
            {EXPIRATION_PLAN_TODAY.DESCRIPTION(data?.nameModule || '', {
                day: getDateFromUnix(data?.expiration_date)?.day,
                month: getDateFromUnix(data?.expiration_date)?.month,
                year: getDateFromUnix(data?.expiration_date)?.year,
            })}
            <div className="plan-expires-modal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-expiration-today',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={EXPIRATION_PLAN_TODAY.BUTTON_LEFT}
                    background="gray"
                    classes="button--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'remember-expiration-today',
                        action: ActionElementType.RENEW,
                        elementType: ElementType.BTN,
                    })}
                    text={EXPIRATION_PLAN_TODAY.BUTTON_RIGHT}
                    classes="button--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);

export const ExpiredPlan: React.FC<IModalPaymentPlan> = ({ show, showModal, handleMainButton, handleLeftButton, data }) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.PAYMENT_PLANS,
            submodule: 'expired-plan',
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={showModal}
        classesWrapper="plan-expires"
        classesModal="plan-expires"
        closeIcon={false}
    >
        <div className="plan-expires-modal">
            <div className="plan-expires-modal__header">
                <Icon
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'expired-plan',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="alertMulticolor"
                    classIcon="icon--style"
                />
                <label className="title">{EXPIRED_PLAN.TITLE}</label>
            </div>
            {EXPIRED_PLAN.DESCRIPTION(data?.nameModule || '')}
            <div className="plan-expires-modal__footer">
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'expired-plan',
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text={EXPIRED_PLAN.BUTTON_LEFT}
                    background="gray"
                    classes="button--style"
                    onClick={handleLeftButton}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'expired-plan',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    text={EXPIRED_PLAN.BUTTON_RIGHT}
                    classes="button--style"
                    onClick={handleMainButton}
                />
            </div>
        </div>
    </ModalCustom>
);
