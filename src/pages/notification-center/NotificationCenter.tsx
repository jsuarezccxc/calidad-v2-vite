import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DownloadIcons } from '@components/icon';
import { NotFindElements } from '@components/not-find-elements';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { IPaginatorBackend } from '@components/paginator-backend';
import { ChangeEvent } from '@components/radiobutton';
import { Table } from '@components/table';
import { Routes } from '@constants/Paths';
import { LANGUAGE_KEY } from '@constants/Translate';
import { paginationDataFormatDynamic } from '@constants/PaginationBack';
import { NOTIFICATION_INFORMATION } from '@information-texts/NotificationCenter';
import { IGenericRecord } from '@models/GenericRecord';
import { INotificationHistory } from '@models/Notification';
import { THREE } from '@pages/virtual-store-sales-receipts';
import { getNotificationsHistory } from '@redux/notifications/actions';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { currentDateInUnix, getUnixFromDate } from '@utils/Date';
import { downloadIconsProps } from '@utils/DownloadFile';
import { lengthEqualToZero } from '@utils/Length';
import { getRouteKey } from '@utils/Translation';
import { ModuleApp } from '@utils/GenerateId';
import { Inputs, Modal } from './components';
import { getRequestFile, props, TRANSLATION_KEY } from '.';
import './NotificationCenter.scss';

const NotificationCenter: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const { notificationsHistory } = useSelector(({ notifications }: RootState) => notifications);
    const [translate] = useTranslation(LANGUAGE_KEY);

    const [modal, setModal] = useState<boolean>(false);
    const [date, setDate] = useState<number>(currentDateInUnix());
    const [searchValue, setSearchValue] = useState<string>('');
    const [dataPagination, setDataPagination] = useState<IPaginatorBackend<INotificationHistory>>(
        paginationDataFormatDynamic<INotificationHistory>()
    );
    const { data } = dataPagination;
    const { inputs, table } = props;

    useEffect(() => {
        dispatch(getNotificationsHistory(date));
    }, [date]);

    useEffect(() => {
        notificationsHistory && setDataPagination(notificationsHistory);
    }, [notificationsHistory]);

    useEffect(() => {
        if (searchValue.length >= THREE || !searchValue) dispatch(getNotificationsHistory(date, false, searchValue));
    }, [searchValue]);

    const toggleModal = (): void => setModal(!modal);

    const handleDateChange = (date: Date): void => setDate(getUnixFromDate(date));

    const handleSearch = ({ target }: ChangeEvent): void => {
        setSearchValue(target.value);
    };

    const notResultsProps = !notificationsHistory?.data?.length
        ? { withoutData: true, customText: `${translate(`${TRANSLATION_KEY}.not-notifications`)}.` }
        : !data?.length && {};

    const downloadFile = (type: string): void => {
        data.length &&
            dispatch(getFile(getRequestFile(type, date, searchValue, data), translate(getRouteKey(Routes.NOTIFICATION_CENTER))));
    };

    return (
        <div className="notification-center">
            <div className="flex-1">
                <PageTitle title={translate(getRouteKey(Routes.NOTIFICATION_CENTER))} />
                <div className="my-4.5">
                    <h1 className="title--style">{translate(getRouteKey(Routes.NOTIFICATION_CENTER))}</h1>
                </div>
                <div className="information">
                    <p className="information__description">
                        {NOTIFICATION_INFORMATION(translate, TRANSLATION_KEY).description || ''}
                    </p>
                </div>
                <div className="flex items-end justify-between space-x-4 mt-4.5 width__download-container">
                    <Inputs data={inputs(date, handleDateChange, searchValue, handleSearch)} translate={translate} />
                    <div className="flex items-end mb-5.5 xs:hidden">
                        <DownloadIcons withoutText {...downloadIconsProps(downloadFile, ModuleApp.NOTIFICATION_ADMIN)} />
                    </div>
                </div>
                <div className="width__download-container">
                    <Table
                        {...table(data)}
                        paginatorBackendData={{
                            ...dataPagination,
                            setData: (newData?: IGenericRecord): void => {
                                setDataPagination(newData as IPaginatorBackend<INotificationHistory>);
                            },
                        }}
                    />
                </div>
                <Modal show={modal} showModal={toggleModal} translate={translate} />
                {lengthEqualToZero(data) && <NotFindElements {...notResultsProps} />}
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.NOTIFICATION_ADMIN}
                titleButtonLeft={translate('button.back')}
                onClickButtonLeft={(): void => history.goBack()}
            />
        </div>
    );
};

export default NotificationCenter;
