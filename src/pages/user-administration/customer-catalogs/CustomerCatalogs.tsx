import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPermissions } from '@redux/user-administrator/action';
import { getFile } from '@redux/user/actions';
import { getAdminCustomers } from '@redux/company/actions';
import { RootState } from '@redux/rootReducer';
import { getRouteName } from '@utils/Paths';
import { downloadIconsProps } from '@utils/DownloadFile';
import { lengthGreaterThanZero } from '@utils/Length';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { MODULES } from '@constants/Memberships';
import { ITableFieldType } from '@constants/TableFieldType';
import { TitleButtons } from '@constants/Buttons';
import { IGenericRecord } from '@models/GenericRecord';
import { DownloadIcons } from '@components/icon';
import { BreadCrumb } from '@components/bread-crumb';
import { IBodyTable, IHeaderTable, Table } from '@components/table';
import { PageTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IOptionSelect, MultiSelectInput, SearchInput, SelectInput } from '@components/input';
import { Form } from '@components/form';
import { EXCLUDED_MODULE, QUANTITY_ALLOWED_DE_MODULE } from '@pages/payment-plan';
import {
    FIRST_COLUMN,
    headersTable,
    IDataTableCustomer,
    initialSelectColumn,
    KEY_SELECT_COLUMN,
    KEY_SELECT_SEARCH,
    MAX_SELECT,
    MIN_LENGTH,
    MIN_SELECT,
    optionsPlanStatus,
    RequestFile,
    routes,
    TABLE_OPTIONS,
    tableBody,
    TYPE_VALUE_STRING,
    ONE,
    ZERO,
} from '.';
import './CustomerCatalogs.scss';

const CustomerCatalogs: React.FC = () => {
    const dispatch = useDispatch();

    const { loader: loaderState } = useSelector(({ loader }: RootState) => ({
        ...loader,
    }));

    const [data, setData] = useState<IGenericRecord[]>([]);

    const [planStatus, setPlanStatus] = useState<string>('');
    const [searchTable, setSearchTable] = useState('');
    const [dataSearchTable, setDataSearchTable] = useState<IDataTableCustomer[] | IGenericRecord[]>([]);
    const [optionsTable, setOptionsTable] = useState<IOptionSelect[]>(TABLE_OPTIONS);
    const [valueSelectTable, setValueSelectTable] = useState('');
    const [lengthData, setLengthData] = useState<IGenericRecord>({});

    const getPlanStatusValue = (key: string): string => {
        const status = optionsPlanStatus.find(option => option.key === key);
        return status ? status.value : '';
    };

    useEffect(() => {
        getData();
        dispatch(getUserPermissions());
    }, []);

    useEffect(() => {
        filterByStatus();
    }, [planStatus, searchTable, data]);

    useEffect(() => {
        valueSelectTable && selectTableColumn(tableBody);
    }, [valueSelectTable]);

    useEffect(() => {
        let filterSelect = initialSelectColumn();
        optionsTable.forEach(item => {
            if (item?.multiSelectCheck?.value) filterSelect = `${filterSelect},${item.value}`;
        });
        setValueSelectTable(filterSelect);
    }, [optionsTable]);

    const getData = async (): Promise<unknown> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await dispatch(getAdminCustomers());
        const { total, total_active, companies } = response;

        const transformedCompanies = companies
            .map((company: IGenericRecord, index: number) => {
                const transformedModules = company.modules.map((module: IGenericRecord) => {
                    const hasAllowedQuantity = QUANTITY_ALLOWED_DE_MODULE.some(quantity => module.plan?.includes(quantity));
                    const shouldShowNA = module.plan?.toLowerCase().includes(EXCLUDED_MODULE) && hasAllowedQuantity;

                    return {
                        ...module,
                        is_active: module.is_active ? optionsPlanStatus[ZERO].value : optionsPlanStatus[ONE].value,
                        documents_processed: String(module.documents_processed),
                        plan_expiration_date: shouldShowNA ? 'N/A' : module.plan_expiration_date,
                    };
                });

                return {
                    ...company,
                    number: index,
                    phone: String(company.phone ?? ''),
                    isMultipleModules: company.modules.length > ONE,
                    modules: transformedModules,
                };
            })
            .sort((a: IGenericRecord, b: IGenericRecord) => {
                const dateA = new Date(a.purchase_date_plan);
                const dateB = new Date(b.purchase_date_plan);
                return dateB.getTime() - dateA.getTime();
            });

        setDataSearchTable(transformedCompanies);
        setLengthData({ total, total_active });
        setData(transformedCompanies);

        return transformedCompanies;
    };

    const filterByOptionTable = (): IGenericRecord[] => {
        const selectSearch = optionsTable
            .filter(item => !item.multiSelectCheck?.value)
            .flatMap((item: IGenericRecord) => item.value);

        const filterBySelect: IGenericRecord[] = [];
        data.forEach(item => {
            if (selectSearch.length) {
                let elementEdit = item;
                selectSearch.forEach((element, index) => {
                    if (selectSearch.length - MIN_LENGTH !== index) {
                        elementEdit = { ...elementEdit, [KEY_SELECT_SEARCH[element]]: '' };
                        return;
                    }
                    filterBySelect.push({ ...elementEdit, [KEY_SELECT_SEARCH[element]]: '' });
                });
                return;
            }
            filterBySelect.push(item);
        });
        return filterBySelect;
    };

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

    const filterModulesBySearch = (modules: IGenericRecord[] | undefined, searchValue: string): IGenericRecord[] => {
        return (
            modules?.filter(module =>
                Object.values(module).some(moduleValue =>
                    typeof moduleValue === TYPE_VALUE_STRING
                        ? moduleValue.toLowerCase().includes(searchValue)
                        : String(moduleValue).includes(searchValue)
                )
            ) || []
        );
    };

    const filterItemBySearch = (item: IGenericRecord, searchValue: string): IGenericRecord | undefined => {
        const mainPropertiesMatch = Object.values(item).some(value =>
            typeof value === TYPE_VALUE_STRING ? value.toLowerCase().includes(searchValue) : String(value).includes(searchValue)
        );

        const filteredModules = filterModulesBySearch(item.modules, searchValue);

        if (mainPropertiesMatch) return item;
        if (lengthGreaterThanZero(filteredModules)) return { ...item, modules: filteredModules };
    };

    const filterByStatus = (): void => {
        const filteredData = data
            .map(item => {
                if (planStatus === '') return item;

                const filteredModules =
                    item.modules?.filter(
                        (module: IGenericRecord) =>
                            module &&
                            typeof module.is_active !== VARIABLE_TYPE.UNDEFINED &&
                            ((planStatus === optionsPlanStatus[ZERO].key && module.is_active === optionsPlanStatus[ZERO].value) ||
                                (planStatus === optionsPlanStatus[ONE].key && module.is_active === optionsPlanStatus[ONE].value))
                    ) || [];

                if (lengthGreaterThanZero(filteredModules)) return { ...item, modules: filteredModules };
            })
            .filter((item): item is IGenericRecord => !!item);

        if (searchTable.trim() === '') {
            setDataSearchTable(filteredData);
        } else {
            const lowercasedSearch = searchTable.toLowerCase();
            setDataSearchTable(
                filteredData
                    .map(item => filterItemBySearch(item, lowercasedSearch))
                    .filter((item): item is IGenericRecord => !!item)
            );
        }
    };

    const handleSearchTable = (value: string): void => {
        setSearchTable(value);
        const lowercasedValue = value.toLowerCase();

        const filteredData = filterByOptionTable()
            .map(item => filterItemBySearch(item, lowercasedValue))
            .filter((item): item is IGenericRecord => !!item);

        setDataSearchTable(filteredData);
    };

    const downloadFiles = (type: string): void => {
        const request = RequestFile;
        dispatch(
            getFile(
                {
                    ...request,
                    data: dataSearchTable,
                    type,
                    trTitles: valueSelectTable.split(',').filter(item => item !== FIRST_COLUMN),
                    tdIndex: [
                        ...body
                            .filter(
                                item =>
                                    item.field && item.field !== ITableFieldType.NUMBER && item.type !== ITableFieldType.OBJECT
                            )
                            .map(item => item.field),
                        MODULES,
                    ],

                    searchedBy: searchTable ? searchTable : null,
                },
                request.nameFile
            )
        );
    };

    const { header, body } = selectTableColumn(tableBody);

    return (
        <div className="sm:w-full sm:pl-6 lg:pl-0">
            <PageTitle title={getRouteName(Routes.DIGGI_PYMES_CUSTOMER)} classContainer="mb-2" />
            <BreadCrumb routes={routes()} />
            <h3 className="text-center text-26lg text-blue font-allerbold mb-4.5">
                {getRouteName(Routes.DIGGI_PYMES_CUSTOMER_DATABASE)}
            </h3>
            <p className="pr-1 mb-2 text-gray-dark">
                Desde esta pantalla, gestione la información de la base de datos de los clientes en diggi pymes, permitiendo
                identificar el estado actual de sus planes activos y acceder a detalles clave sobre su sitio web asociado.
            </p>

            <div className="flex flex-wrap items-end justify-between gap-y-4.5">
                <Form className="flex items-end gap-4.5 xs:flex-col xs:w-full">
                    <SearchInput
                        id={generateId({
                            module: ModuleApp.USER_ADMINISTRATION,
                            submodule: 'search-filter',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Buscador:"
                        placeholder="..."
                        classesWrapper="xs:w-full w-44.25"
                        value={searchTable}
                        onChange={(option): void => handleSearchTable(option.target.value)}
                        name="search"
                        selectIconType="arrowDownGreen"
                        isNew
                        iconClassName="w-5.5 p-1"
                    />
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.USER_ADMINISTRATION,
                            submodule: 'status-filter',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelected={(option): void => setPlanStatus(option.key)}
                        value={getPlanStatusValue(planStatus)}
                        options={optionsPlanStatus}
                        labelText="Estado del plan"
                        placeholder="Seleccionar"
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-full lg:w-57.5"
                    />
                    <MultiSelectInput
                        id={generateId({
                            module: ModuleApp.USER_ADMINISTRATION,
                            submodule: 'columns-filter',
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
                        value={valueSelectTable.slice(MIN_SELECT, MAX_SELECT)}
                        selectIconType="arrowDownGreen"
                    />
                </Form>
                <div className="flex items-center justify-end w-full xs:justify-center">
                    <DownloadIcons
                        {...downloadIconsProps(downloadFiles, ModuleApp.USER_ADMINISTRATION)}
                        withoutText
                        className="mb-2.5 ml-7"
                    />
                </div>
            </div>
            <Table
                id={generateId({
                    module: ModuleApp.USER_ADMINISTRATION,
                    submodule: 'customer-catalogs',
                    action: ActionElementType.TABLE,
                    elementType: ElementType.TBL,
                })}
                isLoading={loaderState}
                headersTable={header}
                fieldsBody={body}
                data={dataSearchTable}
                editable={false}
                isNew
                wrapperClassName="supplier-database__table"
            />
            <div className="flex xs:mt-7 xs:ml-0">
                <p className="supplier-database__total-supplier-title">Total clientes activos</p>
                <p className="supplier-database__total-supplier-result">{lengthData.total_active}</p>
            </div>
            <div className="flex xs:mt-7 xs:ml-0">
                <p className="supplier-database__total-supplier-title">Total clientes</p>
                <p className="supplier-database__total-supplier-result">{lengthData.total}</p>
            </div>

            <PageButtonsFooter
                moduleId={ModuleApp.USER_ADMINISTRATION}
                titleButtonLeft={TitleButtons.NEXT}
                onClickButtonLeft={(): void => {}}
                disabledLeft
            />
        </div>
    );
};

export default CustomerCatalogs;
