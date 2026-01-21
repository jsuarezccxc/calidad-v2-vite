//--- Libraries ---//
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { getCitiesForDepartment, getDepartmentsForCountry } from '@redux/company/actions';
//--- Constants ---//
import { COLOMBIA_ID } from '@constants/Location';
//--- Models ---//
import { FieldName } from '@models/DataCompany';
import { IGenericRecord } from '@models/GenericRecord';
//--- Utils ---//
import { buildOptionsSearch } from '@utils/Company';
//--- Hooks ---//
import usePermissions from '@hooks/usePermissions';
//--- Components ---//
import { IOptionSelect, SelectSearchInput, TextInput } from '@components/input';
//--- Information Texts ---//
import { TOOLTIP_DATA } from '@information-texts/DataCompany';
//--- Root ---//
import { IContactInformationProps, LocationKeys, TypeLocation, TypeLocationKey } from '..';
import { MAX_INPUT_PHONE, MAX_INPUT_PHONE_CO } from '.';

export const ContactInformation: FC<IContactInformationProps> = ({
    title,
    dataInformation,
    onChangeText,
    setDataInformation,
}) => {
    const [country, handleCountry] = useState<boolean>(false);

    const { disabledInputs } = usePermissions();

    const dispatch = useDispatch();
    const { dynamicData } = useSelector(({ dynamicData }: RootState) => dynamicData);

    const handleSelect = (
        fieldType: TypeLocation,
        selectedValue: IOptionSelect,
        executeAction?: (value: string) => void
    ): void => {
        const { value, id }: IGenericRecord = selectedValue;

        const updatedData = {
            ...dataInformation,
            [`${fieldType}_id`]: id,
            [`${fieldType}_name`]: value,
        };

        if (fieldType === LocationKeys.Country) {
            updatedData[TypeLocationKey.DepartmentId] = '';
            updatedData[TypeLocationKey.DepartmentName] = '';
            updatedData[TypeLocationKey.CityId] = '';
            updatedData[TypeLocationKey.CityName] = '';
            handleCountry(id === COLOMBIA_ID ? true : false);
        } else if (fieldType === LocationKeys.Department) {
            updatedData[TypeLocationKey.CityId] = '';
            updatedData[TypeLocationKey.CityName] = '';
            handleCountry(true);
        }
        setDataInformation(updatedData);
        if (executeAction) dispatch(executeAction(id.toString()));
    };

    useEffect(() => {
        if (Number(dataInformation.country_id) === COLOMBIA_ID) handleCountry(true);
    }, [dataInformation.country_id]);

    return (
        <section className="p-4 mb-4 bg-white rounded-md shadow-lg">
            <h2 className="mb-3 text-green font-allerbold">{title}</h2>
            <div className="flex flex-wrap gap-x-7 gap-y-1">
                <TextInput
                    name="address"
                    value={dataInformation.address}
                    maxLength={240}
                    labelText="Dirección"
                    tooltipInfo
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73 mb-4"
                    {...TOOLTIP_DATA[FieldName.Address]}
                    onChange={onChangeText}
                    disabled={disabledInputs}
                />
                <SelectSearchInput
                    labelText="País:"
                    tooltipInfo
                    placeholder="Seleccionar"
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73"
                    classNameMain="w-full md:w-73 mb-4"
                    selectIconType="arrowDownGreen"
                    selectTextClass="text-center"
                    {...TOOLTIP_DATA[FieldName.Country]}
                    disabled={disabledInputs}
                    onChangeSelect={(_, option): void => {
                        handleSelect(
                            LocationKeys.Country,
                            { id: option?.value, value: option.name, key: option?.value },
                            getDepartmentsForCountry
                        );
                    }}
                    optionSelect={buildOptionsSearch(dynamicData.countries)}
                    valueSelect={buildOptionsSearch(dynamicData.countries).find(
                        option => option?.name === dataInformation?.country_name
                    )}
                />
                {!country ? (
                    <TextInput
                        name="department_name"
                        maxLength={240}
                        labelText="Departamento:"
                        value={dataInformation.department_name || ''}
                        tooltipInfo
                        placeholder="..."
                        classesInput="w-full"
                        classesWrapper="w-full md:w-73 mb-4"
                        {...TOOLTIP_DATA[FieldName.Department]}
                        onChange={onChangeText}
                        disabled={disabledInputs}
                    />
                ) : (
                    <SelectSearchInput
                        labelText="Departamento:"
                        tooltipInfo
                        placeholder="Seleccionar"
                        classesInput="w-full"
                        classesWrapper="w-full md:w-73"
                        classNameMain="w-full md:w-73 mb-4"
                        selectIconType="arrowDownGreen"
                        selectTextClass="text-center"
                        {...TOOLTIP_DATA[FieldName.Department]}
                        disabled={disabledInputs}
                        onChangeSelect={(_, option): void => {
                            handleSelect(
                                LocationKeys.Department,
                                { id: option?.value, value: option.name, key: option?.value },
                                getCitiesForDepartment
                            );
                        }}
                        optionSelect={buildOptionsSearch(dynamicData.departments)}
                        valueSelect={buildOptionsSearch(dynamicData.departments).find(
                            option => option?.name === dataInformation?.department_name
                        )}
                    />
                )}
                {!country ? (
                    <TextInput
                        name="city_name"
                        maxLength={240}
                        labelText="Ciudad"
                        tooltipInfo
                        placeholder="..."
                        classesInput="w-full"
                        value={dataInformation.city_name || ''}
                        classesWrapper="w-full md:w-73 mb-4"
                        {...TOOLTIP_DATA[FieldName.City]}
                        onChange={onChangeText}
                        disabled={disabledInputs}
                    />
                ) : (
                    <SelectSearchInput
                        labelText="Ciudad:"
                        tooltipInfo
                        placeholder="Seleccionar"
                        classesInput="w-full"
                        classesWrapper="w-full md:w-73"
                        classNameMain="w-full md:w-73 mb-4"
                        selectIconType="arrowDownGreen"
                        selectTextClass="text-center"
                        {...TOOLTIP_DATA[FieldName.City]}
                        disabled={disabledInputs}
                        onChangeSelect={(_, option): void => {
                            handleSelect(LocationKeys.City, { id: option?.value, value: option.name, key: option?.value });
                        }}
                        optionSelect={buildOptionsSearch(
                            dynamicData?.cities?.filter(
                                ({ department_id }: IGenericRecord) =>
                                    String(department_id) === String(dataInformation.department_id)
                            )
                        )}
                        valueSelect={buildOptionsSearch(dynamicData.cities).find(
                            option => option?.name === dataInformation?.city_name
                        )}
                    />
                )}
                <TextInput
                    name="postal_code"
                    value={dataInformation.postal_code}
                    labelText="Código postal:"
                    maxLength={6}
                    tooltipInfo
                    onlyNumbers
                    placeholder="Código postal"
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73 mb-4"
                    {...TOOLTIP_DATA[FieldName.PostalCode]}
                    onChange={onChangeText}
                    disabled={disabledInputs}
                />
                <TextInput
                    name="phone"
                    value={dataInformation.phone}
                    maxLength={Number(dataInformation?.country_id) === COLOMBIA_ID ? MAX_INPUT_PHONE_CO : MAX_INPUT_PHONE}
                    labelText="Teléfono"
                    onlyNumbers
                    tooltipInfo
                    placeholder="Teléfono"
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73 mb-4"
                    {...TOOLTIP_DATA[FieldName.PostalCode]}
                    onChange={onChangeText}
                    disabled={disabledInputs}
                />
                <TextInput
                    name="email"
                    value={dataInformation.email}
                    disabled
                    labelText="*Correo electrónico:"
                    placeholder="Correo electrónico"
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73 mb-4"
                    classesWrapperInput="border-none"
                    onChange={onChangeText}
                    limitCharacters={false}
                />
            </div>
        </section>
    );
};
