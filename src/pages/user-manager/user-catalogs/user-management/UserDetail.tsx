import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { setToEditUser } from '@redux/user-management/edit-user/action';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { ZERO } from '@pages/website-editor';
import { TitleButtons } from '@constants/Buttons';
import { Routes } from '@constants/Paths';
import { ADMINISTRATOR, SUPER_ADMINISTRATOR } from '@constants/UserManagement';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Icon } from '@components/icon';
import { USER_MANAGEMENT } from '..';
import { routes } from '.';
import './User.scss';

export const UserDetail: React.FC = () => {
    const { user, setEditUser, updateUser } = useSelector(({ session, updateUser }: RootState) => ({
        ...session,
        ...updateUser,
    }));
    const dispatch = useDispatch();
    const history = useHistory();
    const userRol = user?.roles && user?.roles[ZERO].name;

    const [role, setRole] = useState('');
    const [uniqueParents, setUniqueParents] = useState<string[]>();

    useEffect(() => {
        const dataEditUser = updateUser?.find(user => user.id === setEditUser?.id);
        if (dataEditUser) {
            dispatch(
                setToEditUser({
                    ...dataEditUser,
                })
            );
        }
    }, [updateUser]);

    useEffect(() => {
        setRole(setEditUser?.roles[ZERO].name);
        if (setEditUser) {
            setUniqueParents(getUniqueParents(setEditUser.roles[ZERO]));
        }
    }, [setEditUser]);

    const getUniqueParents = (role: IGenericRecord): string[] => {
        const permissionNames: string[] = [];

        role.permissions.forEach((permission: IGenericRecord) => {
            permissionNames.push(permission.name);
        });

        return permissionNames;
    };

    return (
        <>
            <main className="user-detail">
                <PageTitle title={getRouteName(Routes.USER_CATALOG_LIST)} classContainer="mb-2" />
                <BreadCrumb routes={routes(false, true)} />
                <h3 className="text-center text-26lg text-blue font-allerbold mb-4.5">Detalle del usuario</h3>
                <p className="text-gray-dark mb-4.5">A continuación visualice y gestione la información del usuario. </p>
                {(userRol === ADMINISTRATOR || userRol === SUPER_ADMINISTRATOR) && (
                    <div
                        className="user-detail__edit"
                        onClick={(): void => history.push(`${getRoute(Routes.USER_CATALOG_LIST)}?${USER_MANAGEMENT}=true`)}
                    >
                        <Icon name="editMulticolor" className="cursor-pointer icon--edit" />
                        <p className="text-sm text-center text-blue font-allerbold">Editar información del usuario</p>
                    </div>
                )}

                <article className="w-full bg-white p-4.5">
                    <p className="user-detail--subtitle">Información básica</p>
                    <div className="flex flex-wrap lg:flex-nowrap mb-4.5 pb-4.5 border-green-ultraLight border-b">
                        <div className="border-b lg:mr-12 w-49 border-green-ultraLight">
                            <p className="user-detail--text">Nombre del usuario</p>
                            <p className="user-detail--subtext">{setEditUser?.name}</p>
                        </div>
                        <div className="border-b w-49 border-green-ultraLight">
                            <p className="user-detail--text">Correo electrónico</p>
                            <p className="user-detail--subtext">{setEditUser?.email}</p>
                        </div>
                    </div>
                    <p className="user-detail--subtitle">Información de permiso</p>
                    <div className="pb-4.5 border-green-ultraLight border-b mb-4.5">
                        <div className="border-b w-49 border-green-ultraLight">
                            <p className="user-detail--text">Tipo de permiso</p>
                            <p className="user-detail--subtext">{role}</p>
                        </div>
                    </div>
                    <div className="pb-4.5">
                        <div className="w-49">
                            <p className="mb-4.5 text-base text-gray-dark font-allerbold">Acceso a modulos</p>
                            {uniqueParents?.map(moduleName => (
                                <p key={moduleName} className="text-tiny font-allerbold text-gray mb-1.5">
                                    {moduleName}
                                </p>
                            ))}
                        </div>
                    </div>
                </article>
            </main>
            <PageButtonsFooter
                moduleId={ModuleApp.TECHNICAL_SHEET}
                titleButtonLeft={TitleButtons.BACK}
                onClickButtonLeft={(): void => history.goBack()}
            />
        </>
    );
};
