import React from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { RootState } from '@redux/rootReducer';
import {
    clearSession,
    setLoginModal,
    setModalLoginResponseWithoutActivePlans,
    setModalLoginResponseWithoutAnyPlans,
    setModalLoginResponseWithoutElectronicDocuments,
} from '@redux/session/actions';
import { setModalRedirectPlans } from '@redux/menu/actions';
import { ISetModalRedirectPlans } from '@redux/menu/types';
import { SectionsHash } from '@pages/home/components/landing-home-diggipymes/constants/sections';
import { IGenericRecord } from '@models/GenericRecord';
import { HOME_INFORMATION } from '@information-texts/Home';
import { TitleButtons } from '@constants/Buttons';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import {
    MODAL_LOGIN_RESPONSE_ACTIVE,
    MODAL_LOGIN_RESPONSE_ANY,
    MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS,
    TYPE_MODAL_LOGIN,
    TYPE_MODAL_REDIRECT_LANDING,
    MODAL_REDIRECT_PLANS,
} from '.';
import './LoginModals.scss';

const LoginModals: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        accessToken,
        modalLoginResponseWithoutActivePlans,
        modalLoginResponseWithoutAnyPlans,
        modalRedirectPlans,
        modalLoginResponseWithoutElectronicDocuments,
    } = useSelector(({ session, menu }: RootState) => ({
        ...session,
        ...menu,
    }));

    const getModalType = (): string | null => {
        if (modalLoginResponseWithoutActivePlans) return MODAL_LOGIN_RESPONSE_ACTIVE;
        if (modalLoginResponseWithoutAnyPlans) return MODAL_LOGIN_RESPONSE_ANY;
        if (modalLoginResponseWithoutElectronicDocuments) return MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS;
        return null;
    };

    const modalType = getModalType();

    const handleCloseModal = (): void => {
        if (modalType === MODAL_LOGIN_RESPONSE_ACTIVE) {
            dispatch(setModalLoginResponseWithoutActivePlans());
        } else if (modalType === MODAL_LOGIN_RESPONSE_ANY) {
            dispatch(setModalLoginResponseWithoutAnyPlans());
        } else if (modalType === MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS) {
            dispatch(setModalLoginResponseWithoutElectronicDocuments());
            document.getElementById(SectionsHash.MEMBERSHIPS)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleRedirect = (type: string): void => {
        if (type === TYPE_MODAL_LOGIN) {
            handleCloseModal();
            dispatch(setLoginModal());
            document.getElementById(SectionsHash.MEMBERSHIPS)?.scrollIntoView({ behavior: 'smooth' });
        }

        if (type === TYPE_MODAL_REDIRECT_LANDING && accessToken) {
            dispatch(setModalRedirectPlans());
            dispatch(clearSession());
            history.push(getRoute(Routes.HOME));
            const elementHeader = document.querySelector('*');
            elementHeader?.classList.remove('screen-scroll-smooth');
            elementHeader?.classList.add('screen-smooth-logout');
        }
    };

    const getModalMessage = (): IGenericRecord | string => {
        if (modalRedirectPlans) return MODAL_REDIRECT_PLANS;

        switch (modalType) {
            case MODAL_LOGIN_RESPONSE_ACTIVE:
                return HOME_INFORMATION.MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS;
            case MODAL_LOGIN_RESPONSE_ANY:
                return HOME_INFORMATION.MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS;
            case MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS:
                return HOME_INFORMATION.MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS;
            default:
                return '';
        }
    };

    const getModalClass = (): string => {
        if (modalRedirectPlans) return 'modal--container__small';
        if (modalLoginResponseWithoutElectronicDocuments) return 'modal--container__big';
        return 'modal--container__base';
    };

    const modalClasses = `modal--container ${getModalClass()}`;

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.HOME,
                submodule: `${ModuleApp.MODALS}-login`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={modalRedirectPlans || !!modalType}
            showModal={(): ISetModalRedirectPlans | void =>
                modalRedirectPlans ? dispatch(setModalRedirectPlans()) : handleCloseModal()
            }
            closeIcon={false}
            classesWrapper={modalClasses}
            classesModal={modalClasses}
        >
            <div className="modal--container__info">
                <div className="flex flex-col items-center justify-center mb-2 text-center">
                    <Icon
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: `${ModuleApp.MODALS}-login`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        name="triangleInfoMulticolor"
                        className="modal--container__icon"
                        alt="info-modal"
                    />
                    <h3 className={`${modalRedirectPlans ? 'my-1' : 'my-3'} text-xl font-allerbold leading-xl text-blue`}>
                        {modalType === MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS
                            ? 'Plan vencido documentos electrónicos'
                            : 'Información'}
                    </h3>
                </div>
                <div className="text-base text-center font-aller leading-base text-gray-dark">{getModalMessage()}</div>
            </div>
            <div className="flex justify-center mt-3 gap-7">
                {modalType !== MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS && (
                    <Button
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: `${ModuleApp.MODALS}-login`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text={TitleButtons.BACK}
                        onClick={(): ISetModalRedirectPlans | void =>
                            modalRedirectPlans ? dispatch(setModalRedirectPlans()) : handleCloseModal()
                        }
                        classes="m-auto shadow-templateDesign"
                    />
                )}
                <Button
                    id={generateId({
                        module: ModuleApp.HOME,
                        submodule: `${ModuleApp.MODALS}-login`,
                        action: modalType === MODAL_LOGIN_RESPONSE_ACTIVE ? ActionElementType.RENEW : ActionElementType.ACCEPT,
                        elementType: ElementType.BTN,
                    })}
                    text={
                        modalRedirectPlans
                            ? TitleButtons.ACCEPT
                            : modalType === MODAL_LOGIN_RESPONSE_ACTIVE
                            ? TitleButtons.RENEW
                            : TitleButtons.ACCEPT
                    }
                    onClick={(): void => handleRedirect(modalRedirectPlans ? TYPE_MODAL_REDIRECT_LANDING : TYPE_MODAL_LOGIN)}
                    classes="m-auto shadow-templateDesign"
                />
            </div>
        </ModalCustom>
    );
};

export default LoginModals;
