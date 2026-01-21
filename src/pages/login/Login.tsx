import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { ModalType } from '@components/modal-custom/ModalCustom';
import { ModalCustom } from '@components/modal-custom';
import { Link, Button, LinkColor } from '@components/button';
import { TextInput, PasswordInput } from '@components/input';
import { Icon } from '@components/icon';
import { validateEmail } from '@utils/Validation';
import { isCorrectResponse } from '@utils/Response';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { recoverPassword } from '@redux/recover-password/actions';
import {
    clearErrors,
    clearAttempts,
    login,
    setLoginModal,
    setCreateAccountModal,
    failedSession,
    validateMigrationAccount,
    setAccountCreatedModal,
} from '@redux/session/actions';
import { RECOVER_PASSWORD_INFORMATION } from '@information-texts/RecoverPassword';
import { PATHS, Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { UNAUTHORIZED } from '@constants/StatusCodes';
import { AGAIN_LATER, REQUIRED_FIELD } from '@constants/FieldsValidation';
import { hideRecaptchaEmailOrTests, ILoginProps } from '.';
import './Login.scss';

/**
 * Login and recover password view
 *
 * @param props
 * @returns Element with the login or recover password view, it changes according to the isRecoverPassword status.
 */

const Login: React.FC<ILoginProps> = ({ handleOpenModalMigration }) => {
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isRecoverPassword, setIsRecoverPassword] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string>('');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [textResetPass, setTextResetPass] = useState('');
    const showRecaptcha = hideRecaptchaEmailOrTests(loginData.email);
    const [requiredField, setRequiredField] = useState({
        email: false,
        password: false,
        text: '',
        captcha: false,
    });

    const dispatch = useDispatch();
    const { error, accessToken, loginModal = false } = useSelector((state: RootState) => state.session);
    const { response } = useSelector((state: RootState) => state.recoverPassword);
    const { loader } = useSelector((state: RootState) => state.loader);
    const emailReset = RECOVER_PASSWORD_INFORMATION(textResetPass);

    useEffect(() => {
        dispatch(clearAttempts());
        recaptchaRef.current && recaptchaRef.current.reset();
    }, []);

    useEffect(() => {
        if (accessToken && loginModal) {
            dispatch(setLoginModal());
            clearDataState();
        }
    }, [accessToken]);

    useEffect(() => {
        if (!loginModal) {
            setIsRecoverPassword(false);
            clearDataState();
        }
    }, [loginModal]);

    useEffect(() => {
        if (response) {
            if (response === UNAUTHORIZED || isCorrectResponse(Number(response))) {
                dispatch(clearErrors());
                return successModal();
            } else {
                dispatch(clearErrors());
                return setRequiredField({
                    ...requiredField,
                    email: true,
                    text: AGAIN_LATER,
                });
            }
        }
    }, [response]);

    const successModal = (): void => {
        if (!loader) {
            return dispatch(setLoginModal()), setShowSuccessModal(!showSuccessModal);
        }
    };

    const clearDataState = (): void => {
        setTextResetPass(loginData.email);
        setLoginData({ email: '', password: '' });
        setRequiredField({
            email: false,
            password: false,
            captcha: false,
            text: '',
        });
        dispatch(failedSession(''));
        setRecaptchaValue('');
        resetRecaptcha();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(clearErrors());

        setRequiredField({
            ...requiredField,
            [e.target.name]: false,
        });

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === 'email' && e.target.value !== '') {
            if (!validateEmail(e.target.value)) {
                setRequiredField({
                    ...requiredField,
                    email: true,
                    text: '*Ingrese un email válido',
                });
            }
        }
    };

    const sendData = async (): Promise<void> => {
        const { email, password } = loginData;

        setRequiredField({
            email: false,
            password: false,
            captcha: false,
            text: '',
        });

        if (!email || !password || !recaptchaValue) {
            setRequiredField({
                email: !email,
                password: !password,
                captcha: !recaptchaValue,
                text: '*Campo obligatorio',
            });
            resetRecaptcha();
        }

        if (email && !validateEmail(email)) {
            setRequiredField({
                email: true,
                password: !password,
                captcha: !recaptchaValue,
                text: '*Ingrese un email válido',
            });
            resetRecaptcha();
        }

        if (isRecoverPassword && email && validateEmail(email)) {
            dispatch(recoverPassword({ email }));
            if (response && response !== 200) {
                return setRequiredField({
                    ...requiredField,
                    email: true,
                    text: AGAIN_LATER,
                });
            }
        }
        if (!recaptchaValue && showRecaptcha) {
            resetRecaptcha();
            return;
        }

        if (email && password && validateEmail(email)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(validateMigrationAccount(email));

            if (!response) {
                handleOpenModalMigration();
                dispatch(setLoginModal());
                return;
            }
            dispatch(login({ email, password, recaptchaValue }, PATHS[Routes.HOME].route));
            resetRecaptcha();
        }
    };

    const resetRecaptcha = (): void => {
        recaptchaRef.current && recaptchaRef.current.reset();
        setRecaptchaValue('');
    };

    return (
        <>
            <ModalType
                id={generateId({
                    module: ModuleApp.LOGIN,
                    submodule: 'recover-password-modal',
                    action: ActionElementType.RECOVERY,
                    elementType: ElementType.MDL,
                })}
                type="info"
                textButton="Siguiente"
                show={showSuccessModal}
                showModal={(): void => {
                    setShowSuccessModal(!showSuccessModal);
                    clearDataState();
                    setTextResetPass('');
                }}
                title={emailReset.TITLE}
                text={emailReset.DESCRIPTION}
                classesWrapper="min-w-login modal--recover-password"
                classesModal="min-w-login modal--recover-password"
            />
            <ModalCustom
                id={generateId({
                    module: ModuleApp.LOGIN,
                    submodule: 'modal',
                    action: ActionElementType.CONTAINER,
                    elementType: ElementType.MDL,
                })}
                show={loginModal}
                showModal={(): void => dispatch(setLoginModal())}
                classesWrapper="modal--login modal--full"
                classesModal="xs:shadow-none modal--login modal--full relative xs:bg-white"
                closeIcon={false}
                removeMinWidth
            >
                <Icon
                    id={generateId({
                        module: ModuleApp.LOGIN,
                        submodule: 'modal-icon',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.ICO,
                    })}
                    name="closeBlue"
                    onClick={(): void => {
                        dispatch(setLoginModal());
                    }}
                    className="cursor-pointer icon-closeLogin"
                    alt="close-modal"
                />
                <div className="flex flex-col justify-center m-auto w-85 xs:w-72">
                    <h1
                        id={generateId({
                            module: ModuleApp.LOGIN,
                            submodule: 'modal-title',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="mb-2 text-xl font-allerbold text-blue xs:text-center xs:mt-4"
                    >
                        {isRecoverPassword ? 'Recuperar contraseña' : 'Iniciar sesión'}
                    </h1>
                    <p className="mb-4 text-left text-tiny text-blue">Los campos marcados con (*) son obligatorios.</p>
                    {isRecoverPassword && (
                        <p className="text-sm mb-7 text-blue">
                            Escriba el correo electrónico asociado a su cuenta de {PRODUCT_NAME}, se le enviará un enlace para
                            recuperar su contraseña.
                        </p>
                    )}
                    <TextInput
                        id={generateId({
                            module: ModuleApp.LOGIN,
                            submodule: 'email',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="email"
                        labelText={isRecoverPassword ? '*Confirmar correo electrónico:' : '*Correo electrónico:'}
                        classesWrapper="w-73 mb-4.55 xs:w-72 m-auto"
                        placeholder="Correo electrónico"
                        value={loginData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            handleChange(e);
                        }}
                        required={error ? !!error : requiredField.email}
                        requiredText={requiredField.text}
                        limitCharacters={false}
                    />
                    {!isRecoverPassword && (
                        <>
                            <PasswordInput
                                id={generateId({
                                    module: ModuleApp.LOGIN,
                                    submodule: 'password',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="password"
                                labelText="*Contraseña:"
                                placeholder="*******"
                                classesWrapper="w-73 xs:w-72 m-auto"
                                value={loginData.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    handleChange(e);
                                }}
                                required={error ? !!error : requiredField.password}
                                requiredText={error ? error : '*Campo obligatorio'}
                            />
                            <Link
                                id={generateId({
                                    module: ModuleApp.LOGIN,
                                    submodule: 'url-recover-password',
                                    action: ActionElementType.REDIRECT,
                                    elementType: ElementType.LNK,
                                })}
                                linkColor={LinkColor.PURPLE}
                                href="#"
                                text="Recuperar contraseña"
                                classes="text-tiny text-right mt-2 mb-4 w-32 self-end"
                                onClick={(): void => {
                                    clearDataState();
                                    setIsRecoverPassword(true);
                                }}
                            />
                            {showRecaptcha && (
                                <>
                                    <ReCAPTCHA
                                        id={generateId({
                                            module: ModuleApp.LOGIN,
                                            submodule: 'recaptcha',
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        ref={recaptchaRef}
                                        sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                                        onChange={(token: string | null): void => setRecaptchaValue(token ?? '')}
                                        className={`${requiredField.captcha ? 'border-purple  border-1' : ''} m-auto`}
                                    />
                                    {requiredField.captcha && (
                                        <label className="self-end text-tiny text-purple mr-5.5 text-right">
                                            {REQUIRED_FIELD}
                                        </label>
                                    )}
                                </>
                            )}
                            <Button
                                id={generateId({
                                    module: ModuleApp.LOGIN,
                                    submodule: 'next-button',
                                    action: ActionElementType.SUBMIT,
                                    elementType: ElementType.BTN,
                                })}
                                text="Siguiente"
                                classes="xs:inline xs:w-full my-4 mx-auto"
                                onClick={(): Promise<void> => sendData()}
                            />
                            <p className="m-auto text-right text-tiny">
                                Si todavía no tiene una cuenta, &nbsp;
                                <Link
                                    id={generateId({
                                        module: ModuleApp.LOGIN,
                                        submodule: 'url-create-account',
                                        action: ActionElementType.REDIRECT,
                                        elementType: ElementType.LNK,
                                    })}
                                    linkColor={LinkColor.PURPLE}
                                    href="#"
                                    onClick={(): void => {
                                        dispatch(setCreateAccountModal());
                                        dispatch(setLoginModal());
                                    }}
                                    text="haga click aquí"
                                    classes="text-tiny"
                                />
                            </p>
                            <p className="mx-6 mt-4 text-center text-tiny">
                                Si usted quiere comprar un módulo de {PRODUCT_NAME} y tiene cuenta creada,&nbsp;
                                <Link
                                    id={generateId({
                                        module: ModuleApp.LOGIN,
                                        submodule: 'url-account-created',
                                        action: ActionElementType.REDIRECT,
                                        elementType: ElementType.LNK,
                                    })}
                                    linkColor={LinkColor.PURPLE}
                                    href="#"
                                    onClick={(): void => {
                                        dispatch(setAccountCreatedModal());
                                        dispatch(setLoginModal());
                                    }}
                                    text="haga click aquí"
                                    classes="text-tiny"
                                />
                            </p>
                        </>
                    )}
                    <div className={`flex flex-row flex-wrap ${isRecoverPassword ? 'justify-between' : 'justify-center'}`}>
                        <Button
                            id={generateId({
                                module: ModuleApp.LOGIN,
                                submodule: 'modal-back',
                                action: ActionElementType.BACK,
                                elementType: ElementType.BTN,
                            })}
                            text="Atrás"
                            classes={`${isRecoverPassword ? 'block' : 'sm:hidden'} xs:inline mt-4 xs:mr-2`}
                            background={!isRecoverPassword ? 'gray-light' : 'blue'}
                            onClick={
                                isRecoverPassword
                                    ? (): void => {
                                          clearDataState();
                                          setIsRecoverPassword(false);
                                      }
                                    : (): void => {
                                          dispatch(setLoginModal());
                                      }
                            }
                        />
                        {isRecoverPassword && (
                            <Button
                                id={generateId({
                                    module: ModuleApp.LOGIN,
                                    submodule: 'modal-next',
                                    action: ActionElementType.NEXT,
                                    elementType: ElementType.BTN,
                                })}
                                text="Siguiente"
                                classes="xs:inline mt-4 mx-auto"
                                onClick={(): Promise<void> => sendData()}
                            />
                        )}
                    </div>
                </div>
            </ModalCustom>
        </>
    );
};

export default Login;
