import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { ButtonWithIcon } from '@components/button';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { NAME_NOVELTIES_MODULE, OptionsField } from '@constants/DatabaseEmployees';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { getDateFromUnix } from '@utils/Date';
import { formatMoney } from '@utils/Decimals';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ID } from '@constants/UtilsConstants';
import { RootState } from '@redux/rootReducer';
import { getAdjustmentsHistoryEmployee, getDetailEmployee } from '@redux/company/actions';
import usePermissions from '@hooks/usePermissions';
import { DATABASE_EMPLOYEE, DETAIL_CONTENT } from '@information-texts/DatabaseEmployees';
import { IEmployeeDetail } from '@models/DataEmployees';
import { IDataEmployee } from './models/DatabaseEmployeeDetail';
import { CardDetails } from './components';
import { INITIAL_DATA, routes } from '.';
import './DatabaseEmployeeDetail.scss';

const DatabaseEmployeeDetail: React.FC = () => {
    const [history, { search }, dispatch] = [useHistory(), useLocation(), useDispatch()];
    const {
        company: { employee },
    } = useSelector(({ company }: RootState) => ({ company }));
    const [data, setData] = useState<IDataEmployee>(INITIAL_DATA);
    const { getPermissions, disabledInputs } = usePermissions();
    const isEnableNoveltiesModule = getPermissions(NAME_NOVELTIES_MODULE, getRouteName(Routes.DATABASE_EMPLOYEES));
    const searchParams = new URLSearchParams(search);
    const employeeId = searchParams.get(ID);
    const { TITLE, DESCRIPTION, BUTTON_NOVELTY, BUTTON_EDIT } = DETAIL_CONTENT;

    useEffect(() => {
        (async (): Promise<void> => {
            if (employeeId) {
                Promise.all([
                    await dispatch(getDetailEmployee(employeeId)),
                    await dispatch(getAdjustmentsHistoryEmployee(employeeId)),
                ]);
            }
        })();
    }, [employeeId]);

    useEffect(() => {
        employee && setData(handleFormatData(employee));
    }, [employee]);

    const handleFormatData = (data: IEmployeeDetail): IDataEmployee => {
        if (data?.id) {
            const { birthday, contract } = data;
            const { APPLY, NO_APPLY } = OptionsField;
            return {
                ...data,
                id: data.id || employeeId || '',
                birthday: getDateFromUnix(birthday).formattedDate,
                contract: {
                    ...contract,
                    initial_date: getDateFromUnix(contract.initial_date).formattedDate,
                    final_date: getDateFromUnix(contract.final_date).formattedDate,
                    salary: formatMoney(contract.salary, 0),
                    has_transportation_assistance: contract.has_transportation_assistance ? APPLY : NO_APPLY,
                },
            };
        }
        return INITIAL_DATA;
    };

    const handleEditEmployee = (id: string): void => {
        searchParams.set(ID, id);
        handleRedirect(getRoute(Routes.DATABASE_EMPLOYEES_FORM), searchParams);
    };

    const handleRedirect = (path: string, params?: URLSearchParams): void =>
        !params ? history.push(path) : history.push({ pathname: path, search: params.toString() });

    return (
        <div className="database-employee-detail">
            <PageTitle title={DATABASE_EMPLOYEE.TITLE} classTitle="text-left text-base" classContainer="w-full" />
            <BreadCrumb routes={routes()} className="mb-4.5" />
            <h2 className="text-26lg mb-4.5 text-blue text-center font-allerbold">{TITLE}</h2>
            {DESCRIPTION}
            <div className="container__buttons">
                {isEnableNoveltiesModule && (
                    <ButtonWithIcon
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-novelty',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="button--option"
                        nameIcon="sheetMulticolor"
                        onClick={(): void => handleRedirect(getRoute(Routes.HOME))}
                    >
                        {BUTTON_NOVELTY}
                    </ButtonWithIcon>
                )}
                <ButtonWithIcon
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                        submodule: 'edit-employee',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    className="button--option"
                    nameIcon="editMulticolor"
                    onClick={(): void => handleEditEmployee(data.id)}
                    disabled={disabledInputs}
                    classIcon="w-7.5 h-7.5"
                >
                    {BUTTON_EDIT}
                </ButtonWithIcon>
            </div>
            <div className="flex flex-col gap-y-4.5">
                <CardDetails data={data} />
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                    history,
                    (): void => handleRedirect(getRoute(Routes.DATABASE_EMPLOYEES)),
                    {
                        name: '#',
                        moduleName: getRouteName(Routes.DATABASE_MENU),
                    }
                )}
            />
        </div>
    );
};

export default DatabaseEmployeeDetail;
