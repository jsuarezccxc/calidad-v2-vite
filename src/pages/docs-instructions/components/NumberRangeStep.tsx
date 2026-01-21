import React, { useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { Button } from '@components/button';
import { Table } from '@components/table';
import { DatePickerBase } from '@components/date-picker';
import { NumberInput, TextInput } from '@components/input';
import { Paginator } from '@components/paginator';
import { ITEMS_PAGE } from '@constants/Paginator';
import { HeaderColumn } from '@pages/number-range/components';
import { NumberRangeContext } from '@pages/number-range/context';
import usePopper from '@hooks/usePopper';
import usePaginator from '@hooks/usePaginator';
import { MAXIMUM_LENGTH_FIELDS } from '@pages/number-range';
import { DocsInstructionContext, TypeDoc } from '../context';
import { HEADER_COLUMN } from '.';

export const NumberRangeStep: React.FC = () => {
    const { anchorEl, togglePopper } = usePopper();
    const { getSynchronizeNumberRanges, electronicInvoiceRanges, supportDocumentRange } = useContext(NumberRangeContext);
    const { handleShowModal, doc } = useContext(DocsInstructionContext);
    const { paginator, getLimits } = usePaginator(electronicInvoiceRanges);

    const isInvoice = doc === TypeDoc.EI;
    const data = isInvoice ? electronicInvoiceRanges : supportDocumentRange;

    const FIRST_COLUMN_NAME = isInvoice ? 'Factura electrónica de venta' : 'Documento soporte';

    useEffect(() => {
        getLimits();
    }, [data]);

    const syncNumberAndBlock = (): void => {
        try {
            getSynchronizeNumberRanges();
        } catch (_error) {
            handleShowModal();
        }
    };

    return (
        <div className="flex flex-col w-full mb-7 text-gray-dark px-7">
            <div className="flex flex-col w-full px-4 mb-5">
                <p onClick={togglePopper} className="w-full mb-4.5 whitespace-normal cursor-pointer lg:w-max">
                    <span className="flex flex-row items-center gap-2 text-base underline text-purple">
                        <Icon name="lightPurple" classIcon="inline" />
                        ¿Por qué es necesaria esta información?
                    </span>
                    <Tooltip
                        anchorEl={anchorEl}
                        iconName="lightBlue"
                        wrapperClassName="tooltip-size rounded"
                        placement="bottom-start"
                        description={
                            <p className="text-sm leading-4 font-aller">
                                Esta información es necesaria porque le permite asignar e identificar cada documento electrónico.
                                Al contar con los rangos de numeración mantendrá un orden para la generación del documento.
                            </p>
                        }
                    />
                </p>
            </div>

            <Button
                text="Sincronizar"
                classes="mx-auto my-7"
                background="blue"
                onClick={(): void => {
                    syncNumberAndBlock();
                }}
            />
            <Table
                isHeaderRowsCustom
                headerRowsCustom={
                    <tr>
                        {HEADER_COLUMN(FIRST_COLUMN_NAME, isInvoice).map(header => (
                            <HeaderColumn key={uuid()} {...header} />
                        ))}
                    </tr>
                }
                fieldsBody={[]}
                data={[]}
                editable={false}
                customTable
                className="table-inventory"
                isNew
                wrapperClassName="table-inventory__container"
            >
                {data?.slice(paginator.limits.start, paginator.limits.finish).map(row => (
                    <tr key={uuid()}>
                        {isInvoice && (
                            <td className="h-10 w-181 field-body--uneditable">
                                <TextInput
                                    classesInput="text-left text-gray bg-white"
                                    classesWrapperInput="w-fix bg-white"
                                    value={row?.contingency ? 'Factura talonario o papel' : 'Factura electrónica de venta'}
                                    type="text"
                                    disabled
                                    isTable
                                />
                            </td>
                        )}
                        <td colSpan={1} className="h-10 w-181 field-body--uneditable">
                            <NumberInput
                                value={row.resolution_number ?? '-'}
                                classesInput="text-left text-gray bg-white"
                                classesWrapperInput="w-fix bg-white"
                                maxLength={MAXIMUM_LENGTH_FIELDS.RESOLUTION_NUMBER}
                                disabled
                                isTable
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-82 field-body--uneditable">
                            <TextInput
                                value={row?.prefix}
                                type="text"
                                classesInput="text-left text-gray bg-white"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                isTable
                                maxLength={MAXIMUM_LENGTH_FIELDS.PREFIX}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-136 field-body--uneditable">
                            <div className="flex flex-row justify-center items-center pr-2 pl-4.5">
                                <DatePickerBase
                                    className="bg-transparent mr-0.5 outline-none text-gray"
                                    selected={row?.initial_validity}
                                    disabled
                                    showPlaceHolderDate
                                />
                                <Icon name="calendarGray" alt="calendar" classIcon="w-7" />
                            </div>
                        </td>
                        <td colSpan={1} className="h-10 w-136 field-body--uneditable">
                            <div className="flex flex-row justify-center items-center pr-2 pl-4.5">
                                <DatePickerBase
                                    className="bg-transparent mr-0.5 outline-none text-gray"
                                    selected={row?.final_validity}
                                    disabled
                                    showPlaceHolderDate
                                />
                                <Icon name="calendarGray" alt="calendar" classIcon="w-7" />
                            </div>
                        </td>
                        <td colSpan={1} className="h-10 w-120 field-body--uneditable">
                            <NumberInput
                                value={row?.initial_authorization_range}
                                classesInput="text-left text-gray bg-white"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                isTable
                                maxLength={MAXIMUM_LENGTH_FIELDS.RANGE}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-120 field-body--uneditable">
                            <NumberInput
                                value={row?.final_authorization_range}
                                classesInput="text-left text-gray bg-white"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                isTable
                                maxLength={MAXIMUM_LENGTH_FIELDS.RANGE}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-124 field-body--uneditable">
                            <NumberInput
                                value={row?.last_conscutive_number}
                                classesInput="text-left text-gray bg-white"
                                classesWrapperInput="w-fix bg-white"
                                classesWrapper="w-full"
                                maxLength={MAXIMUM_LENGTH_FIELDS.RANGE}
                                disabled
                                isTable
                            />
                        </td>
                    </tr>
                ))}
            </Table>
            {data?.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </div>
    );
};
