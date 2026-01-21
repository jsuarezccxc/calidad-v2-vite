import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';
import { v4 as uuid } from 'uuid';
import { SelectSearchTableInput, TextInput } from '@components/input';
import { Table } from '@components/table';
import { NumberFormatInput } from '@components/table-input';
import { TableError } from '@components/table-error';
import { Paginator } from '@components/paginator';
import { getLocationsError } from '@pages/product-shipping-cost-information';
import { toggleSelectItem } from '@utils/Checkboxs';
import { restProps } from '@utils/Props';
import { lengthGreaterThanZero } from '@utils/Length';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { COUNTRY_ID, DEPARTMENT_ID, COUNTRY_NAME, DEPARTMENT_NAME } from '@constants/Location';
import { ITEMS_PAGE } from '@constants/Paginator';
import { ZERO } from '@constants/UtilsConstants';
import { ONE } from '@constants/Numbers';
import usePaginator from '@hooks/usePaginator';
import usePermissions from '@hooks/usePermissions';
import { FOUR, TWO } from '@pages/virtual-store-sales-receipts';
import { TableHeader } from './TableHeader';
import {
    city,
    defaultPlace,
    getOptions,
    getTarget,
    getTargetPlace,
    getSelectedCities,
    IShippingTableProps,
    MAX_LENGHT_CITY,
    MAX_LENGTH_NUMBER_INPUT_COST,
} from '.';

export const ShippingTable: React.FC<IShippingTableProps> = ({
    data = [],
    setData = (): void => {},
    onClickTrash = (): void => {},
    checkedFields = ZERO,
    isNationalTable = false,
    validate = false,
    setIsSave = (): void => {},
}) => {
    const { departments, groupedCities, countries } = useSelector((state: RootState) => state.company);

    const locationKey = isNationalTable ? DEPARTMENT_ID : COUNTRY_ID;

    const { paginator, getLimits } = usePaginator(data);

    const { disabledInputs } = usePermissions();

    const getCities = ({ department_id }: IGenericRecord): SelectSearchOption[] => {
        const departmentCode = departments?.find(department => department.id === department_id)?.code;
        return getOptions(departmentCode ? groupedCities[departmentCode.trim()] : []);
    };

    const addCity = (id: number, enableCityLink: boolean): void => {
        if (enableCityLink) {
            setData(
                data.map(item => ({ ...item, cities: item.id === id ? [...item.cities, { ...city, id: uuid() }] : item.cities }))
            );
        }
    };

    const addPlace = (): void => {
        setData([...data, { ...defaultPlace, id: uuid(), [locationKey]: '' }]);
    };

    const selectDepartment = (id: number): void => {
        setData(data.map((item: IGenericRecord) => ({ ...item, checked: item.id === id ? !item.checked : item.checked })));
    };

    const selectCity = (row: number, subRow: number): void => {
        if (data[row]?.checked) return;
        setData(
            data.map((item, index) => ({
                ...item,
                cities: index === row ? toggleSelectItem(item.cities, subRow) : item.cities,
            }))
        );
    };

    const handleChangeLocation = (id: string, { value, name }: IGenericRecord): void => {
        const additionalName = isNationalTable ? DEPARTMENT_NAME : COUNTRY_NAME;
        setData(
            data.map(item => ({
                ...item,
                ...(item.id === id && { [locationKey]: value, [additionalName]: name, cities: [] }),
            }))
        );
    };

    const handleChangeData = ({ target, city_name }: IGenericRecord, id: string, subId: string): void => {
        setData(
            data.map(item => {
                if (item.id !== id) return item;
                return {
                    ...item,
                    cities: item.cities.map((city: IGenericRecord) => {
                        if (city.id !== subId) return city;
                        return {
                            ...city,
                            [target.name]: target.value,
                            ...(city_name && { city_name }),
                        };
                    }),
                };
            })
        );
    };

    const selectedDestinations = useMemo(() => data?.map(item => item[locationKey]), [data]);

    const getDestinyOptions = (value: number): SelectSearchOption[] => {
        const data = isNationalTable ? departments : countries;
        return getOptions(data.filter(item => Number(item.id) === value || selectedDestinations?.every(id => id !== item.id)));
    };

    const getCityOptions = (item: IGenericRecord, value: string): SelectSearchOption[] => {
        return getCities(item)?.filter(
            (city: IGenericRecord) =>
                Number(city.id) === Number(value) || getSelectedCities(data)?.every(id => Number(id) !== Number(city.id))
        );
    };

    const getLinkStatus = (item: IGenericRecord): boolean => {
        if (isNationalTable) return item[locationKey] ? item.cities?.length < getCities(item)?.length : false;
        return item[locationKey];
    };

    const tableError = useMemo(() => (validate ? getLocationsError(data, isNationalTable) : ''), [validate, data]);

    const getBorder = (value: string): string => (validate ? (value ? '' : 'border-purple') : '');

    const stateKey = locationKey ? `${locationKey.split('_')[0]}_name` : ' ';

    useEffect(() => {
        getLimits();
    }, [data]);

    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: 'product-shipping-cost-table',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isNew
                customTable
                sendFormWithEnter
                isHeaderRowsCustom
                data={[]}
                headerRowsCustom={<TableHeader {...restProps({ onClickTrash, checkedFields, isNationalTable })} />}
                wrapperClassName="overflow-y-auto lg:overflow-visible w-full"
            >
                {data?.slice(paginator?.limits.start, paginator?.limits.finish)?.map((item, row) =>
                    [...item?.cities, { id: row, link: true }]?.map((subItem: IGenericRecord, subRow: number) => {
                        const enableLink = getLinkStatus(item);
                        return (
                            <tr
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `product-shipping-cost-table-${row}-${subRow}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={`${row}${subRow}`}
                                className={!(row % TWO) ? 'tr-white' : 'tr-gray'}
                            >
                                {!subRow && (
                                    <>
                                        <td rowSpan={item.cities.length + ONE} className="bg-white shipping-cost__check-field">
                                            <div
                                                className={`shipping-cost__check ${
                                                    item?.checked ? 'bg-blue border-transparent' : 'border-gray'
                                                }`}
                                                onClick={(): void => selectDepartment(item.id)}
                                            />
                                        </td>
                                        <td
                                            className={`field-body--editable field-height ${
                                                validate && !item[locationKey] ? 'border-purple' : ''
                                            }`}
                                            rowSpan={item.cities.length + ONE}
                                        >
                                            <SelectSearchTableInput
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `product-shipping-cost-table-${row}-${subRow}-location`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                iconClassName="lg:top-2 xs:top-2"
                                                classesWrapperInput="border-none text-gray-dark text-center w-full"
                                                classesWrapper="relative w-full select-table"
                                                optionSelect={getDestinyOptions(item[locationKey])}
                                                valueSelect={item[locationKey]}
                                                onChangeSelect={(value, option): void => {
                                                    handleChangeLocation(item.id, { ...option, value });
                                                    setIsSave(false);
                                                }}
                                                placeholder={item[stateKey]}
                                                disabled={disabledInputs}
                                                isTransparent
                                            />
                                        </td>
                                    </>
                                )}
                                {subItem.link ? (
                                    <td
                                        className={`field-height field-body--${enableLink ? 'editable' : 'uneditable'} 
                                        ${validate && item[locationKey] && !item.cities.length ? 'border-purple' : ''}
                                        `}
                                        colSpan={FOUR}
                                    >
                                        <p
                                            className={`shipping-cost__link ${
                                                enableLink ? 'hover:text-purple' : 'shipping-cost__disabled-link'
                                            }`}
                                            onClick={(): void => addCity(item.id, enableLink)}
                                        >
                                            + Agregar ciudad
                                        </p>
                                    </td>
                                ) : (
                                    <>
                                        {isNationalTable ? (
                                            <td
                                                className={`relative field-height field-body--editable ${getBorder(
                                                    subItem.city_id
                                                )}`}
                                            >
                                                <div className="flex items-center w-full h-full gap-2 px-1">
                                                    <div
                                                        className={`shipping-cost__check ${
                                                            subItem?.checked ? 'bg-blue border-transparent' : 'border-gray'
                                                        }`}
                                                        onClick={(): void => selectCity(row, subRow)}
                                                    />
                                                    <SelectSearchTableInput
                                                        id={generateId({
                                                            module: ModuleApp.WEBSITE,
                                                            submodule: `product-shipping-cost-table-${row}-${subRow}-city`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        iconClassName="lg:-top-1 xs:-top-1"
                                                        classesWrapperInput="border-none text-gray-dark text-center w-full"
                                                        classesWrapper="relative w-full select-table"
                                                        isTable
                                                        isTableSearch
                                                        optionSelect={getCityOptions(item, subItem.city_id)}
                                                        valueSelect={subItem.city_id}
                                                        onChangeSelect={(_, option): void => {
                                                            handleChangeData(
                                                                {
                                                                    ...getTargetPlace(option, 'city_id'),
                                                                    city_name: option.name,
                                                                },
                                                                item.id,
                                                                subItem.id
                                                            );
                                                            setIsSave(false);
                                                        }}
                                                        placeholder={subItem.city_name}
                                                        disabled={disabledInputs}
                                                        isTransparent
                                                    />
                                                </div>
                                            </td>
                                        ) : (
                                            <td
                                                className={`relative p-0 m-0 field-height field-body--editable
                                            ${getBorder(subItem.city_name)}`}
                                            >
                                                <div className="flex items-center w-full h-full gap-2 px-1">
                                                    <div
                                                        className={`shipping-cost__check ${
                                                            subItem?.checked ? 'bg-blue border-transparent' : 'border-gray'
                                                        }`}
                                                        onClick={(): void => selectCity(row, subRow)}
                                                    />
                                                    <TextInput
                                                        id={generateId({
                                                            module: ModuleApp.WEBSITE,
                                                            submodule: `product-shipping-cost-table-${row}-${subRow}-city`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        classesWrapper="m-auto inset-0 w-full h-ful"
                                                        classesWrapperInput="border-none"
                                                        classesInput="text-center"
                                                        value={subItem.city_name}
                                                        name="city_name"
                                                        onChange={(e): void => {
                                                            handleChangeData(e, item.id, subItem.id);
                                                            setIsSave(false);
                                                        }}
                                                        lettersWithAccent
                                                        disabled={disabledInputs}
                                                        isTransparent
                                                        maxLength={MAX_LENGHT_CITY}
                                                    />
                                                </div>
                                            </td>
                                        )}

                                        <td
                                            className={`relative p-0 m-0 field-height field-body--editable
                                        ${getBorder(subItem.estimated_time)}
                                        `}
                                        >
                                            <NumberFormatInput
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `product-shipping-cost-table-${row}-${subRow}-estimated-time`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                value={subItem.estimated_time}
                                                containerClass="field-money"
                                                inputClass="field-money__input"
                                                withIcon={false}
                                                onChange={({ floatValue }): void => {
                                                    handleChangeData(
                                                        getTarget(floatValue || '', 'estimated_time'),
                                                        item.id,
                                                        subItem.id
                                                    );
                                                    setIsSave(false);
                                                }}
                                                disabled={disabledInputs}
                                                subContainerClass="w-full"
                                                fixedDecimalScale
                                            />
                                        </td>
                                        <td
                                            className={`relative field-height field-body--editable
                                         ${getBorder(subItem.shipping_cost)}
                                        `}
                                        >
                                            <NumberFormatInput
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `product-shipping-cost-table-${row}-${subRow}-shipping-cost`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                value={subItem.shipping_cost}
                                                containerClass="field-money"
                                                inputClass="field-money__input"
                                                onChange={({ floatValue }): void => {
                                                    handleChangeData(getTarget(floatValue, 'shipping_cost'), item.id, subItem.id);
                                                    setIsSave(false);
                                                }}
                                                disabled={disabledInputs}
                                                subContainerClass="w-full"
                                                fixedDecimalScale
                                                maxLength={MAX_LENGTH_NUMBER_INPUT_COST}
                                            />
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })
                )}
            </Table>
            <p
                className={`mt-2 ${
                    lengthGreaterThanZero(data) ? 'xs:ml-5 ml-7' : 'xs:ml-0 ml-5'
                } underline cursor-pointer hover:text-purple  text-green w-max`}
                onClick={addPlace}
            >
                + Agregar {isNationalTable ? 'departamento' : 'país'}
            </p>
            {tableError && (
                <div className="mt-2 ml-8">
                    <TableError customText={tableError} />
                </div>
            )}
            {data.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </>
    );
};
