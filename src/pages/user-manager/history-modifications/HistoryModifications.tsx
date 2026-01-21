import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';
import { RootState } from '@redux/rootReducer';
import { getFile, getLatestModifications } from '@redux/latest-modifications/actions';
import { getUsers } from '@redux/user/actions';
import useSearch from '@hooks/useSearch';
import useDate from '@hooks/useDate';
import useFilter from '@hooks/useFilter';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';
import { getDateFromUnix, getUnixFromDate, validateDateOrUnix } from '@utils/Date';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { getRouteKey } from '@utils/Translation';
import { sortArrayAlphabetically } from '@utils/Array';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import {
    props,
    timeModification,
    keyForSearch,
    START_DATE,
    USER,
    ALL_DATA,
    MODULE_HISTORY_MODIFICATIONS,
    PROFILE_COMPANY_MODULE,
    USER_HISTORY_MODIFICATIONS,
    USERS_MODULE,
} from '.';
import { LANGUAGE_KEY } from '@constants/Translate';
import { DatePickerDayInput, IOptionSelect, SearchInput, SelectInput, SelectSearchInput } from '@components/input';
import { DownloadIcons } from '@components/icon';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Information } from '@components/information';
import { NotFindElements } from '@components/not-find-elements';
import { Form } from '@components/form';
import { getRequestFile, routes } from '@pages/user-manager/history-modifications';
import { USER_MANAGEMENT_INFORMATION } from '@information-texts/UserManagement';
import useButtonProps from '@hooks/useButtonProps';
import { TableModifications } from './components';
import './HistoryModifications.scss';

const HistoryModifications: React.FC = () => {
    const dispatch = useDispatch();
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { getButtonProps } = useButtonProps();

    const {
        latestModifications: { modifications },
        user: { users },
    } = useSelector((state: RootState) => state);

    const modification = modifications.map(item => ({
        ...item,
        hour: timeModification(item.date),
        module: item.module === USERS_MODULE ? PROFILE_COMPANY_MODULE : item.module,
    }));

    const { dates, changeDate } = useDate();
    const [dataWhenSearching, setDataWhenSearching] = useState<IGenericRecord[]>([]);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [data, setData] = useState<IGenericRecord[]>(modification);

    const { onChangeFilter, filter, dataFiltered, setFilter } = useFilter(
        lengthGreaterThanZero(dataWhenSearching) ? dataWhenSearching : data
    );

    const { resultData, filterData, searchValue } = useSearch(lengthGreaterThanZero(filter) ? dataFiltered : data, keyForSearch);

    useEffect(() => {
        if (searchValue) {
            setDataWhenSearching(resultData);
            setIsSearch(true);
        }
    });

    useEffect(() => {
        setIsSearch(false);
    }, [dataFiltered]);

    useEffect(() => {
        dispatch(getLatestModifications(dates));
        setData(
            modifications.map(item => ({
                ...item,
                hour: validateDateOrUnix(item?.date) ? timeModification(getUnixFromDate(item.date)) : timeModification(item.date),
                module: item.module === USERS_MODULE ? PROFILE_COMPANY_MODULE : item.module,
            }))
        );
        setFilter([]);
    }, [dates]);

    useEffect(() => {
        setData(
            modifications.map(item => ({
                ...item,
                hour: validateDateOrUnix(item?.date) ? timeModification(getUnixFromDate(item.date)) : timeModification(item.date),
                module: item.module === USERS_MODULE ? PROFILE_COMPANY_MODULE : item.module,
            }))
        );
    }, [modifications]);

    const dataShowingTable = (): IGenericRecord[] => {
        if (lengthEqualToZero(filter) && !searchValue) {
            return data;
        }
        return isSearch ? resultData : dataFiltered;
    };

    useEffect(() => {
        dispatch(getUsers(true));
    }, []);

    const downloadFile = (type: string): void => {
        lengthGreaterThanZero(dataShowingTable()) && dispatch(getFile(getRequestFile(type, dataShowingTable(), dates)));
    };

    const getOptions = (key: string): IOptionSelect[] => {
        const modules: IOptionSelect[] = [];

        const allOptions = {
            key: uuid(),
            value: ALL_DATA,
        };

        const usersModifications = users?.map((item: IGenericRecord) => ({
            key: item.id,
            value: item.name,
            type: USER_HISTORY_MODIFICATIONS,
        }));

        new Set(modifications.map(item => item[key])).forEach((value, index) => {
            modules.push({
                key: index,
                value: value === USERS_MODULE ? PROFILE_COMPANY_MODULE : value,
                type: MODULE_HISTORY_MODIFICATIONS,
            });
        });

        return key === USER ? [...usersModifications, allOptions] : [...modules, allOptions];
    };

    const getOptionsUsers = (): SelectSearchOption[] => {
        const allOptions = {
            key: uuid(),
            name: ALL_DATA,
            value: ALL_DATA,
        };

        const usersModifications = sortArrayAlphabetically(
            users?.map((item: IGenericRecord) => ({
                key: item.id,
                name: item.name,
                value: item.name,
                type: USER_HISTORY_MODIFICATIONS,
            }))
        );

        return [...usersModifications, allOptions];
    };

    const getMaxDate = (name: string, finish_date: number): Date | undefined => {
        const { dateFormat } = getDateFromUnix(finish_date, 'MM-DD-YYYY');
        return name === START_DATE ? new Date(dateFormat) : new Date();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <PageTitle title={translate(getRouteKey(Routes.HOME))} />
                <BreadCrumb routes={routes()} />
                <Information
                    title={translate(getRouteKey(Routes.HOME))}
                    description={USER_MANAGEMENT_INFORMATION.HISTORY_MODIFICATIONS_DESCRIPTION(translate)}
                />
                <div className="flex items-end justify-between space-x-4 margin-top">
                    <Form className="flex flex-row xs:w-full">
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.HISTORY_MODIFICATION,
                                submodule: `start-date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="startDate"
                            labelText={`${translate('fields.initial-date')}:`}
                            classesWrapper="w-40 mr-4 xs:mr-8 xs:w-1/2"
                            selected={dates.start_date}
                            onChangeDate={(e: Date): void => changeDate(e, 'start_date')}
                            maxDate={getMaxDate('start_date', dates.finish_date)}
                        />
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.HISTORY_MODIFICATION,
                                submodule: `finish-date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="finishDate"
                            labelText={`${translate('fields.final-date')}:`}
                            classesWrapper="w-40 xs:w-1/2"
                            selected={dates.finish_date}
                            onChangeDate={(e: Date): void => changeDate(e, 'finish_date')}
                            maxDate={getMaxDate('finish_date', dates.finish_date)}
                        />
                    </Form>
                    <div className="flex items-end xs:hidden">
                        <DownloadIcons {...props().downloadIcons(downloadFile)} moduleId={ModuleApp.HISTORY_MODIFICATION} />
                    </div>
                </div>
                <Form className="flex flex-row lg:space-x-4 xs:flex-col xs:w-full lg:mb-4.5 lg:mt-5">
                    <SearchInput
                        id={generateId({
                            module: ModuleApp.HISTORY_MODIFICATION,
                            submodule: `search`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={`${translate('fields.action-finder')}:`}
                        placeholder="..."
                        name="search"
                        classesWrapper="mt-5 lg:mt-0 w-73 mb-5 lg:mb-0 lg:w-73 md:w-73 xs:mt-1.5 xs:w-full xs:mb-1"
                        onChange={filterData}
                    />
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.HISTORY_MODIFICATION,
                            submodule: `filter--by-module`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="module"
                        placeholder={translate('fields.select')}
                        labelText={`${translate('fields.filter-by-module')}:`}
                        options={getOptions(MODULE_HISTORY_MODIFICATIONS)}
                        optionSelected={(option): void => {
                            if (option.value === ALL_DATA) return setFilter([]);
                            onChangeFilter(option);
                        }}
                        classesWrapper="xs:mt-2 md:w-73 xs:w-full xs:mb-4"
                        clearOption={lengthEqualToZero(filter)}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.HISTORY_MODIFICATION,
                            submodule: `users`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        name="user"
                        placeholder={translate('fields.select')}
                        labelText={`${translate('fields.filter-by-user')}:`}
                        optionSelect={getOptionsUsers()}
                        onChangeSelect={(value, option): void => {
                            if (option.value === ALL_DATA) return setFilter([]);
                            onChangeFilter(option);
                        }}
                        classesWrapper="md:w-73 xs:w-full xs:-mt-1 xs:mb-2"
                        clearOption={lengthEqualToZero(filter)}
                    />
                </Form>
                <div className="md:hidden xs:mb-3 xs:mt-4">
                    <DownloadIcons {...props().downloadIcons(downloadFile)} />
                </div>
                <div>
                    <TableModifications dataTable={dataShowingTable()} translate={translate} />
                    {lengthEqualToZero(data) ? (
                        <NotFindElements
                            withoutData
                            customText={`${translate('company-profile.history-modifications.without-users')}.`}
                        />
                    ) : dataShowingTable() && lengthEqualToZero(dataShowingTable()) ? (
                        <NotFindElements />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <PageButtonsFooter
                {...getButtonProps({
                    moduleId: ModuleApp.HISTORY_MODIFICATION,
                    rightPath: getRoute(Routes.HOME),
                    permissions: {
                        name: Routes.HOME,
                        moduleName: Routes.HOME,
                    },
                })}
            />
        </div>
    );
};

export default HistoryModifications;
