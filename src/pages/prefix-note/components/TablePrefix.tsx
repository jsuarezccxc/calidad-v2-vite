import React, { useEffect } from 'react';
import { IError } from '@models/Error';
import { isEven } from '@utils/Number';
import { lengthEqualToZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { INITIAL_PAGE, ITEMS_PAGE } from '@constants/Paginator';
import { DEBIT_NOTE, MaxLengthFields } from '@constants/ElectronicInvoice';
import { OPTION_ADJUSTMENT, TYPE_OPTIONS, keysFields } from '@constants/PrefixNote';
import { INFORMATION_TABLE } from '@information-texts/PrefixNote';
import { Icon } from '@components/icon';
import { Link } from '@components/button';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { Checkbox } from '@components/checkbox';
import { SelectInput } from '@components/input';
import { Paginator } from '@components/paginator';
import { TableError } from '@components/table-error';
import usePaginator from '@hooks/usePaginator';
import usePermissions from '@hooks/usePermissions';
import { ITablePrefixProps, HEADERS_TABLE } from '.';

export const TablePrefix: React.FC<ITablePrefixProps> = ({ data, typeNote, handleDelete, addPrefix, errors, ...props }) => {
    const isDebitNote = typeNote === DEBIT_NOTE;

    const { disabledInputs } = usePermissions();
    const { paginator } = usePaginator(data);

    const handleCurrentPage = (): void => {
        const page = Math.ceil(data.length / ITEMS_PAGE);
        const finish = ITEMS_PAGE * page;
        paginator.setCurrentPage(page - INITIAL_PAGE);
        paginator.setLimits({ finish, start: finish - ITEMS_PAGE });
    };

    const validateClass = (errors: IError[], field: string): string =>
        errors.some(item => item.field === field) ? 'table-prefix-required' : '';

    useEffect(() => {
        handleCurrentPage();
    }, [data.length]);

    return (
        <>
            <div className="text-base leading-19.38px text-gray-dark mb-2">{INFORMATION_TABLE[typeNote].DESCRIPTION}</div>
            <div className="flex flex-col mx-auto prefix-note w-max">
                {!lengthEqualToZero(data) && (
                    <Icon
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `prefix`,
                            action: ActionElementType.TRASH,
                            elementType: ElementType.ICO,
                        })}
                        name="trashBlue"
                        hoverIcon="trashGreen"
                        className="w-5.5 self-end mb-2"
                        onClick={(): void => {
                            if (data.some(({ check }) => check)) handleDelete();
                        }}
                    />
                )}
                <Table
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `prefix`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    data={[]}
                    headersTable={HEADERS_TABLE}
                    className="w-max"
                    customTable
                    validate
                    isNew
                >
                    {paginator.dataLimits.map((prefix, index) => {
                        const { errors } = prefix;
                        const isDisabled = !prefix.isChange || disabledInputs;
                        return (
                            <tr
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `prefix-${index}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={index}
                                className={isEven(index + 1) ? 'bg-gray-light' : 'bg-transparent'}
                            >
                                <td className="td-checkbox">
                                    {!isDisabled && (
                                        <Checkbox
                                            checked={prefix.check}
                                            onChange={(e): void => props.onChangeCheckBox(e, prefix)}
                                        />
                                    )}
                                </td>
                                <td className={`${validateClass(errors, keysFields.TYPE_NAME)} field-body--uneditable`}>
                                    <SelectInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                            submodule: `prefix-${index}-type-name`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        optionSelected={(options): void => props.onChangeSelect(options, prefix)}
                                        options={isDebitNote ? TYPE_OPTIONS : OPTION_ADJUSTMENT}
                                        classesWrapperInput="input-bg-transparent"
                                        selectIconType="arrowDownGreen"
                                        value={prefix.type_name}
                                        disabled={isDisabled}
                                        isTable
                                    />
                                </td>
                                <td className={`${validateClass(errors, keysFields.PREFIX)} field-body--uneditable`}>
                                    <Text
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                            submodule: `prefix-${index}-prefix`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        className={`w-25.5 input-text-left ${isDisabled ? 'text-gray' : ''}`}
                                        onChange={(e): void => props.onChangeInput(e, prefix)}
                                        maxLength={MaxLengthFields.PREFIX}
                                        alphanumericNoWhitespace
                                        disabled={isDisabled}
                                        text={prefix.prefix}
                                        editTable
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </Table>
                {data.length > ITEMS_PAGE && <Paginator {...paginator} wrapperClassName="margin-paginator" isGroupPaginator />}
                {errors.map((error, index) => (
                    <TableError key={index} customText={error} />
                ))}
                <Link
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `prefix`,
                        action: ActionElementType.ADD,
                        elementType: ElementType.LNK,
                    })}
                    text={INFORMATION_TABLE[typeNote].LINK_NAME}
                    classes="text-base mt-2 w-max ml-7 xs:ml-0"
                    onClick={addPrefix}
                    href="#"
                />
            </div>
        </>
    );
};
