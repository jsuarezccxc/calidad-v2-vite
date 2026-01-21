import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import { setResponse, userAdded } from '@redux/user-management/add-user/action';
import { userUpdate } from '@redux/user-management/edit-user/action';
import { RootState } from '@redux/rootReducer';

import useValidation from '@hooks/useValidation';
import useSaveModal from '@hooks/useSaveModal';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';

import { getRoute, getRouteName } from '@utils/Paths';
import { validateEmail, validatePassword } from '@utils/Validation';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { removeSpecialCharacters } from '@utils/SpecialCharacters';
import { getTranslationKey } from '@utils/Translation';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

import { LANGUAGE_KEY } from '@constants/Translate';
import { Routes } from '@constants/Paths';
import {
    EDIT,
    EMAIL,
    EMAIL_VALIDATE,
    FIELD_REQUIRED,
    PASSWORD,
    PASSWORD_CONFIRMATION,
    PASSWORD_NOT_EQUAL,
} from '@constants/UserManagement';
import { TitleButtons } from '@constants/Buttons';

import { IGenericRecord } from '@models/GenericRecord';

import { PasswordInput, SelectSearchInput, TextInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import { BreadCrumb } from '@components/bread-crumb';
import { IPageButtonsFooterProps, PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Form } from '@components/form';
import { Tooltip } from '@components/tooltip';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { Icon } from '@components/icon';

import { TRANSLATION_KEY, USER_DETAIL } from '..';
import {
    COUNT_FIELD,
    IUserManagementProps,
    OPTIONS_FOR_MODULE_PERMISSIONS,
    requiredFields,
    routes,
    checkedProperty,
    MAX_LENGTH_NAME_EMAIL,
    MAX_LENGTH_PASSWORD,
    INPUT_NAME,
} from '.';

import './User.scss';

const UserManagement: React.FC<IUserManagementProps> = ({
    getButtonProps = (): IPageButtonsFooterProps => ({ moduleId: ModuleApp.TECHNICAL_SHEET }),
}) => {
    const { user, membership_selected, usersPermissions, setEditUser, loader, response } = useSelector(
        ({ membership, userAdministrator, updateUser, loader, addUser, session }: RootState) => ({
            ...membership,
            ...userAdministrator,
            ...updateUser,
            ...loader,
            ...session,
            response: addUser.response,
        })
    );

    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();
    const [translate] = useTranslation(LANGUAGE_KEY);

    const isEdit = location.search.split('=')[1] === 'true';

    const { anchorEl, mouseProps } = usePopper();

    const [editPassword, setEditPassword] = useState<boolean>(false);

    const { disabledInputs } = usePermissions();

    const userToEdit = setEditUser || {};

    useEffect(() => {
        if (usersPermissions?.length) setNewPermissions(checkedProperty(usersPermissions, userToEdit));
    }, [usersPermissions, userToEdit]);

    const [rol, setRol] = useState(userToEdit?.roles && userToEdit.roles[0]?.name);
    const [showWarningPermissions, setShowWarningPermissions] = useState<boolean>(false);
    const [warningRol, setWarningRol] = useState<boolean>(false);

    const { updateState, requiredField, initialValue } = useValidation(requiredFields);

    const [data, setData] = useState({
        name: userToEdit?.name || '',
        email: userToEdit?.email || '',
    });

    const [passwordUser, setPasswordUser] = useState({ password: '', password_confirmation: '' });

    const { isPasswordValid, passwordParams } = validatePassword(passwordUser.password);

    const { showSaveModal, setShowSaveModal } = useSaveModal(loader, response, setResponse(''));

    const [newPermissions, setNewPermissions] = useState<IGenericRecord[]>([]);
    const [permissionsToSave, setPermissionsToSave] = useState<IGenericRecord[]>([]);

    useEffect(() => {
        const permissions: IGenericRecord[] = [];
        newPermissions.forEach((item: IGenericRecord) => {
            if (item.checked) permissions.push({ name: item.name, description: item.description });
        });

        setShowWarningPermissions(lengthEqualToZero(permissions));

        setPermissionsToSave(permissions);
    }, [newPermissions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setData({
            ...data,
            [e.target.name]: e.target.name === INPUT_NAME ? removeSpecialCharacters(e.target.value) : e.target.value,
        });

        initialValue();

        if (e.target.name === INPUT_NAME && !e.target.value) {
            updateState({ value: e.target.name });
        }

        if (e.target.name === EMAIL) {
            if (!e.target.value) {
                updateState({ value: e.target.name });
            }

            if (!validateEmail(e.target.value)) {
                updateState({ value: e.target.name, text: EMAIL_VALIDATE, hasMoreText: 'text_email' });
            }
        }
    };

    const handleChangePassword = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = target;
        const { password, password_confirmation } = passwordUser;

        setPasswordUser(prev => ({ ...prev, [name]: value }));
        updateState({ value: name });

        if (isPasswordValid || password === password_confirmation)
            updateState({
                value: '',
                allInputs: {
                    password: false,
                    password_confirmation: false,
                },
            });
    };

    const handleChangeModule = (module = ''): void => {
        setNewPermissions(
            newPermissions.map(permission => ({
                ...permission,
                checked: module === permission.name ? (permission.checked ? false : true) : permission.checked,
            }))
        );
    };

    const updateUsers = (): void => {
        const { id } = userToEdit;
        const { name, email } = data;
        const { password, password_confirmation } = passwordUser;

        const requiredValidation = Object.values(requiredField).some((value, idx) => (idx < COUNT_FIELD ? value : false));

        if (requiredValidation && (editPassword || !isEdit)) {
            if (rol === EDIT && lengthEqualToZero(permissionsToSave)) setShowWarningPermissions(true);
            return;
        }

        if (!name || !email || !rol) {
            if (rol === EDIT && lengthEqualToZero(permissionsToSave)) setShowWarningPermissions(true);
            setWarningRol(!rol);

            return updateState({
                value: '',
                text: FIELD_REQUIRED,
                hasMoreText: '',
                allInputs: {
                    name: !name,
                    email: !email,
                    password: !password,
                    password_confirmation: !password_confirmation,
                    text_email: '',
                    text_password: '',
                },
            });
        }

        if (!rol || ((editPassword || !isEdit) && (!password || !password_confirmation))) {
            if (rol === EDIT && lengthEqualToZero(permissionsToSave)) setShowWarningPermissions(true);
            setWarningRol(!rol);

            return updateState({
                value: '',
                text: FIELD_REQUIRED,
                hasMoreText: '',
                allInputs: {
                    password: !password,
                    password_confirmation: !password_confirmation,
                },
            });
        }

        setWarningRol(!rol);

        if (email && !validateEmail(email)) return updateState({ value: email, text: EMAIL_VALIDATE });

        if (rol === EDIT && lengthEqualToZero(permissionsToSave)) return setShowWarningPermissions(true);

        const permissions = rol === EDIT ? permissionsToSave : [];
        const roles = [{ name: rol, permissions }];

        const editUserPassword = {
            id,
            name,
            email,
            roles,
            password,
            password_confirmation,
        };

        const editUser = {
            id,
            name,
            email,
            roles,
        };

        const addUser = {
            password,
            password_confirmation,
            name,
            email,
            roles,
            company_id: user?.company_id,
            accept_policy: false,
            accept_terms: false,
        };

        if (name && email && validateEmail(email)) {
            if (!isEdit && password && password_confirmation) {
                dispatch(userAdded(addUser));
                return;
            }
            if (editPassword && password && password_confirmation) {
                dispatch(userUpdate(editUserPassword));
            } else {
                dispatch(userUpdate(editUser));
            }
        }
    };

    const onClickButtonRight = (): void => {
        if (lengthGreaterThanZero(membership_selected || [])) updateUsers();
    };

    const optionsPermissionsRender = OPTIONS_FOR_MODULE_PERMISSIONS.map(item => ({ ...item, name: item.value }));

    return (
        <div className="flex flex-col h-full">
            <PageTitle title={getRouteName(Routes.USER_CATALOG_LIST)} classContainer="mb-2" />
            <BreadCrumb routes={routes(isEdit)} />
            <h3 className="text-center text-26lg text-blue font-allerbold mb-4.5">
                {isEdit ? 'Editar usuario' : 'Agregar usuario'}
            </h3>
            <p className="pr-1 mb-4.5 text-gray-dark">
                {isEdit ? 'Edite la siguiente información del usuario' : 'Agregue la siguiente información para crear un usuario'}
            </p>
            <div className="flex-1">
                <div className="bg-white p-4.5 shadow-templateDesign rounded-lg">
                    <p className="font-allerbold text-green mb-4.5">Información básica</p>
                    <Form className="flex flex-wrap mb-4.5 lg:flex-nowrap">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET,
                                submodule: `user-catalog-name`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="name"
                            placeholder="..."
                            labelText="*Nombre del usuario:"
                            value={data && data.name}
                            onChange={handleChange}
                            required={requiredField && requiredField.name}
                            classesWrapper="md:w-73 w-full lg:mr-7"
                            maxLength={MAX_LENGTH_NAME_EMAIL}
                            lettersWithAccent
                            disabled={disabledInputs}
                        />
                        <TextInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET,
                                submodule: `user-catalog-email`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="email"
                            placeholder="..."
                            labelText="*Correo electrónico:"
                            value={data && data.email}
                            onChange={handleChange}
                            required={requiredField && requiredField.email}
                            requiredText={requiredField && requiredField.text_email ? requiredField.text_email : FIELD_REQUIRED}
                            classesWrapper="md:w-73 w-full"
                            disabled={disabledInputs}
                            limitCharacters={false}
                        />
                    </Form>

                    {editPassword || !isEdit ? (
                        <Form className="flex flex-wrap lg:flex-nowrap">
                            <div>
                                <PasswordInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET,
                                        submodule: `user-catalog-password`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name={PASSWORD}
                                    labelText={`${translate(
                                        getTranslationKey(TRANSLATION_KEY, `${isEdit ? 'edit' : 'assign'}-password`)
                                    )}:`}
                                    placeholder="*******"
                                    value={passwordUser.password}
                                    onChange={handleChangePassword}
                                    required={requiredField.password && !isPasswordValid}
                                    maxLength={MAX_LENGTH_PASSWORD}
                                    classesWrapper="md:w-73 w-full  lg:mr-7"
                                    disabled={disabledInputs}
                                />

                                {requiredField.password && !isPasswordValid && (
                                    <div className="text-mtiny mb-3.75">
                                        <p>
                                            <span className="text-gray text-mtiny">
                                                La contraseña debe cumplir con los siguientes ítems:
                                            </span>
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
                            </div>

                            <div className="flex items-start justify-start">
                                <PasswordInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET,
                                        submodule: `user-catalog-password-confirmation`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name={PASSWORD_CONFIRMATION}
                                    labelText={`${translate(getTranslationKey(TRANSLATION_KEY, 'confirm-password'))}:`}
                                    placeholder="*******"
                                    value={passwordUser.password_confirmation}
                                    requiredText={!passwordUser.password_confirmation ? FIELD_REQUIRED : PASSWORD_NOT_EQUAL}
                                    onChange={handleChangePassword}
                                    required={passwordUser.password !== passwordUser.password_confirmation}
                                    maxLength={MAX_LENGTH_PASSWORD}
                                    classesWrapper="md:w-73 w-full mr-1"
                                    disabled={disabledInputs}
                                />

                                {isEdit && !disabledInputs && (
                                    <Icon
                                        name="editBlue"
                                        hoverIcon="editGreen"
                                        onClick={(): void => {
                                            setEditPassword(!editPassword);
                                        }}
                                        className="cursor-pointer h-5.5 mt-7.3"
                                    />
                                )}
                            </div>
                        </Form>
                    ) : (
                        <Form className="flex flex-wrap items-end justify-start lg:flex-nowrap">
                            <PasswordInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET,
                                    submodule: `user-catalog-password`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name={PASSWORD}
                                disabled={true}
                                labelText={`*${translate(getTranslationKey(TRANSLATION_KEY, 'password'))}:`}
                                placeholder="*******"
                                value={passwordUser.password}
                                classesWrapper="md:w-73 w-full mr-1"
                                classesWrapperInput="border-none"
                            />
                            <Icon
                                name="editBlue"
                                hoverIcon="editGreen"
                                {...(!disabledInputs && { onClick: (): void => setEditPassword(!editPassword) })}
                                className="cursor-pointer h-5.5"
                            />
                        </Form>
                    )}
                </div>
                <div className="bg-white p-4.5 shadow-templateDesign rounded-lg mt-4.5">
                    <div>
                        <h2 className="flex items-center justify-start mb-2 text-base font-allerbold text-green">
                            <span className="mr-0.5" {...mouseProps}>
                                <Icon name="infoGreen" className="w-4 h-4 cursor-pointer" />
                                <Tooltip
                                    anchorEl={anchorEl}
                                    iconName="infoBlue"
                                    placement="bottom-start"
                                    title="Tipo de permisos:"
                                    description={
                                        <div>
                                            <p className="text-sm text-blue">
                                                <span className="font-allerbold ">Administrador:</span> Puede acceder y editar
                                                todos los módulos, además de agregar, eliminar y editar los usuarios.
                                            </p>
                                            <p className="text-sm text-blue">
                                                <span className="font-allerbold">Editar:</span> Puede realizar acciones dentro de
                                                los módulos a los que tenga acceso, pero no puede administrar usuarios.
                                            </p>
                                            <p className="text-sm text-blue">
                                                <span className="font-allerbold">Leer y analizar:</span> Puede ver toda la
                                                información de la cuenta, sin embargo, no puede agregar, editar o eliminar
                                                información.
                                            </p>
                                        </div>
                                    }
                                />
                            </span>
                            Tipo de permiso
                        </h2>
                        <p className="text-gray-dark">Seleccione el tipo de permiso que tendrá el usuario.</p>
                    </div>
                    <div>
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET,
                                submodule: `user-catalog-type-permissions`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="*Tipo de permiso"
                            placeholder="Seleccionar"
                            classesWrapper="mt-4.5 w-73"
                            classesWrapperInput={warningRol ? 'border-purple' : ''}
                            valueSelect={rol}
                            optionSelect={optionsPermissionsRender}
                            onChangeSelect={(_, option): void => {
                                setRol(option?.value);
                                setWarningRol(false);
                            }}
                            selectIconType="arrowDownGreen"
                            disabled={disabledInputs}
                        />
                        {warningRol && <p className="text-right text-tiny text-purple w-73">*Campo obligatorio</p>}
                        {rol === EDIT && (
                            <div className="mt-4.5">
                                <p className="mb-2 font-allerbold text-green">Acceso a módulos</p>
                                <p className="text-gray-dark mb-4.5">
                                    Seleccione los módulos a los cuales tendrá permiso de Editar
                                </p>
                                <div className="flex flex-col">
                                    {usersPermissions?.map(item => (
                                        <Fragment key={item.name}>
                                            <Checkbox
                                                name={item.name}
                                                label={item.name}
                                                checked={
                                                    newPermissions.find(({ name }: IGenericRecord) => name === item.name)
                                                        ?.checked || false
                                                }
                                                onChange={(): void => handleChangeModule(item.name)}
                                                classContainer="mb-2"
                                                classLabel="width-checkbox bg-gray-light"
                                                disabled={disabledInputs}
                                            />
                                        </Fragment>
                                    ))}
                                    {showWarningPermissions && (
                                        <p className="text-right text-tiny text-purple w-73">*Campo obligatorio</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET,
                    submodule: `user-catalog`,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.MDL,
                })}
                open={showSaveModal}
                handleClose={(): void => setShowSaveModal(false)}
            >
                <div className="save-modal">
                    <Icon name="checkMulticolor" className="w-22.2 h-22.2 mb-2" />
                    <p className="mb-2 text-xl leading-6 text-center font-allerbold text-blue w-63">Información guardada</p>
                    <p className="text-center text-gray-dark w-86 mb-7">¡Su información ha sido guardada con éxito!</p>
                    <div className="flex items-center justify-center">
                        <Button
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET,
                                submodule: `${ModuleApp.MODALS}-user-catalog`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            text="Aceptar"
                            classes="mr-7"
                            onClick={(): void =>
                                isEdit
                                    ? history.push(`${getRoute(Routes.USER_CATALOG_LIST)}?${USER_DETAIL}=true`)
                                    : history.push(getRoute(Routes.USER_CATALOG_LIST))
                            }
                        />
                    </div>
                </div>
            </Modal>

            <PageButtonsFooter
                {...getButtonProps({
                    moduleId: ModuleApp.TECHNICAL_SHEET,
                    onClickButtonRight,
                    permissions: {
                        name: Routes.USER_MANAGEMENT,
                        moduleName: Routes.HOME,
                    },
                    rightText: TitleButtons.SAVE,
                })}
                disabledRight={disabledInputs}
            />
        </div>
    );
};

export default UserManagement;
