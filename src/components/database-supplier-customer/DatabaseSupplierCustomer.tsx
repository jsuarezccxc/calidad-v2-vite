/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from '@utils/Dayjs';
import { useHistory } from 'react-router-dom';
import { BreadCrumb } from '@components/bread-crumb';
import { SimpleButton } from '@components/button';
import { Form } from '@components/form';
import { DownloadIcons, Icon } from '@components/icon';
import { IOptionSelect, MultiSelectInput, SearchInput } from '@components/input';
import { ModalType } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { IBodyTable, IHeaderTable, Table } from '@components/table';
import { Routes } from '@constants/Paths';
import { THREE } from '@constants/ElectronicInvoice';
import { KEY_ASSIGN_SUPPLIER } from '@constants/Supplier';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import { SUPPLIER_DATABASE } from '@information-texts/SupplierDatabase';
import { ISupplierResponse } from '@models/Supplier';
import { IGenericRecord } from '@models/GenericRecord';
import { getClientById } from '@redux/client-portal/actions';
import { deleteClients, getClients } from '@redux/clients/actions';
import { RootState } from '@redux/rootReducer';
import { deleteSupplier, getSupplier, getSupplierHistory, getSuppliers } from '@redux/suppliers/actions';
import { getUtils } from '@redux/utils/actions';
import { getFile } from '@redux/user/actions';
import { getRouteName } from '@utils/Paths';
import { AssignDataToObject } from '@utils/Json';
import { toUnix } from '@utils/Date';
import { buttonsFooterProps } from '@utils/Button';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanOne } from '@utils/Length';
import { downloadIconsProps } from '@utils/DownloadFile';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { AddUser, SUPPLIER_UTILS, UserDetail, ZERO_FILE } from './components';
import {
    CUSTOMER,
    CUSTOMERS,
    FIRST_COLUMN,
    headersTableDelete,
    ID_ELECTRONIC_DOCUMENT,
    IDatabaseSupplierCustomerProps,
    IDataTableSupplier,
    initialSelectColumn,
    KEY_SELECT_COLUMN,
    MAX_SELECT,
    MIN_LENGTH,
    MIN_SELECT,
    MIN_SELECT_CUSTOMER,
    NUMBER,
    RequestFile,
    RequestFileSupplier,
    routes,
    SUPPLIER,
    SUPPLIERS,
    SUPPLIER_ROUTE,
    tableOptions,
    tableBodyDelete,
    MAX_SELECT_CUSTOMER,
} from '.';
import './DatabaseSupplierCustomer.scss';

const DatabaseSupplierCustomer: React.FC<IDatabaseSupplierCustomerProps> = ({
    propsTable,
    pagesElements,
    saveUser,
    showModalSave,
    setShowModalSave,
    nextRoute,
}) => {
    const { headersTable, tableBody, dataTable, paginatorBackendData } = propsTable;
    const { title, titleTotalTable, description, addButton, queryParams, pageRoute } = pagesElements;
    const {
        clientPortal: { clientSelected },
        company: { information },
        suppliers: { supplierHistory },
        membership: { membership_selected },
        loader: { loader: loaderState },
    } = useSelector(({ clientPortal, company, suppliers, membership, loader }: RootState) => ({
        clientPortal,
        company,
        suppliers,
        membership,
        loader,
    }));

    const dispatch = useDispatch();
    const history = useHistory();
    const { disabledInputs } = usePermissions();

    const { queryParam } = useParam('name');

    const [optionsTable, setOptionsTable] = useState<IOptionSelect[]>(tableOptions(pageRoute !== SUPPLIER_ROUTE));
    const [valueSelectTable, setValueSelectTable] = useState('');
    const [dataSupplierDetail, setDataSupplierDetail] = useState<IDataTableSupplier | IGenericRecord>({});
    const [isDetail, setIsDetail] = useState(false);
    const [isSupplierEdit, setIsSupplierEdit] = useState(false);
    const [searchTable, setSearchTable] = useState('');
    const [dataSearchTable, setDataSearchTable] = useState<IDataTableSupplier[] | IGenericRecord[]>([]);
    const [deleteUser, setDeleteUser] = useState<IGenericRecord[]>([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalNotDelete, setShowModalNotDelete] = useState(false);
    const [dataNotDeleteUsers, setDataNotDeleteUsers] = useState<IGenericRecord[]>([]);
    const [activeElectronicDocuments, setActiveElectronicDocuments] = useState(false);
    const [firstSearch, setFirstSearch] = useState(false);
    const titleAddPlural = title.split(' ')[title.split(' ').length - MIN_LENGTH];
    const titleAddSingular = addButton.split(' ')[addButton.split(' ').length - MIN_LENGTH];

    const isCustomer = titleAddSingular === CUSTOMER;

    const handleSupplierDetail = async (item: IDataTableSupplier | IGenericRecord): Promise<void> => {
        setIsDetail(true);
        setDataSupplierDetail(item);
        if (item?.client_id) await dispatch(getClientById(item?.client_id || ''));
        if (item?.supplier_id)
            await dispatch(
                getSupplierHistory({
                    supplier_id: item?.person_id,
                    supplier_name: item.name,
                    start_date: information?.created_at,
                    finish_date: toUnix(dayjs()),
                })
            );
    };

    useEffect(() => {
        dispatch(getUtils(SUPPLIER_UTILS));
    }, []);

    useEffect(() => {
        let filterSelect = initialSelectColumn(titleAddSingular);
        optionsTable.forEach(item => {
            if (item?.multiSelectCheck?.value) filterSelect = `${filterSelect},${item.value}`;
        });
        setValueSelectTable(filterSelect);
    }, [optionsTable]);

    useEffect(() => {
        if (!isDetail) return;
        clientSelected?.customer
            ? setDataSupplierDetail({
                  ...dataSupplierDetail,
                  ...clientSelected?.customer?.person,
                  ...clientSelected?.customer,
                  fiscal_responsibilities: clientSelected?.customer?.person?.fiscal_responsibilities || [],
              })
            : setDataSupplierDetail(dataTable);
    }, [clientSelected]);

    useEffect(() => {
        valueSelectTable && selectTableColumn(tableBody(handleSupplierDetail));
    }, [valueSelectTable]);

    useEffect(() => {
        setDataSearchTable(dataTable);
        if (!dataTable?.length && !searchTable && !firstSearch) {
            handleAddSupplier(queryParams.addUser);
        }
    }, [dataTable]);

    useEffect(() => {
        if (dataSupplierDetail?.name && queryParam !== queryParams.addUser) {
            handleAddSupplier(queryParams.detailUser);
        }
    }, [clientSelected, supplierHistory]);

    useEffect(() => {
        setActiveElectronicDocuments(
            !!membership_selected
                ?.flatMap(item => item.modules)
                .filter(module => module?.membership_modules_id === ID_ELECTRONIC_DOCUMENT && module?.is_active).length
        );
    }, [membership_selected]);

    useEffect(() => {
        if (queryParam === queryParams.editUser) setIsSupplierEdit(true);
    }, [queryParam]);

    const selectTableColumn = (dataBody: IBodyTable[]): { header: IHeaderTable[]; body: IBodyTable[] } => {
        const selectHeadersTable = headersTable.filter(item => valueSelectTable.includes(item?.title || ''));
        const selectBodyTable = dataBody?.filter(item => valueSelectTable.includes(KEY_SELECT_COLUMN[item?.field] || ''));
        return { header: selectHeadersTable, body: selectBodyTable };
    };

    const handleOptionTable = (option: IOptionSelect): void => {
        setOptionsTable(
            optionsTable?.map(item => {
                if (option.key === item.key) {
                    return {
                        ...item,
                        multiSelectCheck: { value: !item.multiSelectCheck?.value },
                    };
                }
                return item;
            })
        );
    };

    const downloadFiles = (type: string): void => {
        const request = titleAddSingular === SUPPLIER ? RequestFileSupplier : RequestFile;
        dispatch(
            getFile(
                {
                    ...request,
                    data: dataSearchTable,
                    type,
                    trTitles: valueSelectTable.split(',').filter(item => item !== FIRST_COLUMN),
                    tdIndex: body.filter(item => item.field && item.field !== NUMBER).map(item => item.field),
                    searchedBy: searchTable ? searchTable : null,
                },
                request.nameFile
            )
        );
    };

    const getEditData = (): IGenericRecord => {
        if (titleAddSingular === SUPPLIER) return dataSupplierDetail;
        const { person, ...customerWithoutPerson } = clientSelected?.customer || {};
        const { fiscal_responsibilities = [], ...personData } = person || {};

        return {
            ...customerWithoutPerson,
            ...personData,
            fiscal_responsibilities: fiscal_responsibilities.map((item: IGenericRecord) => ({
                ...item,
                id: item?.id?.toString(),
            })),
            customerClientId: clientSelected?.customer?.client_id,
            customerId: clientSelected?.customer?.id,
        };
    };

    const dataUser = useMemo(() => getEditData(), [clientSelected, dataSupplierDetail, queryParam]);

    const handleDeleteUser = async (): Promise<void> => {
        if (titleAddSingular === SUPPLIER) {
            const { statusCode, data }: any = await dispatch(deleteSupplier(deleteUser));
            if (data?.length) {
                setShowModalNotDelete(true);
                setDataNotDeleteUsers(data);
                return;
            }
            if (isCorrectResponse(statusCode)) await dispatch(getSuppliers());
        }
        if (titleAddSingular === CUSTOMER) {
            const { statusCode, data }: any = await dispatch(deleteClients(deleteUser));
            setDeleteUser([]);
            if (data?.length) {
                setShowModalNotDelete(true);
                setDataNotDeleteUsers(data);
                return;
            }
            if (isCorrectResponse(statusCode)) await dispatch(getClients());
        }
        setShowModalDelete(false);
    };

    const handleAddSupplier = (param: string): void => {
        history.push(`${pageRoute}?name=${param}`);
    };

    const handleSetSupplierEdit = async (id: string): Promise<void> => {
        const supplier = (await dispatch(getSupplier(id))) as unknown as ISupplierResponse;
        if (!supplier) return;
        setDataSupplierDetail({
            ...AssignDataToObject(KEY_ASSIGN_SUPPLIER, supplier),
            company_id: information?.id,
        });
    };

    useEffect(() => {
        if (searchTable.length >= THREE || !searchTable)
            pageRoute !== SUPPLIER_ROUTE ? dispatch(getClients(false, searchTable)) : dispatch(getSuppliers(false, searchTable));
    }, [searchTable]);

    const { header, body } = selectTableColumn(tableBody(handleSupplierDetail));

    return (
        <div className="xs:px-2">
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER}-delete-customer`}
                iconName="trash"
                text={{
                    title: `Eliminar  ${lengthGreaterThanOne(deleteUser) ? titleAddPlural : titleAddSingular}`,
                    description: `¿Está seguro que desea eliminar ${
                        lengthGreaterThanOne(deleteUser)
                            ? `los ${titleAddPlural} seleccionados`
                            : `el ${titleAddSingular} seleccionado`
                    }`,
                }}
                open={showModalDelete}
                finalAction={handleDeleteUser}
                otherButton={{
                    textButton: 'Cancelar',
                    onClick: (): void => {
                        setShowModalDelete(false);
                    },
                }}
                textButton="Eliminar"
            />
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER}-error-delete-customer`}
                iconName="advertisementMulticolor"
                text={{
                    title: `${
                        lengthGreaterThanOne(dataNotDeleteUsers)
                            ? `Los ${titleAddPlural} no se han eliminado`
                            : `El ${titleAddSingular} no se ha eliminado`
                    }`,
                    description: lengthGreaterThanOne(dataNotDeleteUsers)
                        ? SUPPLIER_DATABASE.DELETE_USERS({
                              title: titleAddPlural,
                              header: headersTableDelete(titleAddSingular),
                              body: tableBodyDelete,
                              dataDelete: dataNotDeleteUsers,
                          })
                        : SUPPLIER_DATABASE.DELETE_USER({ title: titleAddSingular, ...dataNotDeleteUsers[ZERO_FILE] }),
                }}
                open={showModalNotDelete}
                finalAction={(): void => {
                    setShowModalNotDelete(false);
                    setShowModalDelete(false);
                }}
                isChildText
                classModal={` ${!lengthGreaterThanOne(dataNotDeleteUsers) && 'unique-client'}`}
                classContent="supplier-database__modal-not-delete"
            />
            {!queryParam && (
                <div className="flex flex-col justify-between h-full">
                    <div className="supplier-database">
                        <PageTitle title="Ficha técnica" classTitle="text-left text-base" classContainer="w-full" />
                        <BreadCrumb routes={routes(title)} />
                        <h2 className="text-center text-26lg text-blue font-allerbold xs:text-xl">{title}</h2>
                        <p className="text-gray-dark my-4.5 mr-auto text-base lg:w-231">
                            {description} &nbsp;
                            <Icon name="trashBlue" className="inline w-5 h-5 -mt-1.5 -mx-1" />
                            <span>.</span>
                            {titleAddPlural === SUPPLIERS
                                ? ` Los ${titleAddPlural} agregados en esta sección se utilizan para generar documentos electrónicos.`
                                : titleAddPlural === CUSTOMERS
                                ? ` Los ${titleAddPlural} agregados en esta sección se utilizan para generar los documentos electrónicos.`
                                : '.'}
                        </p>
                        <div className="flex flex-wrap items-end justify-between gap-y-4.5">
                            <Form className="flex items-end gap-4.5 xs:flex-col xs:w-full">
                                <SearchInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                        submodule: 'filter-search',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="Buscador:"
                                    placeholder="..."
                                    classesWrapper="xs:w-full w-44.25"
                                    value={searchTable}
                                    onChange={(option): void => {
                                        setFirstSearch(true);
                                        setSearchTable(option.target.value);
                                    }}
                                    name="search"
                                    selectIconType="arrowDownGreen"
                                    isNew
                                    iconClassName="w-5.5 p-1"
                                />
                                <MultiSelectInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                        submodule: 'filter-columns',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    classesWrapper="supplier-database__select xs:w-full"
                                    name="table"
                                    labelText="Seleccione las columnas que desea ver en la tabla:"
                                    placeholder="Seleccionar"
                                    classListSelect
                                    options={optionsTable}
                                    isNewSelect
                                    optionSelected={handleOptionTable}
                                    valueSelect={valueSelectTable}
                                    value={`${valueSelectTable.slice(
                                        isCustomer ? MIN_SELECT_CUSTOMER : MIN_SELECT,
                                        isCustomer ? MAX_SELECT_CUSTOMER : MAX_SELECT
                                    )}...`}
                                    selectIconType="arrowDownGreen"
                                />
                            </Form>
                            <div className="flex items-center justify-end w-full xs:justify-center">
                                <SimpleButton
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                        action: ActionElementType.ADD,
                                        elementType: ElementType.BTN,
                                    })}
                                    className="flex items-center justify-center mb-5.5 rounded-md w-39 h-11 bg-green shadow-card gap-x-2 cursor-pointer"
                                    onClick={(): void => {
                                        handleAddSupplier(queryParams.addUser);
                                        setIsSupplierEdit(false);
                                    }}
                                >
                                    <Icon name="sumIcon" classIcon="w-5 h-5" />
                                    <p className="text-sm text-white font-allerbold">{addButton}</p>
                                </SimpleButton>
                                <DownloadIcons
                                    {...downloadIconsProps(downloadFiles, ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER)}
                                    withoutText
                                    className="mb-2.5 ml-7"
                                />
                            </div>
                        </div>
                        <Icon
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                submodule: 'delete',
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            className="w-5 h-5 ml-auto cursor-pointer"
                            {...(!disabledInputs && { onClick: (): void => setShowModalDelete(true) })}
                        />
                        <Table
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TBL,
                            })}
                            disabled={disabledInputs}
                            headersTable={header}
                            fieldsBody={body}
                            data={dataSearchTable}
                            editable={false}
                            isNew
                            wrapperClassName="supplier-database__table"
                            selected={deleteUser}
                            setSelected={setDeleteUser}
                            paginatorBackendData={paginatorBackendData}
                            isLoading={loaderState}
                        />
                        <div className="flex xs:mt-7 ml-7.3 xs:ml-0">
                            <p className="supplier-database__total-supplier-title">{titleTotalTable}</p>
                            <p className="supplier-database__total-supplier-result">{paginatorBackendData?.meta?.total}</p>
                        </div>
                    </div>

                    <PageButtonsFooter
                        {...buttonsFooterProps(ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER, history, nextRoute, {
                            name: '#',
                            moduleName: getRouteName(Routes.DATABASE_MENU),
                        })}
                    />
                </div>
            )}
            {(queryParam === queryParams.addUser || queryParam === queryParams.editUser) && (
                <AddUser
                    isSupplierEdit={isSupplierEdit}
                    saveUser={saveUser}
                    title={{ plural: titleAddPlural, singular: titleAddSingular }}
                    pageRoute={pageRoute}
                    setShowModalSave={setShowModalSave}
                    showModalSave={showModalSave}
                    editData={dataUser}
                    handleAddSupplier={handleAddSupplier}
                    handleSetSupplierEdit={handleSetSupplierEdit}
                    editUser={(): void => {
                        setIsSupplierEdit(true);
                        setIsDetail(true);
                    }}
                />
            )}
            {queryParam === queryParams.detailUser && (
                <UserDetail
                    data={dataSupplierDetail}
                    onClickEdit={(): void => {
                        handleAddSupplier(queryParams.editUser);
                        setIsSupplierEdit(true);
                    }}
                    title={{ plural: titleAddPlural, singular: titleAddSingular }}
                    pageRoute={pageRoute}
                    historicalInformation={
                        titleAddSingular === CUSTOMER ? clientSelected?.historical_information : supplierHistory
                    }
                    activeElectronicDocuments={activeElectronicDocuments}
                />
            )}
        </div>
    );
};

export default DatabaseSupplierCustomer;
