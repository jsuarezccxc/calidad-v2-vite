import React, { useEffect } from 'react';
import useSelectSearch from '@hooks/useSelectSearch';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { isEven } from '@utils/Number';
import { setZeroValueInInputNumber } from '@utils/Input';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { isReteiva } from '@pages/correction-business-document/components/invoice-correction';
import { headerTableTaxes, ITotalInvoiceTablesProps } from '@components/electronic-document';
import { validatePercentageWithHoldings } from '@components/electronic-invoice';
import { Table } from '@components/table';
import { NumberFormatInput, PercentageFormatInput, Text } from '@components/table-input';
import { TableError } from '@components/table-error';
import { IOption, SelectSearch } from '@components/select-search';
import { ChangeEvent, TextArea } from '@components/input';
import { MaxLengthFields } from '@constants/ElectronicInvoice';
import './TableCorrection.scss';

export const TotalInvoiceTables: React.FC<ITotalInvoiceTablesProps> = ({
    dataTaxes,
    dataTotals,
    handleTotals,
    onChangeTaxes = (): void => {},
    annulation = false,
    dataWithholdings = [],
    isView,
    currentCountry = '',
    setCurrentError = (): void => {},
    totalsValues = {},
    optionsWithHoldings = [],
    fieldsInputs,
    setFieldInputs = (): void => {},
    handleChange = (): void => {},
    fields,
    symbol,
}) => {
    const { disabledInputs } = usePermissions();
    const { showSelectSearch, toggleSelectSearch } = useSelectSearch();

    const [, , reteIVA = { percentage: '' }] = dataWithholdings;
    const finalOptions: IOption[] = [{ name: '0,00%', value: '0' }, ...(optionsWithHoldings as IOption[])];

    useEffect(() => {
        const retefuente = validatePercentageWithHoldings(
            dataWithholdings.find(tax => tax.id === 6)?.percentage,
            currentCountry,
            33
        );

        const reteICA = validatePercentageWithHoldings(dataWithholdings.find(tax => tax.id === 7)?.percentage, currentCountry, 2);

        if (retefuente || reteICA) {
            return setCurrentError([
                {
                    retefuente: retefuente,
                },
                {
                    reteICA: reteICA,
                },
            ]);
        }
        return setCurrentError([]);
    }, [dataWithholdings]);

    return (
        <div className="flex flex-row mt-7 xs:flex-col">
            <div className="mb-0 xs:w-full xs:mb-5">
                <Table
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `document-correction-invoice-totals`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    className="overflow-x-hidden w-min xs:w-187"
                    customTable
                    data={dataTaxes}
                    headersTable={headerTableTaxes}
                    idContentTable="tableTaxesAndRetentions"
                    isNew
                >
                    {dataWithholdings.map((item, index) => {
                        const isDisabled = annulation || (!isView && item.id === 10);
                        const { value: selectValue } = finalOptions.find(
                            option => parseFloat(option.name) === parseFloat(item.percentage)
                        ) || { value: 0 };
                        return (
                            <tr
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-invoice-totals-${item.id}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                className={`${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'} table-correction-withholdings`}
                                key={item.id}
                            >
                                <td className="field-body--editable">
                                    <Text
                                        disabled
                                        type="text"
                                        name="name"
                                        text={item.name}
                                        editTable={false}
                                        className="text-left"
                                    />
                                </td>
                                <td className="field-body--editable">
                                    <NumberFormatInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `document-correction-invoice-totals-${item.id}-value`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        handleChange={(e): void => onChangeTaxes(e, item, true)}
                                        inputClass="table-correction-withholdings--disabled"
                                        containerClass="lg:h-8.9 xs:h-6.8"
                                        value={item.value}
                                        withIcon={false}
                                        prefix={symbol}
                                        name="value"
                                        disabled
                                        isTable
                                    />
                                </td>
                                <td className="field-body--editable">
                                    {!isReteiva(item) ? (
                                        <PercentageFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-invoice-totals-${item.id}-percentage`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            name="percentage"
                                            value={item.percentage}
                                            containerClass="border-none"
                                            disabled={disabledInputs || isDisabled}
                                            inputClass="table-correction-withholdings__number"
                                            handleChange={(e): void => onChangeTaxes(e, item, true)}
                                            fixedDecimalScale
                                        />
                                    ) : (
                                        <SelectSearch
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-invoice-totals-${item.id}-percentage`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            allOptions={finalOptions}
                                            options={finalOptions}
                                            value={String(selectValue)}
                                            onChange={({ name }): void => {
                                                onChangeTaxes(
                                                    {
                                                        target: { value: name, name: 'percentage' },
                                                    } as ChangeEvent,
                                                    item,
                                                    true
                                                );
                                            }}
                                            inputClass="table-correction-withholdings__select"
                                            toggleSelectSearch={toggleSelectSearch}
                                            disabled={disabledInputs || isDisabled}
                                            selectIconType="arrowDownGreen"
                                            showList={showSelectSearch}
                                            name={item.name}
                                        />
                                    )}
                                </td>
                                <td className="field-body--editable">
                                    <NumberFormatInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `document-correction-invoice-totals-${item.id}-other-value`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        isTable
                                        value={item.other_value}
                                        disabled
                                        handleChange={(e): void => onChangeTaxes(e, item, true)}
                                        name="other_value"
                                        inputClass="table-correction-withholdings--disabled"
                                        containerClass="lg:h-8.9 xs:h-6.8"
                                        withIcon={false}
                                        prefix={symbol}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </Table>
                {validatePercentageWithHoldings(
                    Math.ceil(
                        Number(
                            dataWithholdings
                                .find(tax => tax.id === 6)
                                ?.percentage.toString()
                                .replace(',', '.')
                        )
                    ),
                    currentCountry,
                    33
                ) !== '' && (
                    <div className="ml-1">
                        <TableError customText={'Ingrese una tarifa de retefuente de máximo 20%'} />
                    </div>
                )}
                {validatePercentageWithHoldings(
                    Math.ceil(
                        Number(
                            dataWithholdings
                                .find(tax => tax.id === 7)
                                ?.percentage.toString()
                                .replace(',', '.')
                        )
                    ),
                    currentCountry,
                    2
                ) !== '' && (
                    <div className="ml-1">
                        <TableError customText={'Ingrese una tarifa de reteICA de máximo 2%'} />
                    </div>
                )}
                {!!parseFloat(reteIVA.percentage) &&
                    !optionsWithHoldings.some(option => parseInt(option.name) === reteIVA.percentage) && (
                        <TableError customText="*tarifa ReteIVA inválida" />
                    )}
                <div className="flex mt-7">
                    <TextArea
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `document-correction-invoice-totals-observations`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="w-70 xs:w-full lg:mr-9.5 mr-2"
                        labelText="Observaciones:"
                        placeholder="..."
                        value={fieldsInputs?.observations}
                        onChange={(e): void => handleChange(e, setFieldInputs, fieldsInputs || {})}
                        name="observations"
                        disabled={disabledInputs || fields?.observations?.disabled}
                        classesInput="px-2"
                        maxLength={MaxLengthFields.OBSERVATIONS}
                    />
                    <TextArea
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `document-correction-invoice-totals-internal-notes`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="w-70 xs:w-full"
                        labelText="Comentario para uso interno:"
                        placeholder="..."
                        value={fieldsInputs?.internal_notes}
                        onChange={(e): void => handleChange(e, setFieldInputs, fieldsInputs || {})}
                        name="internal_notes"
                        disabled={disabledInputs || fields?.observations?.disabled}
                        classesInput="px-2"
                        maxLength={MaxLengthFields.OBSERVATIONS}
                        tooltip={{
                            title: 'Comentario para uso interno:',
                            description:
                                'Agregue la información adicional de uso interno para su empresa, tenga en cuenta que esta información no se transmite a la DIAN ni al cliente.',
                        }}
                    />
                </div>
            </div>
            <div className="ml-7 xs:w-full xs:ml-0">
                <Table
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `document-correction-invoice-totals`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    data={[]}
                    headerHidden
                    customTable
                    className="w-max table-total-custom xs:w-full"
                    wrapperClassName="table-total-overflow--hidden"
                >
                    {dataTotals.map((item: IGenericRecord, index: number) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `document-correction-invoice-totals-${index}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={index}
                            className={`${item.className} ${item.isTotal ? 'font-allerbold' : ''}`}
                        >
                            <td className="justify-start field-body--uneditable border-none mr-4.5 w-38.4">
                                <p className="text-sm text-left xs:text-xs text-blue">{item.title}</p>
                            </td>
                            <td
                                className={`border-none text-blue w-26.3 flex items-center field-body--${
                                    !disabledInputs && item?.edit && !annulation ? 'editable' : 'uneditable'
                                }`}
                            >
                                <NumberFormatInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction-invoice-totals-${index}-value`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    withIcon={false}
                                    prefix={symbol}
                                    value={item?.edit ? totalsValues[item.field] : item.value}
                                    disabled={disabledInputs || !(item?.edit && !annulation)}
                                    inputClass="w-full"
                                    handleChange={handleTotals}
                                    name={item.field}
                                    isTable
                                    onBlur={(e): void => handleTotals(setZeroValueInInputNumber(e, item.field))}
                                />
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
        </div>
    );
};
