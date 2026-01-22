import split from 'lodash/split';
import replace from 'lodash/replace';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes, PATHS } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { RootState } from '@redux/rootReducer';
import { setCloseLoginModal } from '@redux/session/actions';
import { getUserGeolocation } from '@redux/payments/actions';
import { changePassword, clearErrors } from '@redux/recover-password/actions';
import { CHANGE_PASSWORD_INFORMATION } from '@information-texts/RecoverPassword';
import { PasswordInput } from '@components/input/Input';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ModalType } from '@components/modal-custom';
import { isCorrectResponse } from '@utils/Response';
import { validatePassword } from '@utils/Validation';
import Logo from '@assets/images/logo.svg';
import './ChangePassword.scss';

/**
 * ChangePassword is a component that allows show a disclaimer with privacy policy and treatment of personal data
 */
const ChangePassword: React.FC = () => {
    const history = useHistory();
    const buttonNext = useRef<HTMLButtonElement | null>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
    const [changePasswordData, setChangePasswordData] = useState({
        password: '',
        password_confirmation: '',
    });
    const [requiredField, setRequiredField] = useState({
        password: false,
        password_confirmation: false,
        text: '',
    });

    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.recoverPassword);
    const { geolocation } = useSelector((state: RootState) => state.payments);
    const { isPasswordValid, passwordParams } = validatePassword(changePasswordData.password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(clearErrors());

        setChangePasswordData({
            ...changePasswordData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (validationData()) {
            setRequiredField({
                password: false,
                password_confirmation: false,
                text: '',
            });
        }
    }, [changePasswordData]);

    useEffect(() => {
        dispatch(getUserGeolocation());
        dispatch(setCloseLoginModal());
    }, []);

    useEffect(() => {
        const handleFocus = (): void => {
            setIsPasswordFocused(true);
        };

        const handleBlur = (): void => {
            setIsPasswordFocused(false);
        };

        const passwordElement = passwordRef.current;

        if (passwordElement) {
            passwordElement.addEventListener('focus', handleFocus);
            passwordElement.addEventListener('blur', handleBlur);
        }

        return (): void => {
            if (passwordElement) {
                passwordElement.removeEventListener('focus', handleFocus);
                passwordElement.removeEventListener('blur', handleBlur);
            }
        };
    }, []);

    const validationData = (): boolean => {
        const { password, password_confirmation } = changePasswordData;

        if (password || password_confirmation) {
            if (!password || !password_confirmation) {
                setRequiredField({
                    password: !isPasswordValid,
                    password_confirmation: !password_confirmation,
                    text: '*Campo obligatorio',
                });
                return false;
            }

            if (password !== password_confirmation) {
                setRequiredField({
                    password: true,
                    password_confirmation: true,
                    text: '*Las contraseñas deben ser iguales',
                });
                return false;
            }
        }

        if (!password && !password_confirmation) {
            setRequiredField({
                password: false,
                password_confirmation: false,
                text: '',
            });
            return false;
        }
        return true;
    };

    const sendData = async (): Promise<void> => {
        buttonNext?.current && buttonNext.current.blur();
        !changePasswordData?.password ||
            (!isPasswordValid &&
                passwordRef.current &&
                passwordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }));

        const { password, password_confirmation } = changePasswordData;

        if (!password || !password_confirmation) {
            return setRequiredField({
                password: !password || !isPasswordValid,
                password_confirmation: !password_confirmation,
                text: '*Campo obligatorio',
            });
        }

        if (validationData() && !requiredField.password && !requiredField.password_confirmation) {
            const data = split(history.location.search, '&', 2);
            const token = replace(data[0], '?token=', '');
            const email = replace(data[1], 'email=', '');

            if (!token && !email) {
                return setRequiredField({
                    password: true,
                    password_confirmation: true,
                    text: '*Token inválido',
                });
            }
            let location = '';
            const coordinates = `Logintud: ${geolocation?.longitude}, Latitud: ${geolocation?.latitude}`;

            if (geolocation?.state && geolocation?.country_name) {
                location = `${geolocation?.state} ${geolocation?.country_name}`;
            } else if (geolocation?.state) {
                location = `${geolocation?.state} ${coordinates}`;
            } else if (geolocation?.country_name) {
                location = `${geolocation?.country_name} ${coordinates}`;
            } else {
                location = coordinates;
            }

            if (token && email) {
                const status = await dispatch(
                    changePassword({
                        email,
                        password,
                        password_confirmation,
                        change_location: location,
                        change_device: navigator?.platform,
                        longitude: geolocation?.longitude,
                        latitude: geolocation?.latitude,
                        token,
                    })
                );

                if (isCorrectResponse(Number(status))) {
                    setShowSuccessModal(true);
                    dispatch(setCloseLoginModal());
                }
            }
        }
    };

    return (
        <div className="change-password overflow-auto">
            <ModalType
                type="info"
                textButton="Aceptar"
                show={showSuccessModal}
                showModal={(): void => {
                    setShowSuccessModal(!showSuccessModal);
                    history.push(PATHS[Routes.HOME].route);
                }}
                title={CHANGE_PASSWORD_INFORMATION.TITLE}
                text={CHANGE_PASSWORD_INFORMATION.DESCRIPTION}
                classesWrapper="modal--recover-password"
                classesModal="modal--recover-password"
            />
            <div className="self-center ml-4 md:mr-28 xs:mt-5">
                <img src={Logo} alt={`${PRODUCT_NAME} Logo`} className="xs:w-80" />
            </div>
            <div className="change-password__form">
                <h1 className="text-xl font-allerbold text-blue">Nueva contraseña</h1>
                <p className="mt-2 mb-5 text-sm text-blue">Escriba su nueva contraseña.</p>
                <PasswordInput
                    reference={passwordRef}
                    name="password"
                    labelText="Nueva contraseña:"
                    classesWrapper="md:w-85 w-full mb-5"
                    value={changePasswordData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        handleChange(e);
                    }}
                    required={(requiredField.password || isPasswordFocused) && !isPasswordValid}
                />
                {(requiredField.password || isPasswordFocused) && !isPasswordValid && (
                    <div className="text-mtiny mb-3.75">
                        <p className="-mt-4">
                            <span className="text-gray text-mtiny">La contraseña debe cumplir con los siguientes ítems:</span>
                            <ul className="-mt-1 list-none space-y-0">
                                {passwordParams.map((param: IGenericRecord, index: number) => (
                                    <li
                                        key={index}
                                        className={`text-mtiny w-full flex flex-1 m-0 p-0" ${
                                            !param.isCorrect ? 'text-purple' : 'text-blue'
                                        }`}
                                    >
                                        {param?.message}
                                        {param.isCorrect && (
                                            <Icon name="checkBlue" className="password-check-icon" alt="info-modal" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </p>
                    </div>
                )}
                <PasswordInput
                    name="password_confirmation"
                    labelText="Confirmación de contraseña:"
                    classesWrapper="md:w-85 w-full"
                    value={changePasswordData.password_confirmation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        handleChange(e);
                    }}
                    required={error ? !!error : requiredField.password_confirmation}
                    requiredText={error ? error : requiredField.text}
                />
                <div className="flex justify-center mt-5">
                    <Button
                        reference={buttonNext}
                        text="Siguiente"
                        onClick={(): void => {
                            sendData();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
