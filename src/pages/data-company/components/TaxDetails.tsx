import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { TOOLTIP_DATA } from '@information-texts/DataCompany';
import { OTHERS, SELF_RETAINING, SIMPLE_REGIMEN } from '@constants/DynamicRequest';
import { DEFAULT_RESPONSIBILITY, NATURAL_RESPONSIBILITIES, WITHHOLDINGS } from '@constants/ElectronicInvoice';
import { TAXPAYER_KEY, TaxpayerType } from '@constants/LegalInformation';
import { FieldName } from '@models/DataCompany';
import { IGenericRecord } from '@models/GenericRecord';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { formatString } from '@utils/Date';
import { numericsInput } from '@utils/SpecialCharacters';
import { toggleWithholdings } from '@utils/ElectronicInvoice';
import { getAvailableOptions, getTaxpayerResponsibilities, getTaxpayers } from '@utils/TaxDetails';
import usePermissions from '@hooks/usePermissions';
import { Icon } from '@components/icon';
import { Link } from '@components/button';
import { IOptionSelect, SelectSearchInput } from '@components/input';
import { DATE, ResolutionFields, Withholdings } from '@components/electronic-documents/tax-responsibilities';
import { Form } from '@components/form';
import {
    TypeTaxDetail,
    TypeFieldInput,
    IDataInformation,
    ITaxDetailsProps,
    IHandleSelectOptions,
    IRemoveOptionSelected,
} from '..';

export const TaxDetails: React.FC<ITaxDetailsProps> = ({ title, dataInformation, setDataInformation, validate }) => {
    const {
        dynamicData: { dynamicData },
    } = useSelector(({ dynamicData }: RootState) => ({ dynamicData }));

    const { disabledInputs } = usePermissions();

    const optionsTaxDetails = useMemo(() => {
        return {
            taxDetails: buildOptions(dynamicData.tax_details),
            typeTaxPayers: buildOptions(dynamicData.type_tax_payer),
        };
    }, [dynamicData, dataInformation]);

    const [ciiuOptions, setCiiuOptions] = useState<IOptionSelect[]>([]);

    const optionsCiius = buildOptionsSearch(dynamicData.ciius);

    const handleSelect = (field: string, { id, code, value }: IOptionSelect): void => {
        const isTaxpayer = field === 'type_tax_payers';
        setDataInformation(preState => ({
            ...preState,
            [field]: { id, code, value },
            ...(isTaxpayer && {
                fiscal_responsibilities: [DEFAULT_RESPONSIBILITY],
                person_type_id: id,
                person_type: TAXPAYER_KEY[id as TaxpayerType],
            }),
        }));
    };

    const handleSelectOptions = ({
        index,
        field,
        options,
        availableOptions = [],
        dataInformationSelected,
        setData,
        setAvailableOptions = (): void => {},
    }: IHandleSelectOptions): void => {
        const currentValue = {
            id: options.id,
            name: options.value,
            code: options.code,
            ciiu_id: TypeTaxDetail.Ciiu === field && options.id,
        };

        setData({
            ...dataInformationSelected,
            [field]:
                options.value === SIMPLE_REGIMEN ||
                (dataInformationSelected?.type_tax_payers?.id === TaxpayerType.LEGAL_PERSON && options.value === OTHERS)
                    ? [currentValue]
                    : dataInformationSelected[field].map((item, i) =>
                          i === index
                              ? {
                                    ...item,
                                    ...currentValue,
                                }
                              : item
                      ),
        });
        setAvailableOptions(availableOptions.filter(option => option.value !== options.value));
    };

    const addNewOptionSelected = (
        field: TypeFieldInput,
        dataInformationSelected: IDataInformation,
        setData: Dispatch<SetStateAction<IDataInformation>>
    ): void => {
        const hasEmptyFields = dataInformationSelected[field].some(item => !item.id || !item.name);

        if (hasEmptyFields) return;
        setData({
            ...dataInformationSelected,
            [field]: [...dataInformationSelected[field], { id: '', name: '', code: '', withholdings: WITHHOLDINGS }],
        });
    };

    const removeOptionSelected = ({
        index,
        field,
        availableOptions = [],
        dataInformationSelected,
        setData,
        setAvailableOptions = (): void => {},
    }: IRemoveOptionSelected): void => {
        const removeItem = dataInformationSelected[field][index];

        if (removeItem.name)
            setAvailableOptions([
                ...availableOptions,
                { key: '', value: removeItem.name, id: removeItem.id, code: removeItem.code },
            ]);

        const updatedOptions = dataInformationSelected[field].filter((_, i) => i !== index);

        setData({ ...dataInformationSelected, [field]: updatedOptions });
    };

    useEffect(() => {
        if (dynamicData) {
            setCiiuOptions(buildOptions(dynamicData.ciius));
        }
    }, [dynamicData]);

    useEffect(() => {
        const usedCiiuIds = dataInformation.ciius.map(item => item.id);
        setCiiuOptions(prevOptions => prevOptions.filter(option => !usedCiiuIds.includes(option.id)));
    }, [dataInformation.fiscal_responsibilities, dataInformation.ciius]);

    const handleResolutionChange = ({ value, name }: IGenericRecord, itemIndex: number): void => {
        setDataInformation(prevState => ({
            ...prevState,
            fiscal_responsibilities: dataInformation.fiscal_responsibilities.map((item: IGenericRecord, index: number) => ({
                ...item,
                [name]: itemIndex === index ? (name === DATE ? formatString(value) : numericsInput(value)) : item[name],
            })),
        }));
    };

    const selectRetention = (retention: string, itemIndex: number): void => {
        setDataInformation(prevState => ({
            ...prevState,
            fiscal_responsibilities: dataInformation.fiscal_responsibilities.map(
                ({ withholdings, ...item }: IGenericRecord, index: number) => ({
                    ...item,
                    withholdings: index === itemIndex ? toggleWithholdings(withholdings, retention) : withholdings,
                })
            ),
        }));
    };

    const taxpayers = useMemo(() => getTaxpayers(dataInformation?.document_type, optionsTaxDetails?.typeTaxPayers), [
        dataInformation?.document_type,
        optionsTaxDetails?.typeTaxPayers,
    ]);

    const disableButton = (): boolean => {
        return (
            !selectedTaxpayer ||
            (dataInformation?.type_tax_payers?.id === TaxpayerType.LEGAL_PERSON &&
                dataInformation.fiscal_responsibilities.some((item: IGenericRecord) => item.name === OTHERS)) ||
            dataInformation.fiscal_responsibilities.some((item: IGenericRecord) => !item.name || item.name === SIMPLE_REGIMEN)
        );
    };

    const taxpayerId = dataInformation?.type_tax_payers?.id ?? dataInformation?.person_type_id;
    const selectedResponsibilities = dataInformation.fiscal_responsibilities;

    const taxpayerResponsibilities = useMemo(
        () => getTaxpayerResponsibilities(taxpayerId, dynamicData?.fiscal_responsibilities),
        [taxpayerId, dynamicData?.fiscal_responsibilities]
    );

    const availableResponsibilities = useMemo(() => getAvailableOptions(taxpayerResponsibilities, selectedResponsibilities), [
        taxpayerResponsibilities,
        selectedResponsibilities,
    ]);

    const handleOptionChange = (option: IOptionSelect, fieldIndex: number): void => {
        const newOption = { ...option, id: String(option.id) };
        setDataInformation({
            ...dataInformation,
            fiscal_responsibilities:
                option.value === SIMPLE_REGIMEN || (taxpayerId === TaxpayerType.LEGAL_PERSON && option.value === OTHERS)
                    ? [newOption]
                    : selectedResponsibilities.map((item: IGenericRecord, index: number) =>
                          index === fieldIndex ? newOption : item
                      ),
        });
    };

    const optionsTaxpayersRender = taxpayers.map(item => ({ ...item, name: item.value }));
    const optionsTaxDetailsRender = optionsTaxDetails.taxDetails.map(item => ({ ...item, name: item.value }));
    const optionsResponsibilitiesRender = availableResponsibilities.map(item => ({ ...item, name: item.value }));

    const selectedTaxpayer = optionsTaxpayersRender?.find(item => item.id === dataInformation?.person_type_id);

    const selectedTaxDetail = optionsTaxDetailsRender?.find(item => item.id === dataInformation?.params_from_utils?.id);

    return (
        <section className="p-4 mb-4 bg-white rounded-md shadow-lg">
            <h2 className="mb-3 text-green font-allerbold">{title}</h2>
            <div className="flex flex-wrap gap-x-7 gap-y-1">
                <SelectSearchInput
                    name="type_tax_payers"
                    optionSelect={optionsTaxpayersRender}
                    labelText="Tipo de contribuyente:"
                    tooltipInfo
                    placeholder="Seleccionar"
                    disabled={disabledInputs}
                    valueSelect={selectedTaxpayer}
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73 mb-4"
                    selectIconType="arrowDownGreen"
                    {...TOOLTIP_DATA[FieldName.TypeOfTaxpayer]}
                    onChangeSelect={(_, options): void => handleSelect('type_tax_payers', options)}
                />
                <SelectSearchInput
                    name="params_from_utils"
                    optionSelect={optionsTaxDetailsRender}
                    labelText="Detalle de impuesto:"
                    placeholder="Seleccionar"
                    disabled={disabledInputs}
                    tooltipInfo
                    valueSelect={selectedTaxDetail}
                    classesInput="w-full"
                    selectIconType="arrowDownGreen"
                    classesWrapper="w-full md:w-73 mb-4"
                    {...TOOLTIP_DATA[FieldName.TaxDetail]}
                    onChangeSelect={(_, options): void => handleSelect('params_from_utils', options)}
                />
                <div className="w-8 xs:hidden" />
                <div className="flex flex-col w-full mb-4">
                    {selectedResponsibilities.map(
                        (
                            {
                                name,
                                withholdings,
                                date = new Date(),
                                number_resolution: resolutionNumber = '',
                                id,
                            }: IGenericRecord,
                            index: number
                        ) => {
                            const requiresResolution = validate && !String(resolutionNumber);
                            const selectedResponsibility = taxpayerResponsibilities?.find(option => option?.id === id);
                            return (
                                <div className="mb-4 xs:w-full" key={`responsibility${index}`}>
                                    <div
                                        className={`flex flex-col lg:flex-row lg:items-${requiresResolution ? 'center' : 'end'}`}
                                    >
                                        <SelectSearchInput
                                            valueSelect={selectedResponsibility}
                                            optionSelect={optionsResponsibilitiesRender}
                                            onChangeSelect={(_, option): void => handleOptionChange(option, index)}
                                            labelText="Responsabilidad fiscal:"
                                            tooltipInfo
                                            placeholder="Seleccionar"
                                            disabled={!selectedTaxpayer || disabledInputs}
                                            classesInput="w-full"
                                            classesWrapper="w-full md:w-73"
                                            classNameMain={`w-full md:w-73 mb-1 ${index ? 'mt-4' : ''}`}
                                            selectIconType="arrowDownGreen"
                                            {...TOOLTIP_DATA[FieldName.FiscalResponsibility]}
                                        />
                                        {name && !NATURAL_RESPONSIBILITIES.includes(name) && (
                                            <div className="flex items-end gap-2 mb-4 lg:ml-7 xs:w-full">
                                                <ResolutionFields
                                                    data={{ date, resolutionNumber }}
                                                    handleChange={(option: IGenericRecord): void =>
                                                        handleResolutionChange(option, index)
                                                    }
                                                    requiredResolution={requiresResolution}
                                                />
                                                {!!index && (
                                                    <Icon
                                                        name="trashBlue"
                                                        classIcon="ml-auto w-5.5 h-5.5 mt-11 ml-6 cursor-pointer"
                                                        {...(!disabledInputs && {
                                                            onClick: (): void =>
                                                                removeOptionSelected({
                                                                    index,
                                                                    field: TypeTaxDetail.FiscalResponsibilities,
                                                                    setData: setDataInformation,
                                                                    dataInformationSelected: dataInformation,
                                                                }),
                                                        })}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {name === SELF_RETAINING && (
                                        <Withholdings
                                            selectRetention={(name): void => selectRetention(name, index)}
                                            validate={validate}
                                            withholdings={withholdings}
                                        />
                                    )}
                                </div>
                            );
                        }
                    )}
                    <Link
                        disabled={disableButton() || disabledInputs}
                        href="#"
                        text="+Agregar adicional"
                        onClick={(): void =>
                            addNewOptionSelected(TypeTaxDetail.FiscalResponsibilities, dataInformation, setDataInformation)
                        }
                    />
                </div>
                <div className="flex flex-col mb-4 xs:w-full">
                    {dataInformation.ciius.map((item, index) => (
                        <Form sendWithEnter className="flex flex-row" key={index}>
                            <SelectSearchInput
                                labelText="CIIU - Actividad económica:"
                                tooltipInfo
                                placeholder="Seleccionar"
                                disabled={disabledInputs}
                                classesInput="w-full"
                                classesWrapper="w-full md:w-151.50"
                                classNameMain={`w-full md:w-151.50 mb-1 ${index ? 'mt-4' : ''}`}
                                selectIconType="arrowDownGreen"
                                {...TOOLTIP_DATA[FieldName.EconomicActivity]}
                                onChangeSelect={(_, option): void => {
                                    const ciiu = ciiuOptions.find(ciuu => ciuu.id === option?.value) as IOptionSelect;
                                    handleSelectOptions({
                                        index,
                                        field: TypeTaxDetail.Ciiu,
                                        options: ciiu,
                                        availableOptions: ciiuOptions,
                                        dataInformationSelected: dataInformation,
                                        setData: setDataInformation,
                                        setAvailableOptions: setCiiuOptions,
                                    });
                                }}
                                optionSelect={optionsCiius}
                                valueSelect={optionsCiius.find(option => option?.value === item?.ciiu_id)}
                            />
                            {!!index && (
                                <Icon
                                    name="trashBlue"
                                    classIcon="ml-auto w-5.5 h-5.5 mt-11 ml-6 cursor-pointer"
                                    {...(!disabledInputs && {
                                        onClick: (): void =>
                                            removeOptionSelected({
                                                index,
                                                field: TypeTaxDetail.Ciiu,
                                                setData: setDataInformation,
                                                setAvailableOptions: setCiiuOptions,
                                                dataInformationSelected: dataInformation,
                                                availableOptions: ciiuOptions,
                                            }),
                                    })}
                                />
                            )}
                        </Form>
                    ))}
                    <Link
                        disabled={disabledInputs}
                        href="#"
                        text="+Agregar adicional"
                        onClick={(): void => addNewOptionSelected(TypeTaxDetail.Ciiu, dataInformation, setDataInformation)}
                    />
                </div>
            </div>
        </section>
    );
};
