import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BreadCrumb } from '@components/bread-crumb';
import { ChangeEvent, IOptionSelect } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { IBodyTable, IHeaderTable, Table } from '@components/table';
import { Routes } from '@constants/Paths';
import { LANGUAGE_KEY } from '@constants/Translate';
import usePermissions from '@hooks/usePermissions';
import { DATABASE_EMPLOYEE } from '@information-texts/DatabaseEmployees';
import { IGenericRecord } from '@models/GenericRecord';
import { getListEmployees } from '@redux/company/actions';
import { RootState } from '@redux/rootReducer';
import { buttonsFooterProps } from '@utils/Button';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { lowerCase } from '@utils/Text';
import { getRouteKey } from '@utils/Translation';
import { ModuleApp } from '@utils/GenerateId';
import { HeaderDatabaseEmployee, Inputs } from './components';
import { CurrentField, fieldsBody, headersTable, inputsProps, listColumns, routes, STATUS, STATUS_SELECT, tableProps } from '.';
import './DatabaseEmployees.scss';

const DatabaseEmployees: React.FC = () => {
    const [history, dispatch] = [useHistory(), useDispatch()];
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { TITLE, DESCRIPTION } = DATABASE_EMPLOYEE;
    const { disabledInputs } = usePermissions();

    const {
        employees: { data: employees },
        loader: loaderState,
    } = useSelector(({ company, loader }: RootState) => ({ ...company, ...loader }));
    const [data, setData] = useState<IGenericRecord[]>([]);
    const [columns, setColumns] = useState<string>('');
    const [statusOption, setStatusOption] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectEmployee, setSelectEmployee] = useState<string>('');
    const [table, setTable] = useState<{ headers: IHeaderTable[]; body: IBodyTable[] }>({ headers: [], body: [] });
    const [optionsColumns, setOptionsColumns] = useState<IOptionSelect[]>([]);

    useEffect(() => {
        (async (): Promise<void> => {
            const response: IGenericRecord = await dispatch(getListEmployees(true));
            if (!response?.data?.length) return history.push(getRoute(Routes.DATABASE_EMPLOYEES_FORM));
        })();
        setTable({
            headers: headersTable(),
            body: fieldsBody(handleDetailEmployee),
        });
        initializeOptionColumns();
    }, []);

    useEffect(() => {
        setData(employees);
    }, [employees]);

    useEffect(() => {
        handleUpdateDataByFilter();
    }, [columns, statusOption, searchValue]);

    useEffect(() => {
        selectEmployee && handleRedirectDetail(selectEmployee);
    }, [selectEmployee]);

    const handleUpdateDataByFilter = (): void => {
        let filteredData = [];
        generateOptionsHeader(columns);
        filteredData = handleFilterByStatus(employees, statusOption);
        filteredData = handleFilterBySearch(filteredData, searchValue);
        setData(filteredData);
    };

    const initializeOptionColumns = (): void => {
        const options = listColumns.map(column => ({
            key: String(column.id),
            value: column.name,
            multiSelectCheck: { value: false },
        }));
        setOptionsColumns(options);
    };

    const generateOptionsHeader = (columns: string): void => {
        if (lengthGreaterThanZero(columns)) {
            const newHeaders: IHeaderTable[] = [];
            const newBody: IBodyTable[] = [];
            const currentColumns: string[] = columns.split(', ');
            currentColumns.forEach(columnSelected => {
                const findIndexColumn = headersTable().findIndex(header => header.title === columnSelected);
                if (findIndexColumn > -1) {
                    const columnHeader = headersTable()[findIndexColumn];
                    const columnBody = fieldsBody(handleDetailEmployee)[findIndexColumn];
                    newHeaders.push(columnHeader);
                    newBody.push(columnBody);
                }
            });
            setTable({
                headers: newHeaders,
                body: newBody,
            });
        } else {
            setTable({
                headers: headersTable(),
                body: fieldsBody(handleDetailEmployee),
            });
        }
    };

    const handleFilterBySearch = (data: IGenericRecord[], value: string): IGenericRecord[] => {
        if (value) {
            return data.filter(item => lowerCase(item.name)?.includes(lowerCase(value)) || item.document_number?.includes(value));
        }
        return data;
    };

    const handleFilterByStatus = (data: IGenericRecord[], status: string): IGenericRecord[] => {
        const [SELECT_ACTIVE, SELECT_INACTIVE] = STATUS_SELECT;
        const [INACTIVE, ACTIVE] = STATUS;
        let filterData: IGenericRecord[] = lengthGreaterThanZero(data) ? [...data] : [];
        if (status === SELECT_ACTIVE) {
            filterData = filterData.filter(employee => employee.status === ACTIVE);
        } else if (status === SELECT_INACTIVE) {
            filterData = filterData.filter(employee => employee.status === INACTIVE);
        }
        return filterData;
    };

    const handleChangeSelect = (option: IOptionSelect, name: string): void => {
        if (name === CurrentField.COLUMNS) {
            let selectValue = '';
            const options = [...optionsColumns];
            const newOptions = options.map(element => {
                if (element.key === option.key) {
                    const { multiSelectCheck } = option;
                    return {
                        ...element,
                        multiSelectCheck: {
                            value: !multiSelectCheck?.value,
                        },
                    };
                }
                return element;
            });
            newOptions.forEach(tax => {
                if (tax?.multiSelectCheck?.value) {
                    selectValue += selectValue ? `, ${tax.value}` : tax.value;
                }
            });

            setOptionsColumns(newOptions);
            return setColumns(selectValue);
        } else {
            return setStatusOption(option.value);
        }
    };

    const handleSearch = ({ target }: ChangeEvent): void => {
        const currentValue = target.value;
        setSearchValue(currentValue);
    };

    const handleDetailEmployee = (item: IGenericRecord): void => setSelectEmployee(item.id);

    const handleRedirectDetail = (id: string): void => {
        history.push(`${getRoute(Routes.DATABASE_EMPLOYEE_DETAIL)}?id=${id}`);
    };

    const handleRedirect = (path: string, params?: URLSearchParams): void =>
        history.push({ pathname: path, ...(params && { search: params.toString() }) });

    return (
        <div className="database-employees">
            <PageTitle title={TITLE} classTitle="text-left text-base" classContainer="w-full" />
            <BreadCrumb routes={routes()} className="mb-4.5" />
            <h2 className="text-26lg mb-4.5 text-blue text-center font-allerbold ">
                {translate(getRouteKey(Routes.DATABASE_EMPLOYEES))}
            </h2>
            {DESCRIPTION}
            <Inputs
                data={inputsProps(optionsColumns, columns, statusOption, handleChangeSelect, searchValue, handleSearch)}
                handleRedirect={(): void => handleRedirect(getRoute(Routes.DATABASE_EMPLOYEES_FORM))}
            />
            <Table
                isLoading={loaderState}
                disabled={disabledInputs}
                editable={!disabledInputs}
                {...tableProps(data, table.body)}
                isHeaderRowsCustom
                headerRowsCustom={<HeaderDatabaseEmployee data={table.headers} />}
            />
            <div className="total__container">
                <div className="total--text">Total empleados</div>
                <div className="total--number">{data?.length}</div>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                    history,
                    (): void => handleRedirect(getRoute(Routes.DATABASE_ORGANIZATION_CHART)),
                    {
                        name: '#',
                        moduleName: getRouteName(Routes.DATABASE_MENU),
                    }
                )}
            />
        </div>
    );
};

export default DatabaseEmployees;
