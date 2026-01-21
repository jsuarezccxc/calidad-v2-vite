import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { SelectSearchOption } from 'react-select-search';
import { ModalCustom, ModalType } from '@components/modal-custom';
import { PasswordInput, SelectSearchInput, TextInput } from '@components/input';
import { Button, Link, LinkColor } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { urls } from '@api/urls';
import {
    createAccount,
    setAccountCreatedModal,
    setCreateAccountModal,
    setErrorCreateUser,
    setLoginModal,
} from '@redux/session/actions';
import { RootState } from '@redux/rootReducer';
import { getDocumentTypes } from '@redux/company/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { ICreateAccount } from '@models/User';
import { validateEmail, validatePassword } from '@utils/Validation';
import { buildOptionsSearch } from '@utils/Company';
import { ACCEPT_POLICY, ACCEPT_TERMS, EMAIL, PASSWORD_CONFIRMATION, PHONE } from '@constants/UserManagement';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { BAD_RESPONSE, SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { REQUIRED_FIELD } from '@constants/FieldsValidation';
import { TERMS_AND_CONDITIONS_URL } from '@constants/Politics';
import { TitleButtons } from '@constants/Buttons';
import useDigitVerification from '@hooks/useDigitVerification';
import { hideRecaptchaEmailOrTests } from '@pages/login';
import {
    INITIAL_DATA,
    INVALID_NUMBER_PHONE,
    MAX_LENGHT_NUMBER,
    MAX_LENGTH_NAMES,
    MESSAGE_CREATE_USER_NUMBER,
    NIUP,
    REQUIRED_DATA,
    VALIDATE_NUMBER_ZERO,
} from '.';
import './CreateAccount.scss';

const CreateAccount: React.FC<{ createAccountModal: boolean }> = ({ createAccountModal }) => {
    const dispatch = useDispatch();
    const buttonNext = useRef<HTMLButtonElement | null>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>('');
    const [user, setUser] = useState<IGenericRecord>(INITIAL_DATA);
    const [requiredField, setRequiredField] = useState<IGenericRecord>(REQUIRED_DATA);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [policy, setPolicy] = useState(false);
    const [terms, setTerms] = useState(false);
    const [captcha, setCaptcha] = useState({
        error: true,
        validate: false,
    });
    const { isPasswordValid, passwordParams } = validatePassword(user?.password);
    const { document_types, accessToken, showErrorCreateUser } = useSelector(({ session, company }: RootState) => ({
        ...session,
        ...company,
    }));

    const documentTypesOptions = buildOptionsSearch(document_types)?.filter(element => element.name !== NIUP);

    const { isTypeNit, digitVerification, setTypeDocument, setDocumentNumber } = useDigitVerification(
        user.document_type,
        user.nit
    );

    const showRecaptcha = hideRecaptchaEmailOrTests(user.email);

    useEffect(() => {
        dispatch(getDocumentTypes());
        dispatch(setErrorCreateUser(false));
        recaptchaRef.current && recaptchaRef.current.reset();
    }, []);

    useEffect(() => {
        setUser(INITIAL_DATA);
        setRequiredField({
            document_type: {
                error: false,
                text: '',
            },
            nit: {
                error: false,
                text: '',
            },
            name: {
                error: false,
                text: '',
            },
            email: {
                error: false,
                text: '',
            },
            password: {
                error: false,
                text: '',
            },
            password_confirmation: {
                error: false,
                text: '',
            },
            phone: {
                error: false,
                text: '',
            },
            accept_policy: {
                error: false,
                text: '',
            },
            accept_terms: {
                error: false,
                text: '',
            },
        });
        setPolicy(false);
        setTerms(false);
    }, [createAccountModal]);

    useEffect(() => {
        if (user !== INITIAL_DATA && createAccountModal) {
            validateFields();
        }
        if (user === INITIAL_DATA) setTypeDocument('');
    }, [user, policy, terms]);

    const validateField = (field: string, value: IGenericRecord): { error: boolean; text: string } => {
        const commonMsg = '*Campo obligatorio';

        if (field === EMAIL) {
            const isValidEmail = validateEmail(value.email);
            return {
                error: !isValidEmail,
                text: !isValidEmail ? (value.email ? '*Ingrese un correo electrónico válido' : commonMsg) : '',
            };
        } else if (field === PASSWORD_CONFIRMATION) {
            const passwordsMatch = value.password_confirmation === value.password;
            return {
                error: !passwordsMatch,
                text: !passwordsMatch ? (value.password_confirmation ? '*Las contraseñas no coinciden' : commonMsg) : '',
            };
        } else if (field === PHONE) {
            const isInvalidPhone = value.phone.startsWith(VALIDATE_NUMBER_ZERO);
            return {
                error: isInvalidPhone,
                text: isInvalidPhone ? INVALID_NUMBER_PHONE : '',
            };
        } else if (field === ACCEPT_TERMS) {
            return {
                error: !terms,
                text: !terms ? commonMsg : '',
            };
        } else if (field === ACCEPT_POLICY) {
            return {
                error: !policy,
                text: !policy ? commonMsg : '',
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
        const validationFields: IGenericRecord = { ...requiredField };

        fields.forEach(field => {
            const { error, text } = validateField(field, { ...user });
            validationFields[field].error = error;
            validationFields[field].text = text;
        });

        setRequiredField(validationFields);
        return Object.values(validationFields).some(field => field.error);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        if (name) {
            setUser({
                ...user,
                [name]: value,
            });
            if (name === 'nit') setDocumentNumber(value);
        }
    };

    const handleOptionChange = (e: SelectSearchOption): void => {
        setUser({
            ...user,
            document_type: e.name,
        });
        setTypeDocument(e.name);
    };

    const handleSubmit = async (): Promise<void> => {
        buttonNext?.current && buttonNext.current.blur();
        !user?.password ||
            (!isPasswordValid &&
                passwordRef.current &&
                passwordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        const validateForm = validateFields();
        setCaptcha({ ...captcha, validate: true });
        recaptchaRef.current && recaptchaRef.current.reset();
        if (!captcha.error && captcha.validate && !validateForm) {
            const document_type = document_types.find(type => type.name === user.document_type)?.id || '';
            const data: ICreateAccount = {
                document_type,
                nit: user.nit,
                name: user.name,
                company_representative_name: user.company_representative_name,
                email: user.email,
                password: user.password,
                password_confirmation: user.password_confirmation,
                phone: user.phone,
                accept_policy: policy,
                accept_terms: terms,
            };

            const status = await dispatch(createAccount(data, recaptchaValue ?? ''));
            if (SUCCESS_RESPONSE.includes(Number(status))) {
                dispatch(setCreateAccountModal());
            }
            if (BAD_RESPONSE.includes(Number(status))) {
                setShowWarning(!showWarning);
            }
        }
    };

    useEffect(() => {
        setCaptcha({
            ...captcha,
            error: !recaptchaValue && showRecaptcha,
        });
    }, [recaptchaValue, user]);

    const getClassName = (error: boolean, defaultMb: string, errorMb?: string): string =>
        `flex ${error && errorMb ? errorMb : defaultMb}`;

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.CREATE_ACCOUNT,
                submodule: 'modal',
                action: ActionElementType.CONTAINER,
                elementType: ElementType.MDL,
            })}
            show={accessToken ? false : createAccountModal}
            showModal={(): void => {
                dispatch(setCreateAccountModal());
                dispatch(setErrorCreateUser(false));
            }}
            classesWrapper="sm:min-w-login h-112 xs:modal--full xs:h-full relative"
            classesModal="sm:min-w-login md:pt-13.25 p-7.3"
            isTableModal
            closeIcon={false}
            removeMinWidth
        >
            <Icon
                id={generateId({
                    module: ModuleApp.CREATE_ACCOUNT,
                    submodule: 'modal-icon',
                    action: ActionElementType.CLOSE,
                    elementType: ElementType.ICO,
                })}
                name="closeBlue"
                onClick={(): void => {
                    dispatch(setCreateAccountModal());
                }}
                className="cursor-pointer icon-closeCreateAccount"
                alt="close-modal"
            />
            <div className="container-modal">
                <ModalType
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'modal-account-already-created',
                        action: ActionElementType.CONTAINER,
                        elementType: ElementType.MDL,
                    })}
                    show={showWarning}
                    showModal={(): void => setShowWarning(!showWarning)}
                    type="warning"
                    title="Información"
                    text="El correo electrónico ya se encuentra registrado."
                />
                <h2>Crear cuenta</h2>
                <p className="mb-4 text-left text-tiny text-blue">Los campos marcados con (*) son obligatorios.</p>
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'document-type',
                        action: ActionElementType.SELECT,
                        elementType: ElementType.DRP,
                    })}
                    labelText="*Tipo de documento de la empresa:"
                    classesWrapper="w-73 mb-4.55 m-auto"
                    placeholder="Seleccionar"
                    optionSelect={documentTypesOptions}
                    required={requiredField.document_type.error}
                    requiredText={requiredField.document_type.text}
                    onChangeSelect={(_, option): void => handleOptionChange(option)}
                    valueSelect={documentTypesOptions?.find(option => option.name === user?.document_type)?.value}
                />
                <div className={`flex flex-row ${isTypeNit && 'justify-center'}`}>
                    <TextInput
                        id={generateId({
                            module: ModuleApp.CREATE_ACCOUNT,
                            submodule: 'document-number',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="nit"
                        labelText="*Número de documento de la empresa:"
                        classesWrapper={`${isTypeNit ? 'w-57 mr-2' : 'w-73 m-auto'} ${getClassName(
                            requiredField.nit.error,
                            'mb-4.55',
                            'mb-2'
                        )} xs:w-72 `}
                        placeholder="Ej: 0000 000 000"
                        value={user.nit}
                        onChange={handleChange}
                        onlyNumbers
                        maxLength={10}
                        required={requiredField.nit.error}
                        requiredText={isTypeNit ? '' : requiredField.nit.text}
                    />
                    {isTypeNit && (
                        <TextInput
                            id={generateId({
                                module: ModuleApp.CREATE_ACCOUNT,
                                submodule: 'dv',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            tooltipInfo
                            descTooltip="DV: Dígito de verificación"
                            classesWrapper="w-11.2"
                            labelText="DV:"
                            disabled
                            value={digitVerification}
                        />
                    )}
                </div>
                {showErrorCreateUser && (
                    <div className="flex justify-end w-full">
                        <label className="self-end text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1 ml-2">
                            {MESSAGE_CREATE_USER_NUMBER}
                        </label>
                    </div>
                )}
                {requiredField.nit.error && isTypeNit && (
                    <div className="flex justify-end w-full">
                        <label className="self-end mt-1 ml-2 mr-8 text-right text-tiny text-purple leading-xtiny">
                            {REQUIRED_FIELD}
                        </label>
                    </div>
                )}
                <TextInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'name',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="name"
                    labelText="*Nombre de persona natural o de la empresa:"
                    classesWrapper="w-73 mb-4.55 xs:w-72 m-auto mt-1"
                    placeholder="Nombre de persona natural o de la empresa"
                    value={user.name}
                    onChange={handleChange}
                    required={requiredField.name.error}
                    requiredText={requiredField.name.text}
                    maxLength={MAX_LENGTH_NAMES}
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'company-representative-name',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    tooltipInfo
                    descTooltip="En caso de que el nombre de contacto sea el mismo nombre que el de persona natural, déjelo vacío"
                    name="company_representative_name"
                    labelText="Nombre de contacto:"
                    classesWrapper="w-73 mb-4.55 xs:w-72 m-auto mt-1"
                    placeholder="Nombre de contacto"
                    value={user.company_representative_name}
                    onChange={handleChange}
                    maxLength={MAX_LENGTH_NAMES}
                    lettersWithAccent
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'email',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="email"
                    labelText="*Correo electrónico:"
                    classesWrapper="w-73 mb-4.55 xs:w-72 m-auto mt-1"
                    placeholder="Correo electrónico"
                    value={user.email}
                    onChange={handleChange}
                    required={requiredField.email.error}
                    requiredText={requiredField.email.text}
                    limitCharacters={false}
                />
                <PasswordInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
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
                    required={user.password && !isPasswordValid}
                    requiredText={''}
                />
                {user.password && !isPasswordValid && (
                    <div className="text-mtiny mb-3.75 ml-6">
                        <p className="-mt-4">
                            <span className="text-gray text-mtiny">La contraseña debe cumplir con los siguientes ítems:</span>
                            <ul className="-mt-1 space-y-0 list-none">
                                {passwordParams.map((param: IGenericRecord, index: number) => (
                                    <li
                                        key={index}
                                        className={`text-mtiny w-full flex flex-1 m-0 p-0" ${
                                            !param.isCorrect ? 'text-purple' : 'text-blue'
                                        }`}
                                    >
                                        {param?.message}
                                        {param.isCorrect && (
                                            <Icon
                                                id={generateId({
                                                    module: ModuleApp.CREATE_ACCOUNT,
                                                    submodule: 'password-check',
                                                    action: ActionElementType.INFO,
                                                    elementType: ElementType.ICO,
                                                })}
                                                name="checkBlue"
                                                className="password-check-icon"
                                                alt="info-modal"
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </p>
                    </div>
                )}
                <PasswordInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'password-confirmation',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="password_confirmation"
                    labelText="*Confirmar contraseña:"
                    placeholder="*******"
                    classesWrapper="w-73 xs:w-72 mb-4.55 m-auto  xs:mb-5"
                    value={user.password_confirmation}
                    onChange={handleChange}
                    required={requiredField.password_confirmation.error}
                    requiredText={requiredField.password_confirmation.text}
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.CREATE_ACCOUNT,
                        submodule: 'phone',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="phone"
                    labelText="Teléfono o celular:"
                    classesWrapper="w-73 mb-4.55 xs:w-72 m-auto mt-1"
                    placeholder="Teléfono o celular"
                    onlyNumbers
                    maxLength={MAX_LENGHT_NUMBER}
                    value={user.phone}
                    required={user.phone.startsWith(VALIDATE_NUMBER_ZERO)}
                    requiredText={user.phone.startsWith(VALIDATE_NUMBER_ZERO) && INVALID_NUMBER_PHONE}
                    onChange={handleChange}
                />
                <div className={getClassName(requiredField.accept_policy.error, 'mb-4.55')}>
                    <Checkbox
                        id={generateId({
                            module: ModuleApp.CREATE_ACCOUNT,
                            submodule: 'personal-information-check-box',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.CHK,
                        })}
                        checked={policy}
                        onChange={(): void => {
                            setPolicy(!policy);
                        }}
                        classCheck="checkmark-light"
                        classContainer="small-check-box mb-4.55 w-2"
                    />
                    <p className="leading-4 text-tiny font-aller">
                        He leído y acepto el tratamiento de mis datos personales de acuerdo a la &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.CREATE_ACCOUNT,
                                submodule: 'privacy-policy',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            download
                            linkColor={LinkColor.PURPLE}
                            href={urls.footer.politics}
                            target="_blank"
                            text="Política de Privacidad y Tratamiento de Datos"
                            classes="text-tiny leading-4"
                        />
                    </p>
                </div>
                {requiredField.accept_policy.error && (
                    <label className="self-end text-tiny text-purple mr-1.5 mb-3.75 text-right justify-self-end w-full block">
                        {requiredField.accept_policy.text}
                    </label>
                )}
                <div className={getClassName(requiredField.accept_terms.error, 'mb-4.55')}>
                    <Checkbox
                        id={generateId({
                            module: ModuleApp.CREATE_ACCOUNT,
                            submodule: 'terms-and-conditions-check-box',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.BTN,
                        })}
                        checked={terms}
                        onChange={(): void => {
                            setTerms(!terms);
                        }}
                        classCheck="checkmark-light"
                        classContainer="small-check-box mb-4.5 w-2"
                    />
                    <p className="leading-4 text-tiny font-aller">
                        He leído y acepto los &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.CREATE_ACCOUNT,
                                submodule: 'terms-and-conditions',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            download
                            linkColor={LinkColor.PURPLE}
                            href={TERMS_AND_CONDITIONS_URL}
                            target="_blank"
                            text="Términos y condiciones"
                            classes="text-tiny"
                        />{' '}
                        de la plataforma
                    </p>
                </div>
                {requiredField.accept_terms.error && (
                    <label className="self-end text-tiny text-purple mr-1.5 mb-3.75 text-right justify-self-end w-full block">
                        {requiredField.accept_terms.text}
                    </label>
                )}
                <div className="items-center">
                    {showRecaptcha && (
                        <>
                            <ReCAPTCHA
                                id={generateId({
                                    module: ModuleApp.CREATE_ACCOUNT,
                                    submodule: 'recaptcha',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                ref={recaptchaRef}
                                sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                                onChange={(token: string | null): void => {
                                    setCaptcha({ error: false, validate: true });
                                    setRecaptchaValue(token ?? null);
                                }}
                                className={`${
                                    captcha.error && captcha.validate ? 'border-purple  border-1' : ''
                                } recaptcha-style`}
                            />
                            {captcha.error && captcha.validate && (
                                <label className="self-end text-tiny text-purple mr-1.5 mb-3.75 text-right justify-self-end w-full block">
                                    {REQUIRED_FIELD}
                                </label>
                            )}
                        </>
                    )}
                    <Button
                        id={generateId({
                            module: ModuleApp.CREATE_ACCOUNT,
                            submodule: 'next-button',
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        reference={buttonNext}
                        text={TitleButtons.SAVE}
                        classes="block m-auto mt-5"
                        background="blue"
                        onClick={handleSubmit}
                    />
                    <p className="justify-center m-auto mt-6 mb-2 text-center text-tiny">
                        Si ya tiene una cuenta creada, &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.CREATE_ACCOUNT,
                                submodule: 'url-created-account',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            linkColor={LinkColor.PURPLE}
                            href="#"
                            onClick={(): void => {
                                dispatch(setAccountCreatedModal());
                                dispatch(setCreateAccountModal());
                            }}
                            text="haga click aquí"
                            classes="text-tiny"
                        />
                    </p>
                    <p className="justify-center m-auto mt-4 mb-2 text-center text-tiny">
                        Si ya tiene un módulo activo comprado, &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.CREATE_ACCOUNT,
                                submodule: 'url-login',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            linkColor={LinkColor.PURPLE}
                            href="#"
                            onClick={(): void => {
                                dispatch(setLoginModal());
                                dispatch(setCreateAccountModal());
                            }}
                            text="haga click aquí"
                            classes="text-tiny"
                        />
                    </p>
                </div>
                <div className="xs:flex xs:flex-row-reverse">
                    <Button
                        id={generateId({
                            module: ModuleApp.CREATE_ACCOUNT,
                            submodule: 'modal-back',
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text={TitleButtons.BACK}
                        classes="xs:block m-auto mt-5 hidden"
                        background="gray-light"
                        onClick={(): void => {
                            dispatch(setCreateAccountModal());
                        }}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};

export default CreateAccount;
