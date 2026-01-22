import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { urls } from '@api/urls';
import { apiGetUser } from '@api/userCatalogs';

import { BreadCrumb } from '@components/bread-crumb';
import { Button, ButtonWithIcon } from '@components/button';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { SearchInput } from '@components/input';
import { Modal } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { IPaginatorBackend } from '@components/paginator-backend/index';
import { Table } from '@components/table';

import { paginationDataFormat } from '@constants/PaginationBack';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Routes } from '@constants/Paths';
import { ONE } from '@constants/Numbers';
import { LANGUAGE_KEY } from '@constants/Translate';
import { ADMINISTRATOR, READ_ANALYZE, SUPER_ADMINISTRATOR } from '@constants/UserManagement';
import { ZERO } from '@constants/UtilsConstants';

import useButtonProps from '@hooks/useButtonProps';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';

import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';

import { TableHeader, getBodyAdmin } from '@pages/user-manager/user-catalogs/components';
import { THREE } from '@pages/virtual-store-sales-receipts';

import { RootState } from '@redux/rootReducer';
import { DeleteUser, getUserPermissions } from '@redux/user-administrator/action';
import { setToEditUser } from '@redux/user-management/edit-user/action';

import { avoidReloadingThePage } from '@utils/FormData';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

import { UserDetail } from './user-management';
import UserManagement from './user-management/UserManagement';
import { CONSTANTS, USER_DETAIL, USER_MANAGEMENT, VALIDATION_NOTIFICATION, routes } from '.';
import './UserCatalogs.scss';

const UserCatalogs: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [translate] = useTranslation(LANGUAGE_KEY);

    const { queryParam: userParam } = useParam(USER_MANAGEMENT);
    const { queryParam: detailParam } = useParam(USER_DETAIL);

    const { user, userAdmin, usersPermissions, loader: loaderState } = useSelector(
        ({ session, userAdministrator, loader }: RootState) => ({
            ...session,
            ...userAdministrator,
            ...loader,
        })
    );

    const userRol = user?.roles && user?.roles[0].name;

    const [show, setShow] = useState(false);
    const [id, setId] = useState<IGenericRecord[]>([]);
    const [data, setData] = useState<IGenericRecord[]>([]);
    const [responseData, setResponseData] = useState<IPaginatorBackend<IGenericRecord>>(paginationDataFormat);
    const { disabledInputs } = usePermissions();
    const [searchValue, setSearchValue] = useState<string>('');
    const { getButtonProps } = useButtonProps();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getData().then();
        }, 500);

        return (): void => clearTimeout(timeoutId);
    }, [userParam, searchValue]);

    useEffect(() => {
        getData()
            .then(() => setShow(false))
            .then(() => setId([]));
    }, [userAdmin]);

    useEffect(() => {
        dispatch(getUserPermissions());
    }, []);

    useEffect(() => {
        setData(
            responseData?.data?.map?.((item, index) => ({
                ...item,
                module: getPermitsData(item),
                permits: item?.roles?.length ? item.roles[CONSTANTS.ITEM_FIRST].name : CONSTANTS.NO_PERMISSIONS,
                number: index + ONE,
            }))
        );
    }, [usersPermissions, responseData]);

    const getAssignParent = (data: IGenericRecord[]): IGenericRecord[] => {
        return data?.map((elementPermission: IGenericRecord) => {
            return elementPermission.permissions;
        });
    };

    const setDataUser = (e: IGenericRecord): void => {
        const dataEditUser = responseData?.data.find((data: IGenericRecord) => data.id === e.id);

        if (dataEditUser) {
            dispatch(
                setToEditUser({
                    ...dataEditUser,
                })
            );
            if (userRol === ADMINISTRATOR || !disabledInputs || dataEditUser.id === user?.id) {
                history.push(`${getRoute(Routes.USER_CATALOG_LIST)}?${USER_DETAIL}=true`);
            }
        }
    };

    const idCompany = user?.company_id;

    const deleteId = (): void => {
        dispatch(DeleteUser(id));
        setId([]);
    };

    const getPermitsData = (item: IGenericRecord): string => {
        const permissions: IGenericRecord[] = getAssignParent(item?.roles);
        const rolName = lengthGreaterThanZero(item.roles) && item?.roles[CONSTANTS.ITEM_FIRST]?.name;
        const result: string[] = [];

        if (rolName === ADMINISTRATOR || rolName === SUPER_ADMINISTRATOR) return CONSTANTS.ALL_MODULES;

        if (rolName === READ_ANALYZE) return CONSTANTS.ALL_REPORTS;

        usersPermissions?.forEach((element: IGenericRecord) => {
            const flatChildren = element?.children?.flatMap((submodule: IGenericRecord) => submodule?.children || submodule);
            const levelChildren = element?.children;
            const filterPermissions = permissions?.filter((module: IGenericRecord) => module.parent === element.name) || [];

            if (filterPermissions.length === flatChildren?.length && element?.children?.length) {
                result.push(element.name);
                return;
            }

            levelChildren?.forEach((elementChildren: IGenericRecord) => {
                const filterChildren =
                    permissions?.filter((module: IGenericRecord) =>
                        elementChildren?.children?.length
                            ? module?.description === elementChildren.name
                            : module?.description === elementChildren.father ||
                              module?.description === elementChildren.description
                    ) || [];

                if (filterChildren?.length === elementChildren?.children?.length) {
                    const levelChildrenName = VALIDATION_NOTIFICATION.includes(elementChildren.name)
                        ? CONSTANTS.ADMINISTRATION_NOTIFICATION
                        : elementChildren.name;

                    result.push(`${element.name}: ${levelChildrenName}`);
                    return;
                }
                filterChildren?.forEach(
                    ({ name }: IGenericRecord) =>
                        !result.includes(`${element.name}: ${name}`) && result.push(`${element.name}: ${name}`)
                );
                return;
            });
        });
        return result.length ? result.join(' - ') : CONSTANTS.NO_PERMISSIONS;
    };

    const getData = async (): Promise<unknown> => {
        const request: FetchRequest = new FetchRequest(
            searchValue?.length >= THREE ? `${urls.user}?search=${searchValue}` : urls.user,
            {
                idCompany,
            }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data }: any = await apiGetUser(request);
        const dataTest = data?.data
            ?.filter?.((item: IGenericRecord) => item?.email)
            ?.map((item: IGenericRecord, idx: number) => {
                const dataModules = getPermitsData(item);
                if (idx + ONE < data?.data?.length) {
                    const name = item?.roles[0]?.name;
                    return {
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        permits: item?.roles?.length > ZERO ? name : 'No hay permisos asignados',
                        module: dataModules,
                        number: idx + ONE,
                        roles: item.roles,
                    };
                }

                return { users_available: item.users_available };
            });
        setResponseData({ ...data, data: dataTest });
        setData(dataTest);
        return dataTest;
    };

    return (
        <div className="xs:px-2">
            {detailParam ? (
                <UserDetail />
            ) : userParam ? (
                <UserManagement getButtonProps={getButtonProps} />
            ) : (
                <div className="sm:w-full sm:pl-6 lg:pl-0">
                    <Modal
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET,
                            submodule: `user-catalog`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.MDL,
                        })}
                        open={show}
                        handleClose={(): void => setShow(false)}
                    >
                        <div className="delete-modal">
                            <Icon name="trashMulticolor" className="w-22.2 h-22.2 mb-2" />
                            <p className="mb-2 text-xl leading-6 text-center font-allerbold text-blue w-63">
                                Eliminar usuario{id.length > ONE ? 's' : ''}
                            </p>
                            <p className="text-center text-gray-dark w-86 mb-7">
                                {id.length > ONE
                                    ? '¿Está seguro que desea eliminar los usuarios seleccionados?'
                                    : '¿Está seguro que desea eliminar el usuario seleccionado?'}
                            </p>
                            <div className="flex items-center justify-center">
                                <Button
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET,
                                        submodule: `user-catalog`,
                                        action: ActionElementType.CANCEL,
                                        elementType: ElementType.BTN,
                                    })}
                                    text="Cancelar"
                                    classes="mr-7"
                                    onClick={(): void => setShow(false)}
                                />
                                <Button
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET,
                                        submodule: `user-catalog`,
                                        action: ActionElementType.DELETE,
                                        elementType: ElementType.BTN,
                                    })}
                                    text="Eliminar"
                                    onClick={(): void => deleteId()}
                                />
                            </div>
                        </div>
                    </Modal>
                    <PageTitle title={getRouteName(Routes.USER_CATALOG_LIST)} classContainer="mb-2" />
                    <BreadCrumb routes={routes()} />
                    <h3 className="text-center text-26lg text-blue font-allerbold mb-4.5">
                        {getRouteName(Routes.USER_CATALOG_LIST)}
                    </h3>
                    <p className="pr-1 mb-2 text-gray-dark">
                        A continuación visualice el listado de todos los usuarios que ha agregado, para visualizar y gestionar
                        cada uno haga click en el nombre del usuario que necesite. &nbsp;
                        {userRol === SUPER_ADMINISTRATOR && (
                            <span>
                                Para eliminar un usuario, seleccione el recuadro de la izquierda de la tabla y después haga click
                                en el icono <Icon name="trashBlue" className="inline w-5 h-5" />.
                            </span>
                        )}
                    </p>
                    <div onSubmit={avoidReloadingThePage} className={` ${userRol === SUPER_ADMINISTRATOR ? 'xs:mb-3.5' : ''}`}>
                        <div className="flex flex-col items-end justify-end">
                            <div className="flex flex-col items-end justify-between w-full mb-2">
                                <Form className="flex flex-wrap items-center justify-between w-full lg:flex-nowrap">
                                    <SearchInput
                                        id={generateId({
                                            module: ModuleApp.TECHNICAL_SHEET,
                                            submodule: `user-catalog-search`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        labelText="Nombre del usuario"
                                        isNew
                                        classesLabel="mb-0.5"
                                        classesWrapper="w-45 xs:w-full mb-7"
                                        classesInput="text-tiny"
                                        iconClassName="w-2.5 h-2.5"
                                        placeholder="..."
                                        value={searchValue}
                                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                            setSearchValue(e.target.value);
                                        }}
                                    />
                                    {(userRol === SUPER_ADMINISTRATOR || userRol === ADMINISTRATOR) && (
                                        <ButtonWithIcon
                                            id={generateId({
                                                module: ModuleApp.TECHNICAL_SHEET,
                                                submodule: `user-catalog`,
                                                action: ActionElementType.ADD,
                                                elementType: ElementType.BTN,
                                            })}
                                            nameIcon="plusWhite"
                                            classIcon="w-5 h-5"
                                            className="button-with-icon"
                                            onClick={(): void => {
                                                dispatch(setToEditUser({}));
                                                history.push(`${getRoute(Routes.USER_MANAGEMENT)}=false`);
                                            }}
                                        >
                                            Agregar usuario
                                        </ButtonWithIcon>
                                    )}
                                </Form>
                                {userRol === SUPER_ADMINISTRATOR && (
                                    <div className="flex items-end justify-end w-full">
                                        <Icon
                                            className="mb-1 cursor-pointer"
                                            name="trashBlue"
                                            hoverIcon="trashGreen"
                                            onClick={(): void => {
                                                if (lengthGreaterThanZero(id)) setShow(true);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Table
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET,
                            submodule: `user-catalog`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        isLoading={loaderState}
                        disabled={disabledInputs}
                        editable={false}
                        isNew
                        fieldsBody={getBodyAdmin(userRol === SUPER_ADMINISTRATOR, setDataUser)}
                        headerRowsCustom={<TableHeader translate={translate} isSuperAdmin={userRol === SUPER_ADMINISTRATOR} />}
                        isHeaderRowsCustom
                        data={data}
                        className="user-table xs:w-max"
                        setSelected={setId}
                        selected={id}
                        paginatorBackendData={{ ...responseData, data: data, setData: setResponseData }}
                    />
                    <div
                        className={`flex w-auto h-10 ${data.length <= ITEMS_PAGE ? 'mt-10' : 'mt-2'} ${
                            userRol === SUPER_ADMINISTRATOR ? 'lg:ml-8' : ''
                        }`}
                    >
                        <p className="user-total">Total usuarios</p>
                        <p className="user-total--number">{responseData?.meta?.total || ZERO}</p>
                    </div>

                    <PageButtonsFooter
                        moduleId={ModuleApp.TECHNICAL_SHEET}
                        titleButtonLeft="Atrás"
                        onClickButtonLeft={(): void => history.goBack()}
                    />
                </div>
            )}
        </div>
    );
};

export default UserCatalogs;
