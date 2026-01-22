import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import dayjs from '@utils/Dayjs';
import { v4 as uuid } from 'uuid';
import { getHistoryModifications } from '@redux/modification-history/actions';
import { RootState } from '@redux/rootReducer';
import { getFile, getUsers } from '@redux/user/actions';
import { Form } from '@components/form';
import { DownloadIcons } from '@components/icon';
import { DatePickerDayInput, IOptionSelect, SearchInput, SelectInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Table } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { IUser } from '@models/User';
import { sortArrayAlphabetically } from '@utils/Array';
import { getUnixFromDate } from '@utils/Date';
import { downloadIconsProps } from '@utils/DownloadFile';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { TWO } from '@constants/ElectronicInvoice';
import { IGenericPaginationData, paginationDataFormat } from '@constants/PaginationBack';
import { LANGUAGE_KEY } from '@constants/Translate';
import { getRequestFile, props, ROUTE_MODIFICATION } from '.';
import './ModificationHistory.scss';

const ModificationHistory: React.FC = () => {
    const [date, setDate] = useState<number>(dayjs().unix());
    const [user, setUser] = useState<IOptionSelect | null>();
    const [searchValue, setSearchValue] = useState<string>('');
    const [reloadPaginator, handleReloadPaginator] = useState<boolean>(false);
    const [dataModifications, setDataModifications] = useState<IGenericPaginationData>(paginationDataFormat);

    const history = useHistory();
    const dispatch = useDispatch();
    const [translate] = useTranslation(LANGUAGE_KEY);

    const { users, modificationsHistory, loader: loaderState } = useSelector(
        ({ modificationsHistory, user, loader }: RootState) => ({
            ...modificationsHistory,
            ...user,
            ...loader,
        })
    );

    const { tableProps } = props;

    const usersHistory = useMemo(() => {
        return sortArrayAlphabetically(
            users?.data?.map?.((item: IUser) => ({
                id: item?.id,
                key: uuid(),
                name: item?.name,
                value: item?.name,
            }))
        );
    }, [users]);

    const handleUser = (option: IOptionSelect): void => {
        setUser(option);
        setSearchValue('');
        handleReloadPaginator(!reloadPaginator);
    };

    const downloadFile = (type: string): void => {
        dataModifications.data.length &&
            dispatch(
                getFile(
                    getRequestFile({
                        type,
                        date,
                        data: dataModifications.data,
                        search: searchValue,
                        user_name: user?.name ?? null,
                    }),
                    translate(ROUTE_MODIFICATION)
                )
            );
    };

    const filterModifications = ({ target }: ChangeEvent<HTMLInputElement>): void => setSearchValue(target.value);

    useEffect(() => {
        dispatch(getUsers(true));
    }, []);

    useEffect(
        () => {
            dispatch(getHistoryModifications({ user_id: user?.id, date, search: searchValue?.length > 3 ? searchValue : '' }));
        },
        searchValue.length > TWO || !searchValue.length ? [user, date, searchValue] : [user, date]
    );

    useEffect(() => {
        setDataModifications(modificationsHistory || []);
    }, [modificationsHistory]);

    return (
        <div className="xs:px-2">
            <PageTitle title={translate(ROUTE_MODIFICATION)} classTitle="text-left text-base" classContainer="w-full" />
            <h2 className="main--title">{translate(ROUTE_MODIFICATION)}</h2>
            <p className="mb-5">
                A continuación visualice el listado de todas las modificaciones que se han realizado en diggi pymes.
            </p>
            <Form className="section">
                <div className="section__container">
                    <div className="section__container--input">
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.HISTORY_MODIFICATION,
                                submodule: `date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="date"
                            maxDate={dayjs().toDate()}
                            selected={date}
                            labelText={`${translate('fields.date')}:`}
                            classesWrapper="class-input"
                            selectIconType="calendarGreen"
                            onChangeDate={(d: Date): void => setDate(getUnixFromDate(d))}
                        />
                    </div>
                    <div className="section__container--input">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.HISTORY_MODIFICATION,
                                submodule: `user`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            name="user"
                            options={usersHistory}
                            labelText={`${translate('fields.user')}:`}
                            placeholder={translate('fields.select')}
                            classesWrapper="class-input"
                            selectIconType="arrowDownGreen"
                            optionSelected={handleUser}
                        />
                    </div>
                    <div className="section__container--input">
                        <SearchInput
                            id={generateId({
                                module: ModuleApp.HISTORY_MODIFICATION,
                                submodule: `search`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            value={searchValue}
                            labelText={`${translate('fields.search')}:`}
                            placeholder="..."
                            classesWrapper="class-input"
                            onChange={filterModifications}
                        />
                    </div>
                </div>
                <div className="section__download">
                    <DownloadIcons
                        moduleId={ModuleApp.HISTORY_MODIFICATION}
                        withoutText
                        className="justify-end"
                        download={downloadIconsProps(downloadFile, ModuleApp.HISTORY_MODIFICATION).download}
                    />
                </div>
            </Form>
            <div className="table--container">
                <Table
                    isLoading={loaderState}
                    {...tableProps(modificationsHistory?.data, reloadPaginator)}
                    paginatorBackendData={{
                        ...dataModifications,
                        setData: (data?: IGenericRecord): void => {
                            setDataModifications(data as IGenericPaginationData);
                        },
                    }}
                />
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.HISTORY_MODIFICATION}
                titleButtonLeft="Atrás"
                onClickButtonLeft={(): void => history.goBack()}
            />
        </div>
    );
};

export default ModificationHistory;
