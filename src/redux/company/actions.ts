import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { setSession } from '@redux/session/actions';
import { MembershipActions } from '@redux/membership/types';
import {
    ISetCompany,
    ISetDocumentTypes,
    ISetCountries,
    ISetDepartments,
    ISetCities,
    ISetCountryDepartments,
    ISetDepartmentCities,
    ISetCiius,
    ISetPersonType,
    ISetError,
    ActionKeys,
    CompanyActions,
    ISetTerms,
    ISetPhysicalStores,
    ISetActiveModules,
    ISetDateMembership,
    ISetCompanyTaxes,
    ISetAreas,
    ISetEmployees,
    ISetEmployee,
    ISetAdjustmentHistoryEmployee,
    ISetDEFirstTime,
    ISetPlanHistory,
} from './types';
import { ISetResponsibilities, ISetForeignExchange, ISetData, ISetTaxDetails } from './types';
import {
    ICompany,
    IDocumentType,
    ICountry,
    IDepartment,
    ICity,
    ICiiu,
    IResponsibility,
    IForeignExchange,
    ICompanyTaxes,
} from '@models/Company';
import { IArea, IDeleteData, IEmployeeDetail, IFormEmployee, IHistory } from '@models/DataEmployees';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { apiDeleteCompany, apiGetAdminCustomers, apiGetCompany, apiPostCompany } from '@api/company';
import { urls } from '@api/urls';
import { apiPostInstructions } from '@api/instructions';
import { apiGetPayroll, apiPostPayroll } from '@api/payroll';
import { apiGetBinnacle } from '@api/binnacle';
import { apiGetUtils as apiGetUtilsInventory, apiPostUtils } from '@api/inventory';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import {
    CIIUS,
    COUNTRIES,
    DOCUMENT_TYPES,
    FISCAL_RESPONSIBILITIES,
    FOREIGN_EXCHANGE,
    PER_PAGE_RANGE,
    TAX_DETAILS,
} from '@constants/UtilsConstants';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { COLOMBIA_ID } from '@constants/Location';
import { INITIAL_COMPANY } from '@constants/Company';
import { SessionActions } from '../session/types';
import { apiGetUtils } from '@api/utils';
import { getUserData } from '@utils/User';

export const setRegisterData = (data: IGenericRecord): ISetData => ({
    type: ActionKeys.SET_DATA,
    data,
});
export const setCompany = (information: ICompany): ISetCompany => ({
    type: ActionKeys.SET_COMPANY,
    information,
});

export const setDocumentTypes = (document_types: IDocumentType[]): ISetDocumentTypes => ({
    type: ActionKeys.SET_DOCUMENT_TYPES,
    document_types,
});

export const setCountries = (countries: ICountry[]): ISetCountries => ({
    type: ActionKeys.SET_COUNTRIES,
    countries,
});

export const setDepartments = (departments: IDepartment[]): ISetDepartments => ({
    type: ActionKeys.SET_DEPARTMENTS,
    departments,
});

export const setCities = (cities: ICity[]): ISetCities => ({
    type: ActionKeys.SET_CITIES,
    cities,
});

export const setCountryDepartments = (country_departments: IDepartment[]): ISetCountryDepartments => ({
    type: ActionKeys.SET_COUNTRY_DEPARTMENTS,
    country_departments,
});

export const setDepartmentCities = (department_cities: ICity[]): ISetDepartmentCities => ({
    type: ActionKeys.SET_DEPARTMENT_CITIES,
    department_cities,
});

export const setCiius = (ciius: ICiiu[]): ISetCiius => ({
    type: ActionKeys.SET_CIIUS,
    ciius,
});

export const setResponsibilities = (responsibilities: IResponsibility[]): ISetResponsibilities => ({
    type: ActionKeys.SET_RESPONSIBILITIES,
    responsibilities,
});

export const setForeignExchangeTypes = (foreign_exchange: IForeignExchange[]): ISetForeignExchange => ({
    type: ActionKeys.SET_FOREIGN_EXCHANGE,
    foreign_exchange,
});

export const setTerms = (): ISetTerms => ({
    type: ActionKeys.SET_TERMS,
});

export const setTaxDetails = (tax_details: IGenericRecord[]): ISetTaxDetails => ({
    type: ActionKeys.SET_TAX_DETAILS,
    tax_details,
});

export const setPersonType = (tax_payer: IGenericRecord[]): ISetPersonType => ({
    type: ActionKeys.SET_PERSON_TYPE,
    person_type: tax_payer,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setPhysicalStore = (physical_stores: IGenericRecord[]): ISetPhysicalStores => ({
    type: ActionKeys.SET_PHYSICAL_STORES,
    physical_stores,
});

export const setActiveModules = (modules: IGenericRecord): ISetActiveModules => ({
    type: ActionKeys.SET_ACTIVE_MODULES,
    modules,
});

export const setCompanyTaxes = (companyTaxes: ICompanyTaxes[]): ISetCompanyTaxes => ({
    type: ActionKeys.SET_COMPANY_TAXES,
    companyTaxes,
});

export const setDateMembership = (dateMembership: string): ISetDateMembership => ({
    type: ActionKeys.SET_DATE_MEMBERSHIP,
    dateMembership,
});

export const setEmployees = (employees: IGenericRecord[]): ISetEmployees => ({
    type: ActionKeys.SET_EMPLOYEES,
    employees,
});

export const setEmployee = (employee: IEmployeeDetail | null): ISetEmployee => ({
    type: ActionKeys.SET_EMPLOYEE,
    employee,
});

export const setAdjustmentHistoryEmployee = (adjustmentHistoryEmployee: IHistory[]): ISetAdjustmentHistoryEmployee => ({
    type: ActionKeys.SET_ADJUSTMENT_HISTORY_EMPLOYEE,
    adjustmentHistoryEmployee,
});

export const setAreas = (areas: IArea[]): ISetAreas => ({
    type: ActionKeys.SET_AREAS,
    areas,
});

export const setDatabaseEmployees = (databaseEmployees: boolean): ISetDEFirstTime => ({
    type: ActionKeys.SET_DATABASE_EMPLOYEE_FIRST_TIME,
    databaseEmployees,
});

export const setPlanHistory = (data: IGenericRecord[]): ISetPlanHistory => ({
    type: ActionKeys.SET_PLAN_HISTORY,
    payload: data,
});

export const getInformationCompany = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>, getState): Promise<void> => {
        try {
            const {
                company: { information },
            } = getState();

            const { company_id } = getUserData();
            const urlId = information?.id || company_id;
            const url = urls.company.get(urlId);
            const request = new FetchRequest(url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetCompany(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(
                    setCompany({
                        ...data,
                        ciius: lengthGreaterThanZero(data.ciius) ? data.ciius : INITIAL_COMPANY.ciius,
                    })
                );
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDocumentTypes = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getDocumentTypes);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setDocumentTypes(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCountries = (includeColombia = true): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getCountries);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setCountries(includeColombia ? data : data?.filter((item: IGenericRecord) => item.id !== COLOMBIA_ID)));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDepartments = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getDepartments);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setDepartments(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCities = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getCities);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setCities(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDepartmentsForCountry = (country_id: string): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getDepartmentsForCountry(country_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setCountryDepartments(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCitiesForDepartment = (department_id: string): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getCitiesForDepartment(department_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setDepartmentCities(data));
                return data;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCiius = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getCiius);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setCiius(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getResponsibilities = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.fiscal_responsibility);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtilsInventory(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setResponsibilities(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateDataCompany = (
    dataRequest: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions | SessionActions>, getState): Promise<void> => {
        try {
            //const { id, company_id } = JSON.parse(LocalStorage.get(LoginConstants.USER_TOKEN));
            const { session } = getState();
            const request = new FetchRequest(urls.company.company, dataRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostCompany(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setCompany(data.company));
                if (session.accessToken && session.expirationTime)
                    dispatch(
                        setSession(session.accessToken, session.expirationTime, {
                            ...session.user,
                            roles: data.user.roles,
                            company_id: data.company.id,
                            company_name: data.company.name,
                        })
                    );
            }
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUtilitiesCompany = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions | MembershipActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, [
                FISCAL_RESPONSIBILITIES,
                DOCUMENT_TYPES,
                COUNTRIES,
                CIIUS,
                FOREIGN_EXCHANGE,
                TAX_DETAILS,
            ]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostUtils(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setRegisterData(data));
                dispatch(setCountries(data.countries));
                dispatch(setResponsibilities(data.fiscal_responsibilities));
                dispatch(setTaxDetails(data.tax_details));
                dispatch(setForeignExchangeTypes(data.foreign_exchange));
                dispatch(setCiius(data.ciius));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPersonType = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.tax_payer);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetUtilsInventory(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(setPersonType(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPhysicalStores = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.physicalStore);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetCompany(request);
            dispatch(setPhysicalStore(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const savePhysicalStores = (payload: IGenericRecord[]): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.postPhysicalStore, payload);
            await apiPostCompany(request);
            dispatch(getPhysicalStores());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deletePhysicalStores = (
    payload: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.deletePhysicalStore, payload);
            await apiDeleteCompany(request);
            await dispatch(getPhysicalStores());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const removePhysicalStore = (
    payload: IGenericRecord[] | IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.removePhysicalStore, payload);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiDeleteCompany(request);
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const cancelMembership = (
    dataCancel: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.company.postCancelMembership, dataCancel);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPostCompany(request);
            return isCorrectResponse(statusCode);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const getActiveModules = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.activeModules);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetCompany(request);
            dispatch(setActiveModules(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDataBinnacleMembership = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.binnacleMembership);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetCompany(request);
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCompanyTaxes = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.companyTaxes);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetCompany(request);
            dispatch(setCompanyTaxes(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteCompanyTaxes = (ids: string[]): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(`${urls.company.companyTaxes}/many`, ids);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await apiDeleteCompany(request);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postGeneralTaxes = (data: ICompanyTaxes[]): ThunkAction<Promise<boolean>, RootState, null, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CompanyActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.company.companyTaxes, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data: companyTaxes }: any = await apiPostCompany(request);
            const response = isCorrectResponse(statusCode);
            if (response) {
                await dispatch(setCompanyTaxes(companyTaxes));
                return response;
            }
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const postInstructions = (
    instructions: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.instructions.main, instructions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiPostInstructions(request);

            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setCompany(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getListEmployees = (isList = false): ThunkAction<Promise<IGenericRecord[]>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<IGenericRecord[]> => {
        try {
            const request = new FetchRequest(
                isList ? `${urls.payroll.employees}?per_page=${PER_PAGE_RANGE}` : urls.payroll.employees
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPayroll(request);
            dispatch(setEmployees(data || []));
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
            return [];
        }
    };
};

export const getDetailEmployee = (employeeId: string): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payroll.employee(employeeId));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPayroll(request);
            dispatch(setEmployee(data || null));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAdjustmentsHistoryEmployee = (
    employeeId: string
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.bin.internalActivities(employeeId));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setAdjustmentHistoryEmployee(data || []));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const saveDataEmployee = (
    dataEmployee: IFormEmployee,
    actionSuccess: () => void
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payroll.employees, dataEmployee);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostPayroll(request);
            if (data) {
                dispatch(setEmployee(data));
                actionSuccess();
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAreas = (isList = false): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(isList ? `${urls.payroll.areas}?per_page=${PER_PAGE_RANGE}` : urls.payroll.areas);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPayroll(request);
            dispatch(setAreas(data || []));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const saveDataAreas = (
    areas: IArea[],
    modalSuccess: () => void
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payroll.areas, areas);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostPayroll(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setAreas(data || []));
                modalSuccess();
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteDataAreas = (dataToDelete: IDeleteData): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payroll.deleteAreas, dataToDelete);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await apiPostPayroll(request);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPlanHistory = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(`${urls.company.getPlanHistory}?per_page=${PER_PAGE_RANGE}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetCompany(request);
            dispatch(setPlanHistory(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAdminCustomers = (): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.company.companiesAdministration);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetAdminCustomers(request);
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
