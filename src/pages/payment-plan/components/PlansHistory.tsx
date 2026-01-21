/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form } from '@components/form';
import { DownloadIcons, Icon } from '@components/icon';
import { DatePickerDayRange } from '@components/input';
import { Paginator } from '@components/paginator';
import { Table } from '@components/table';
import { ITEMS_PAGE } from '@constants/Paginator';
import { ZERO } from '@constants/Numbers';
import usePaginator from '@hooks/usePaginator';
import { IGenericRecord } from '@models/GenericRecord';
import { getFile } from '@redux/user/actions';
import { getDateFromUnix, getUnix, getUnixCalendar, getUnixFromDate } from '@utils/Date';
import { formatMoney } from '@utils/Decimals';
import { downloadIconsProps } from '@utils/DownloadFile';
import { isEven } from '@utils/Number';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { EXCLUDED_MODULE, QUANTITY_ALLOWED_DE_MODULE, UNLIMITED_SUBMODULE } from '..';
import { PLAN_HISTORY_HEADERS, formatReportData, getRequestFile, FILE_TITLE } from '.';

export const PlansHistory: React.FC<{ plans: IGenericRecord[]; isLoadingTable?: boolean }> = ({ plans, isLoadingTable }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState<IGenericRecord[]>([]);
    const [dates, setDates] = useState<{ end: Date; start: Date }>({ start: new Date(), end: new Date() });
    const [startDate, setStartDate] = useState<number>(0);

    const { paginator, getLimits } = usePaginator(data);

    useEffect(() => {
        setData(plans);
        setFilterDates();
    }, [plans]);

    useEffect(() => {
        getLimits();
    }, [data]);

    useEffect(() => {
        filterByDates();
    }, [dates]);

    const downloadFile = (type: string): void => {
        const formattedDates = { start_date: startDate, finish_date: getUnixCalendar(getUnixFromDate(dates.end), false) };
        dispatch(getFile(getRequestFile({ type, data: formatReportData(data), formattedDates }), FILE_TITLE));
    };

    const filterByDates = (): void => {
        const [startDate, endDate] = [getUnix(dates.start), getUnix(dates.end)];
        setData(plans.filter(({ initial_date }) => initial_date >= startDate && initial_date <= endDate));
    };

    const setFilterDates = (): void => {
        if (plans.length) {
            const minorDate = Math.min(...plans.map(plan => plan.initial_date));
            setStartDate(minorDate);
            setDates({ start: new Date(getDateFromUnix(minorDate).date), end: new Date() });
        }
    };

    const handleDateChange = ([start, end]: any): void => setDates({ start, end });

    return (
        <div className="plans-history">
            <Form className="plans-history__filters">
                <DatePickerDayRange
                    id={generateId({
                        module: ModuleApp.PAYMENT_PLANS,
                        submodule: 'history-date-range',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    classesWrapper="plans-history__date-picker"
                    labelText="Fecha:"
                    startDate={dates?.start}
                    endDate={dates?.end}
                    maxDate={new Date()}
                    onChangeDateRange={handleDateChange}
                />
                <DownloadIcons withoutText {...downloadIconsProps(downloadFile, ModuleApp.PAYMENT_PLANS)} />
            </Form>
            <Table
                id={generateId({
                    module: ModuleApp.PAYMENT_PLANS,
                    submodule: 'history',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                wrapperClassName="plan-table"
                className="historical-table xs:w-max"
                customTable
                data={[]}
                headerRowsCustom={<TableHeaders />}
                isHeaderRowsCustom
                withScrollTable
                isLoading={isLoadingTable}
            >
                {paginator.dataLimits.map(
                    ({ discount, expiration_date, initial_date, nameModule, name, netPrice, quantity }, index) => {
                        const { formattedDate } = getDateFromUnix(initial_date);
                        const formattedExpirationDateOriginal = getDateFromUnix(expiration_date).formattedDate;

                        const shouldShowNA =
                            nameModule?.toLowerCase().includes(EXCLUDED_MODULE) &&
                            QUANTITY_ALLOWED_DE_MODULE.includes(Number(quantity ?? ZERO)) &&
                            !nameModule?.toLowerCase().includes(UNLIMITED_SUBMODULE);

                        const formattedExpirationDate = shouldShowNA ? 'N/A' : formattedExpirationDateOriginal;

                        return (
                            <tr
                                id={generateId({
                                    module: ModuleApp.PAYMENT_PLANS,
                                    submodule: `history-${index}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                className={`${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'}`}
                                key={`${nameModule}-${index}`}
                            >
                                <td className="table-field table-field--disabled">
                                    <p className="historical-table__field">
                                        {formattedDate}
                                        <Icon name="calendarGray" classIcon="w-5.5 h-5.5" />
                                    </p>
                                </td>
                                <td className="table-field table-field--disabled">{nameModule || name}</td>
                                <td className="table-field table-field--disabled">{formatMoney(netPrice, 0)}</td>
                                <td className="table-field table-field--disabled">{formatMoney(discount, 0)}</td>
                                <td className="table-field table-field--disabled">{formatMoney(netPrice - discount, 0)}</td>
                                <td className="table-field table-field--disabled">
                                    <p className="historical-table__field">
                                        {formattedExpirationDate}
                                        <Icon name="calendarGray" classIcon="w-5.5 h-5.5" />
                                    </p>
                                </td>
                            </tr>
                        );
                    }
                )}
            </Table>
            {!!(plans.length > ITEMS_PAGE && data.length) && <Paginator {...paginator} />}
        </div>
    );
};

const TableHeaders: React.FC = () => (
    <tr className="bg-green-extraLight">
        {PLAN_HISTORY_HEADERS.map(({ className, title }, index) => (
            <th
                id={generateId({
                    module: ModuleApp.PAYMENT_PLANS,
                    submodule: `history-${title}-${index}`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.COL,
                })}
                key={title}
                className={`table-head historical-table__${className}`}
            >
                {title}
            </th>
        ))}
    </tr>
);
