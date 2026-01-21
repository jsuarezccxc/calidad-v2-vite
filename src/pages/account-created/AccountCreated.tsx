import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { ModalCustom } from '@components/modal-custom';
import { PasswordInput, TextInput } from '@components/input';
import { Button, Link, LinkColor } from '@components/button';
import { Icon } from '@components/icon';
import {
    accountCreated,
    setCreateAccountModal,
    setAccountCreatedModal,
    setErrorCreateUser,
    setLoginModal,
} from '@redux/session/actions';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { EMAIL } from '@constants/UserManagement';
import { REQUIRED_FIELD } from '@constants/FieldsValidation';
import { hideRecaptchaEmailOrTests } from '@pages/login';
import { validateEmail } from '@utils/Validation';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { INITIAL_DATA, REQUIRED_DATA } from '.';
import './AccountCreated.scss';

const AccountCreated: React.FC<{ accountCreatedModal: boolean }> = ({ accountCreatedModal }) => {
    const dispatch = useDispatch();
    const buttonNext = useRef<HTMLButtonElement | null>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const [recaptchaValue, setRecaptchaValue] = useState<string>('');
    const [user, setUser] = useState<IGenericRecord>(INITIAL_DATA);
    const [requiredField, setRequiredField] = useState<IGenericRecord>(REQUIRED_DATA);
    const [captcha, setCaptcha] = useState({
        error: true,
        validate: false,
    });
    const { error, accessToken } = useSelector(({ session }: RootState) => ({
        ...session,
    }));

    const showRecaptcha = hideRecaptchaEmailOrTests(user.email);

    useEffect(() => {
        setUser(INITIAL_DATA);
        setRequiredField({
            email: {
                error: false,
                text: '',
            },
            password: {
                error: false,
                text: '',
            },
        });
    }, [accountCreatedModal]);

    useEffect(() => {
        if (user !== INITIAL_DATA && accountCreatedModal) {
            validateFields();
        }
    }, [user]);

    const validateField = (field: string, value: IGenericRecord): { error: boolean; text: string } => {
        const commonMsg = '*Campo obligatorio';

        if (field === EMAIL) {
            const isValidEmail = validateEmail(value.email);
            return {
                error: !isValidEmail,
                text: !isValidEmail ? (value.email ? '*Ingrese un email válido' : commonMsg) : '',
            };
        }

        const fieldError = !value[field];
        return {
            error: fieldError,
            text: fieldError ? commonMsg : '',
        };
    };

    const validateFields = (): boolean => {
        const fields = Object.keys(requiredField);
        const updatedFields: IGenericRecord = { ...requiredField };

        fields.forEach(field => {
            const { error, text } = validateField(field, user);
            updatedFields[field].error = error;
            updatedFields[field].text = text;
        });

        setRequiredField(updatedFields);

        return Object.values(updatedFields).some(field => field.error);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        if (name) {
            setUser({
                ...user,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (): Promise<void> => {
        buttonNext?.current && buttonNext.current.blur();

        const validateForm = validateFields();
        setCaptcha({ ...captcha, validate: true });
        recaptchaRef.current && recaptchaRef.current.reset();
        if (!captcha.error && captcha.validate && !validateForm) {
            const { email, password } = user;
            dispatch(accountCreated({ email, password, recaptchaValue }));
        }
    };

    useEffect(() => {
        setCaptcha({
            ...captcha,
            error: !recaptchaValue && showRecaptcha,
        });
    }, [recaptchaValue, user]);

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.ACCOUNT_CREATED,
                submodule: 'modal',
                action: ActionElementType.CONTAINER,
                elementType: ElementType.MDL,
            })}
            show={accessToken ? false : accountCreatedModal}
            showModal={(): void => {
                dispatch(setAccountCreatedModal());
                dispatch(setErrorCreateUser(false));
            }}
            classesWrapper="sm:min-w-login xs:modal--full xs:h-full relative"
            classesModal="sm:min-w-login md:pt-12 p-7.3"
            isTableModal
            closeIcon={false}
        >
            <Icon
                id={generateId({
                    module: ModuleApp.ACCOUNT_CREATED,
                    submodule: 'modal-icon',
                    action: ActionElementType.CLOSE,
                    elementType: ElementType.ICO,
                })}
                name="closeBlue"
                onClick={(): void => {
                    dispatch(setAccountCreatedModal());
                }}
                className="cursor-pointer icon-close"
                alt="close-modal"
            />
            <div className="container-modal">
                <h2
                    id={generateId({
                        module: ModuleApp.ACCOUNT_CREATED,
                        submodule: 'modal-title',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                >
                    Cuenta creada
                </h2>
                <p className="mb-4 text-left text-tiny text-blue">Los campos marcados con (*) son obligatorios.</p>
                <TextInput
                    id={generateId({
                        module: ModuleApp.ACCOUNT_CREATED,
                        submodule: 'email',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="email"
                    labelText="*Correo electrónico:"
                    classesWrapper="w-73 mb-4.55 m-auto xs:w-72"
                    placeholder="Correo electrónico"
                    value={user.email}
                    onChange={handleChange}
                    required={error || requiredField.email.error}
                    requiredText={requiredField.email.text}
                    limitCharacters={false}
                />
                <PasswordInput
                    id={generateId({
                        module: ModuleApp.ACCOUNT_CREATED,
                        submodule: 'password',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    reference={passwordRef}
                    name="password"
                    labelText="*Contraseña:"
                    placeholder="*******"
                    classesWrapper="w-73 xs:w-72 mb-4.55 m-auto"
                    value={user.password}
                    onChange={handleChange}
                    required={error || requiredField.password.error}
                    requiredText={error || REQUIRED_FIELD}
                />
                <div className="items-center">
                    {showRecaptcha && (
                        <>
                            <ReCAPTCHA
                                id={generateId({
                                    module: ModuleApp.ACCOUNT_CREATED,
                                    submodule: 'recaptcha',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                ref={recaptchaRef}
                                sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                                onChange={(token: string | null): void => {
                                    setCaptcha({ error: false, validate: true });
                                    setRecaptchaValue(token ?? '');
                                }}
                                className={`${
                                    captcha.error && captcha.validate ? 'border-purple  border-1' : ''
                                } recaptcha-style`}
                            />
                            {captcha.error && captcha.validate && (
                                <label className="self-end block w-full mr-5.5 text-right text-tiny text-purple justify-self-end">
                                    {REQUIRED_FIELD}
                                </label>
                            )}
                        </>
                    )}
                    <Button
                        id={generateId({
                            module: ModuleApp.ACCOUNT_CREATED,
                            submodule: 'next-button',
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        reference={buttonNext}
                        text="Enviar"
                        classes="block m-auto my-3.75 xs:w-full"
                        background="blue"
                        onClick={handleSubmit}
                    />
                    <p className="justify-center m-auto my-3 text-center text-tiny">
                        Si todavía no tiene una cuenta creada, &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.ACCOUNT_CREATED,
                                submodule: 'url-created-account',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            linkColor={LinkColor.PURPLE}
                            href="#"
                            onClick={(): void => {
                                dispatch(setCreateAccountModal());
                                dispatch(setAccountCreatedModal());
                            }}
                            text="haga click aquí"
                            classes="text-tiny"
                        />
                    </p>
                    <p className="justify-center m-auto my-3 text-center text-tiny">
                        Si ya tiene un módulo activo comprado, &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.ACCOUNT_CREATED,
                                submodule: 'url-login',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            linkColor={LinkColor.PURPLE}
                            href="#"
                            onClick={(): void => {
                                dispatch(setLoginModal());
                                dispatch(setAccountCreatedModal());
                            }}
                            text="haga click aquí"
                            classes="text-tiny"
                        />
                    </p>
                </div>
                <div className="xs:flex xs:flex-row-reverse">
                    <Button
                        id={generateId({
                            module: ModuleApp.ACCOUNT_CREATED,
                            submodule: 'modal-back',
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text="Atrás"
                        classes="xs:block m-auto mt-5 hidden"
                        background="gray-light"
                        onClick={(): void => {
                            dispatch(setAccountCreatedModal());
                        }}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};

export default AccountCreated;
