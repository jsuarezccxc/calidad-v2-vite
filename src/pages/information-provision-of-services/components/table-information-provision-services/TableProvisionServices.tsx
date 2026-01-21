import React, { Fragment } from 'react';
import { Link } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { SelectSearchTableInput } from '@components/input';
import { getChecked, handleChecked } from '@utils/Checkboxs';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { validateCities } from '@pages/information-provision-of-services';
import usePermissions from '@hooks/usePermissions';
import { ITableProvisionServices } from '..';
import '../../InformationProvisionOfServices.scss';

export const TableProvisionServices: React.FC<ITableProvisionServices> = ({
    dataLocation,
    addCity,
    handleChangeSelectDepartment,
    handleChangeSelectCity,
    idDeleteCity = [],
    idDeleteDepartment = [],
    setIdDeleteDepartment,
    setIdDeleteCity,
    onClickSelect = (): void => {},
    validationCities = false,
    citiesRequest,
    validateCitiesZero,
}) => {
    const { disabledInputs } = usePermissions();
    return (
        <>
            {dataLocation?.map((itemDepartment, indexDepartment) => (
                <Fragment key={itemDepartment.id}>
                    {itemDepartment?.cities?.map((itemCities, indexCities) => (
                        <Fragment key={itemCities.id}>
                            <tr
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `info-provision-services-city-department-${itemCities.id}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                            >
                                {indexCities === 0 && (
                                    <>
                                        <td
                                            className="lg:w-5 lg:h-10 xs:w-0.5 xs:pr-2 lg:pr-1.5"
                                            rowSpan={itemDepartment.cities.length}
                                        >
                                            <div className="w-5 lg:mr-1 xs:pr-2 ">
                                                <Checkbox
                                                    checked={getChecked(String(itemDepartment.id), idDeleteDepartment)}
                                                    onChange={(): void =>
                                                        handleChecked(itemDepartment, idDeleteDepartment, setIdDeleteDepartment)
                                                    }
                                                    classContainer="w-max xs:w-5"
                                                />
                                            </div>
                                        </td>
                                        <td
                                            className={`"lg:h-9.25 xs:h-6.8 w-72 text-gray-dark xs:pr-2" ${
                                                (validationCities && itemDepartment.department_name === '') ||
                                                validateCitiesZero.includes(itemDepartment.department_name)
                                                    ? 'border-purple-error'
                                                    : 'field-body--editable'
                                            }`}
                                            rowSpan={itemDepartment.cities.length}
                                        >
                                            <div
                                                className="flex flex-col xs:h-6.8 justify-center w-full h-full lg:ml-0.5 xs:w-full  "
                                                onClick={(): void => {
                                                    onClickSelect(`department${indexDepartment + 1}`, 'department');
                                                }}
                                                onBlur={(): void => {
                                                    onClickSelect(`department${indexDepartment + 1}`, 'blur');
                                                }}
                                                id={`department${indexDepartment + 1}`}
                                            >
                                                <SelectSearchTableInput
                                                    id={generateId({
                                                        module: ModuleApp.WEBSITE,
                                                        submodule: `info-provision-services-city-department-name-${itemCities.id}`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.DRP,
                                                    })}
                                                    name="departmen_name"
                                                    placeholder="Seleccionar"
                                                    classesWrapper="relative xs:w-full select-table"
                                                    iconClassName="lg:-top-1 xs:top-2 "
                                                    optionSelect={itemDepartment.options}
                                                    valueSelect={Number(itemDepartment.department_id)}
                                                    classesWrapperInput="lg:w-52 border-none text-gray-dark text-center xs:h-6.8 h-full xs:w-full xs:text-tiny"
                                                    classesInput="lg:w-full lg:pl-10 xs:mr-2"
                                                    onChangeSelect={(selectedValue, selectedOption): void => {
                                                        handleChangeSelectDepartment(selectedOption, itemDepartment.id);
                                                    }}
                                                    disabled={disabledInputs}
                                                />
                                            </div>
                                        </td>
                                    </>
                                )}
                                {!itemCities.link ? (
                                    <>
                                        <td
                                            className={`"lg:h-9.25 xs:h-6.8 w-72 text-gray-dark xs:pr-2" ${
                                                validationCities && itemCities.name === ''
                                                    ? 'border-purple-error'
                                                    : 'field-body--editable'
                                            }`}
                                            rowSpan={1}
                                        >
                                            <div
                                                className="flex flex-col xs:h-6.8 justify-center w-full h-full lg:ml-0.5 xs:w-full  "
                                                onClick={(): void => {
                                                    onClickSelect(`city${indexCities + 1}`, 'city');
                                                }}
                                                onBlur={(): void => {
                                                    onClickSelect(`city${indexCities + 1}`, 'blur');
                                                }}
                                                id={`city${indexCities + 1}`}
                                            >
                                                <SelectSearchTableInput
                                                    id={generateId({
                                                        module: ModuleApp.WEBSITE,
                                                        submodule: `info-provision-services-city-name-department-${itemCities.id}`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.DRP,
                                                    })}
                                                    name="city_name"
                                                    placeholder="Seleccionar"
                                                    classesWrapper="relative xs:w-full select-table"
                                                    iconClassName="lg:-top-1 xs:top-2 "
                                                    optionSelect={itemDepartment.department_id ? itemCities.options : []}
                                                    valueSelect={Number(itemCities.city_id)}
                                                    classesWrapperInput="lg:w-52 border-none text-gray-dark text-center xs:h-6.8 h-full xs:w-full xs:text-tiny"
                                                    classesInput="lg:w-full lg:pl-10 xs:mr-2"
                                                    onChangeSelect={(selectedValue, selectedOption): void => {
                                                        handleChangeSelectCity(selectedOption, itemCities.id, itemDepartment.id);
                                                    }}
                                                    disabled={disabledInputs}
                                                />
                                            </div>
                                        </td>
                                        <td className="lg:w-5 lg:h-10 xs:w-0.5 xs:pl-2 lg:pl-1.5" rowSpan={1}>
                                            <div className="w-5 xs:w-0.5 lg:ml-1 xs:pl-2 ">
                                                <Checkbox
                                                    checked={getChecked(String(itemCities.id), idDeleteCity)}
                                                    onChange={(): void =>
                                                        handleChecked(itemCities, idDeleteCity, setIdDeleteCity)
                                                    }
                                                    classContainer="w-max xs:w-5 "
                                                />
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <td className="h-10 xs:h-8.2 p-0 text-gray-dark field-body--editable" colSpan={1}>
                                        <Link
                                            id={generateId({
                                                module: ModuleApp.WEBSITE,
                                                submodule: `info-provision-services-city`,
                                                action: ActionElementType.ADD,
                                                elementType: ElementType.LNK,
                                            })}
                                            href="#"
                                            text="+ Agregar ciudad"
                                            classes="xs:text-tiny mx-5 flex"
                                            onClick={(): void => {
                                                addCity(itemDepartment.id, itemDepartment.department_id);
                                            }}
                                            disabled={
                                                validateCities(
                                                    citiesRequest,
                                                    itemDepartment.cities.map(item => String(item.city_id)),
                                                    itemDepartment.department_id
                                                ) || disabledInputs
                                            }
                                        />
                                    </td>
                                )}
                            </tr>
                        </Fragment>
                    ))}
                </Fragment>
            ))}
        </>
    );
};
