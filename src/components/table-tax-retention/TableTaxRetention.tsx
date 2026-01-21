import React, { useMemo } from 'react';
import { Table } from '@components/table/Table';
import { TableError } from '@components/table-error';
import { SelectSearch } from '@components/select-search';
import { NumberFormatInput, PercentageFormatInput, Text, Title } from '@components/table-input';
import { getSum } from '@utils/Array';
import { eventToNumber } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { validatePercentageFilter } from '@utils/Validation';
import useSelectSearch from '@hooks/useSelectSearch';
import usePermissions from '@hooks/usePermissions';
import { headerTableTaxes, ITablesTaxesRetentionProps, TableNameInputs, UTILS } from '.';
import './TableTaxRetention.scss';

export const TableTaxRetention: React.FC<ITablesTaxesRetentionProps> = ({
    symbol,
    dataValuesTableTaxes = [],
    dataValuesTableRetention,
    errorsTableRetention: { reteIca, reteFuente, reteIva, ...errors },
    onChangeTableRetention,
    decimalsToPercentage = 2,
    isElectronicInvoice = false,
    isDisabledWithholdings = false,
    showTaxes = false,
    isSupportOrAdjustment = false,
}) => {
    const { PERCENTAGE } = TableNameInputs;
    const { disabledInputs } = usePermissions();
    const { showSelectSearch, toggleSelectSearch } = useSelectSearch();
    const validateBorder = (name: string, value: string): boolean => name.toLowerCase().includes(value);

    const tableRetentions = useMemo(
        () => dataValuesTableRetention.filter(item => (isSupportOrAdjustment ? !item?.omitElement : true)),
        [dataValuesTableRetention]
    );

    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.TABLE}-tax-retention`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                className="w-full overflow-x-hidden table-taxes"
                headersTable={headerTableTaxes(showTaxes)}
                idContentTable="taxesTable"
                customTable
                data={[]}
                isNew
                editable={!disabledInputs}
                disabled={disabledInputs}
            >
                <>
                    {showTaxes && (
                        <>
                            <tr className="titles-table-taxes">
                                <th colSpan={4} className="field-header--uneditable">
                                    <Title
                                        text="Impuestos"
                                        disabled
                                        color="blue"
                                        className="header__padding-width"
                                        sectionTooltip="rates"
                                        showInformation={isElectronicInvoice}
                                    />
                                </th>
                            </tr>
                            {dataValuesTableTaxes.map((item, index) => (
                                <tr
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.TABLE}-tax-retention-taxes-${index}`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ROW,
                                    })}
                                    key={'taxes' + index}
                                >
                                    <td className="xs:h-8.2 lg:h-10 field-body--uneditable header__w-13">
                                        <Text
                                            className="h-auto header__w-13"
                                            editTable={false}
                                            text={item.name}
                                            type="text"
                                            name="name"
                                            disabled
                                        />
                                    </td>
                                    <td className="xs:h-8.2 lg:h-10 field-body--uneditable header__w-13">
                                        <NumberFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-tax-retention-taxes-${index}-base`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            disabled
                                            value={item.base}
                                            inputClass="w-5/6 pr-2 lg:h-auto"
                                            name="value"
                                            fixedDecimalScale
                                        />
                                    </td>
                                    <td className="xs:h-8.2 lg:h-10 field-body--uneditable md:text-sm text-gray-dark">
                                        {item.isLabel ? (
                                            <Text
                                                className="h-auto header__w-13"
                                                text={item.label || ''}
                                                editTable={false}
                                                type="text"
                                                name="name"
                                                disabled
                                            />
                                        ) : (
                                            <PercentageFormatInput
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `${ModuleApp.TABLE}-tax-retention-taxes-${index}-percentage`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                value={item.percentage}
                                                inputClass="w-5/6 lg:h-auto"
                                                decimals={decimalsToPercentage}
                                                fixedDecimalScale
                                                disabled
                                            />
                                        )}
                                    </td>
                                    <td className="xs:h-8.2 lg:h-10 field-body--uneditable">
                                        <NumberFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-tax-retention-taxes-${index}-value`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            disabled
                                            value={item.value}
                                            inputClass="w-5/6 lg:h-auto"
                                            name="value"
                                            fixedDecimalScale
                                        />
                                    </td>
                                </tr>
                            ))}
                            {isElectronicInvoice && (
                                <tr>
                                    <th colSpan={3} className="field-header--uneditable padding-none">
                                        <Title color="blue" text="Total IVA" disabled />
                                    </th>
                                    <th className="field-header--uneditable padding-none">
                                        <NumberFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-tax-retention-total-iva`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            containerClass="w-30.7 h-auto xs:w-full"
                                            inputClass="w-full h-auto p-0"
                                            subContainerClass="xs:mx-auto"
                                            value={getSum(dataValuesTableTaxes)}
                                            disabled
                                        />
                                    </th>
                                </tr>
                            )}
                            <tr className="titles-table-taxes">
                                <th colSpan={4} className="field-header--uneditable">
                                    <Title
                                        text="Retenciones"
                                        disabled
                                        color="blue"
                                        className="header__padding-width"
                                        sectionTooltip="withholdings"
                                        showInformation={isElectronicInvoice}
                                    />
                                </th>
                            </tr>
                        </>
                    )}
                    {tableRetentions.map(({ disabled = false, ...item }, index) => {
                        const isDisabled = disabled || isDisabledWithholdings;
                        return (
                            <tr key={`withholdings-${index}`} className="border-b">
                                <td className="h-8.2 header__w-13 field-body--uneditable">
                                    <Text
                                        text={item.name}
                                        editTable={false}
                                        className="h-auto text-gray"
                                        type="text"
                                        name="name"
                                        disabled
                                    />
                                </td>
                                <td className="h-8.2 field-body--uneditable">
                                    <NumberFormatInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `${ModuleApp.TABLE}-tax-retention-base`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        handleChange={({ target: { value } }): void =>
                                            onChangeTableRetention(eventToNumber(value), 'base', item)
                                        }
                                        inputClass="number-input number-input--disabled mx-2"
                                        containerClass="number-input--margin-2"
                                        value={item.base}
                                        withIcon={false}
                                        prefix={symbol}
                                        disabled
                                    />
                                </td>
                                <td
                                    className={`h-8.2 field-body--uneditable ${
                                        (reteFuente && validateBorder(item.name, 'retefuente')) ||
                                        (reteIca && validateBorder(item.name, 'reteica')) ||
                                        (reteIva && validateBorder(item.name, 'reteiva'))
                                            ? 'border-purple'
                                            : ''
                                    }`}
                                >
                                    {item.isSelectInput ? (
                                        <SelectSearch
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-tax-retention-percentage`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            onChange={({ name, value }): void => {
                                                onChangeTableRetention(
                                                    eventToNumber(String(name).replace('%', '')),
                                                    PERCENTAGE,
                                                    item,
                                                    value
                                                );
                                            }}
                                            toggleSelectSearch={toggleSelectSearch}
                                            selectIconType="arrowDownGreen"
                                            value={String(item.percentage) || UTILS.DEFAULT_PERCENTAGE}
                                            showList={showSelectSearch}
                                            inputClass="text-left padding-0 number-input--margin-2 select-search"
                                            disabled={isDisabled || disabledInputs}
                                            allOptions={UTILS.DEFAULT_VALUE}
                                            options={UTILS.DEFAULT_VALUE}
                                            name={item.name}
                                            onKeyPress={validatePercentageFilter}
                                        />
                                    ) : (
                                        <PercentageFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-tax-retention-percentage`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            handleChange={({ target: { value } }): void => {
                                                onChangeTableRetention(
                                                    eventToNumber(String(value).replace('%', '')),
                                                    PERCENTAGE,
                                                    item
                                                );
                                            }}
                                            decimals={decimalsToPercentage}
                                            inputClass="number-input mx-2 number-input"
                                            value={item.percentage}
                                            disabled={isDisabled || disabledInputs}
                                            fixedDecimalScale
                                        />
                                    )}
                                </td>
                                <td className="h-8.2 field-body--uneditable">
                                    <NumberFormatInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `${ModuleApp.TABLE}-tax-retention-value`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        handleChange={({ target: { value } }): void =>
                                            onChangeTableRetention(eventToNumber(value), 'value', item)
                                        }
                                        inputClass="number-input number-input--disabled mx-2"
                                        containerClass="number-input--margin-2"
                                        value={item.value}
                                        withIcon={false}
                                        prefix={symbol}
                                        disabled
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </>
            </Table>
            <>
                {reteFuente && <TableError customText={errors.messageFuente} className="ml-1" />}
                {reteIca && <TableError customText={errors.messageIca} className="ml-1" />}
                {reteIva && <TableError customText={errors.messageIva} className="ml-1" />}
            </>
        </>
    );
};
