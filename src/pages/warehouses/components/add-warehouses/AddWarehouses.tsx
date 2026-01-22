import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { createWarehouse, getWarehousesData, updateUniqueWarehouse } from '@redux/warehouses/actions';
import { RootState } from '@redux/rootReducer';
import { SelectSearchInput, TextInput } from '@components/input';
import { ModalCustom } from '@components/modal-custom';
import { Information } from '@components/information';
import { BreadCrumb } from '@components/bread-crumb';
import { Button } from '@components/button';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { INFORMATION } from '@information-texts/Warehouses';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { COLOMBIA } from '@constants/Location';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { buildOptionsSearch } from '@utils/Company';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { hasEmptyFields, routesAddWarehouses, initialState, requiredFields } from '.';

export const AddWarehouses: React.FC<IGenericRecord> = ({ warehouseEdit, warehouseList }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { getDynamicRequest, warehouses } = useSelector((state: RootState) => state.warehouses);

    const { disabledInputs } = usePermissions();

    const [validate, setValidate] = useState(false);
    const [warehouse, setWarehouse] = useState<IGenericRecord>(initialState);
    const [showModalSuccess, setShowModalSuccess] = useState(false);

    const nameExist = useMemo(
        () =>
            warehouseList
                ?.filter((item: IGenericRecord) => (warehouseEdit ? item.id !== warehouseEdit.id : true))
                .some((item: IGenericRecord) => item.name.toLowerCase() === warehouse.name.toLowerCase()),
        [warehouse.name]
    );

    const { ADD_WAREHOUSE, EDIT_WAREHOUSE } = INFORMATION;

    useEffect(() => {
        const warehouseData = warehouses[0];
        setWarehouse(warehouse => ({ ...warehouse, warehouse_conf_id: warehouseData?.id ?? uuid() }));
    }, [warehouses]);

    useEffect(() => {
        if (warehouseEdit) setWarehouse({ ...warehouseEdit });
    }, [warehouseEdit]);

    const handleSelectChange = (field: string) => (selectedValue: IGenericRecord, selectedOption: IGenericRecord): void => {
        setWarehouse(prevState => ({
            ...prevState,
            [field + '_id']: selectedOption.value,
            [field + '_name']: selectedOption.name,
        }));
    };

    const handleChangeText = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>): void => {
        setWarehouse({ ...warehouse, [name]: value });
    };

    const saveWarehouseData = async (): Promise<void> => {
        if (hasEmptyFields(warehouse, requiredFields).length) return setValidate(true);
        const statusCode = await dispatch(createWarehouse([warehouse], false));
        if (SUCCESS_RESPONSE.includes(Number(statusCode))) setShowModalSuccess(true);
    };

    const updateWarehouseData = async (): Promise<void> => {
        if (hasEmptyFields(warehouse, requiredFields).length) return setValidate(true);
        const statusCode = await dispatch(updateUniqueWarehouse(warehouse));
        if (SUCCESS_RESPONSE.includes(Number(statusCode))) setShowModalSuccess(true);
    };

    return (
        <div className="flex flex-col h-full">
            <BreadCrumb routes={routesAddWarehouses(warehouseEdit)} />
            <Information
                title={warehouseEdit ? EDIT_WAREHOUSE.TITLE : ADD_WAREHOUSE.TITLE}
                description={warehouseEdit ? EDIT_WAREHOUSE.DESCRIPTION : ADD_WAREHOUSE.DESCRIPTION}
                classNameSubContainer="flex justify-center"
                classNameContainer="mb-4.5"
                color="blue"
                classNameTitle="warehouse-add__title"
            />
            <div className="bg-white rounded-lg shadow-templateDesign p-4.5">
                <h4 className="text-base font-allerbold mb-4.5 text-gray-dark">Información básica</h4>
                <Form sendWithEnter>
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                            submodule: 'add-name-warehouse',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="*Nombre de la bodega:"
                        placeholder="..."
                        classesWrapper="warehouse-add__name xs:w-full"
                        name="name"
                        tooltipInfo
                        descTooltip="Es el nombre de la(s) bodega(s) en las que está almacenado el producto."
                        titleTooltip="Nombre de la bodega: "
                        maxLength={60}
                        onChange={handleChangeText}
                        value={warehouse.name}
                        required={(validate && !warehouse.name) || nameExist}
                        requiredText={nameExist ? '*El nombre de bodega ya se encuentra registrado' : '*Campo obligatorio'}
                        disabled={disabledInputs}
                    />
                    <Form sendWithEnter className="flex gap-7 mt-4.5 xs:flex-col xs:gap-4.5">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                submodule: 'add-country',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            name="country"
                            classesWrapper="w-full relative sm:w-73"
                            labelText="*País:"
                            tooltipInfo
                            descTooltip="Ubicación geográfica de la bodega."
                            titleTooltip="País: "
                            valueSelect={warehouse?.country_id || ''}
                            required={validate && !warehouse?.country_name}
                            placeholder="Seleccionar"
                            optionSelect={buildOptionsSearch(getDynamicRequest?.countries) || []}
                            onChangeSelect={handleSelectChange('country')}
                            disabled={disabledInputs}
                        />
                        <div>
                            {warehouse.country_name === COLOMBIA ? (
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                        submodule: 'add-department',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    name="department_name"
                                    labelText="Departamento:"
                                    classesWrapper="w-full relative md:w-73"
                                    classNameMain="xs:w-full"
                                    placeholder="Seleccionar"
                                    valueSelect={warehouse?.department_id || ''}
                                    optionSelect={buildOptionsSearch(getDynamicRequest?.departments) || []}
                                    onChangeSelect={handleSelectChange('department')}
                                    required={validate && !warehouse?.department_name}
                                    tooltipInfo
                                    descTooltip="Es el departamento o estado donde está ubicada la bodega."
                                    titleTooltip="Departamento: "
                                    disabled={disabledInputs}
                                />
                            ) : (
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                        submodule: 'add-department',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name="department_name"
                                    labelText="*Departamento:"
                                    placeholder="..."
                                    value={warehouse?.department_name || ''}
                                    onChange={handleChangeText}
                                    required={validate && !warehouse.department_name}
                                    maxLength={240}
                                    tooltipInfo
                                    descTooltip="Es el departamento o estado donde está ubicada la bodega."
                                    titleTooltip="Departamento: "
                                    disabled={disabledInputs}
                                    classesWrapper="xs:w-full"
                                />
                            )}
                        </div>
                    </Form>
                    <Form sendWithEnter className="flex gap-7 mt-4.5 xs:flex-col xs:gap-4.5">
                        {warehouse.country_name === COLOMBIA ? (
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                    submodule: 'add-city',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                name="city_id"
                                labelText="*Ciudad:"
                                placeholder="Seleccionar"
                                required={validate && !warehouse.city_name}
                                classesWrapper="input mt-4.5 w-full md:w-73 lg:mt-0"
                                classNameMain="xs:w-full"
                                optionSelect={buildOptionsSearch(
                                    getDynamicRequest?.cities.filter(
                                        (item: IGenericRecord) => item.department_id === String(warehouse.department_id)
                                    )
                                )}
                                tooltipInfo
                                descTooltip="Es la ciudad donde está ubicada la bodega."
                                titleTooltip="Ciudad: "
                                onChangeSelect={handleSelectChange('city')}
                                valueSelect={warehouse?.city_id || ''}
                                disabled={disabledInputs}
                            />
                        ) : (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                    submodule: 'add-city',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="*Ciudad:"
                                name="city_name"
                                placeholder="..."
                                value={warehouse?.city_name || ''}
                                required={validate && !warehouse.city_name}
                                maxLength={240}
                                tooltipInfo
                                descTooltip="Es la ciudad donde está ubicada la bodega."
                                titleTooltip="Ciudad: "
                                onChange={handleChangeText}
                                disabled={disabledInputs}
                                classesWrapper="xs:w-full"
                            />
                        )}

                        <TextInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                submodule: 'add-address',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Dirección:"
                            name="address"
                            placeholder="..."
                            value={warehouse?.address || ''}
                            required={validate && !warehouse.address}
                            maxLength={60}
                            tooltipInfo
                            descTooltip="Donde está ubicada la bodega."
                            titleTooltip="Dirección: "
                            onChange={handleChangeText}
                            disabled={disabledInputs}
                            classesWrapper="xs:w-full"
                        />
                    </Form>
                </Form>
            </div>
            <div className="flex items-end xs:justify-center justify-end gap-4.5 xs:my-4.5 mt-16">
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: 'add',
                        action: ActionElementType.BACK,
                        elementType: ElementType.BTN,
                    })}
                    background="white"
                    text="Atrás"
                    onClick={(): void => history.goBack()}
                    classes="xs:w-22.3 shadow-templateDesign"
                />
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: 'add',
                        action: ActionElementType.SAVE,
                        elementType: ElementType.BTN,
                    })}
                    text="Guardar"
                    onClick={(): Promise<void> => (warehouseEdit ? updateWarehouseData() : saveWarehouseData())}
                    classes="xs:w-22.3 shadow-templateDesign"
                    disabled={disabledInputs}
                />
            </div>
            <ModalCustom
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                    submodule: 'save-warehouse',
                    action: ActionElementType.SUCCESS,
                    elementType: ElementType.MDL,
                })}
                show={showModalSuccess}
                showModal={(): void => setShowModalSuccess(!showModalSuccess)}
                classesModal="warehouse-list__modal-delete"
                classIconClose="warehouse-add__modal-icon"
                removeMinWidth
            >
                <Icon name="checkMulticolor" className="w-22" />
                <h4 className="my-2 font-allerbold text-blue">Información guardada</h4>
                <p className="mb-7">¡Su información ha sido guardada con éxito!</p>
                <div className="flex gap-7">
                    <Button
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                            submodule: 'save-warehouse',
                            action: ActionElementType.ACCEPT,
                            elementType: ElementType.BTN,
                        })}
                        text="Aceptar"
                        onClick={(): void => {
                            setShowModalSuccess(!showModalSuccess);
                            dispatch(getWarehousesData());
                            history.push(history.push(getRoute(Routes.WAREHOUSES)));
                        }}
                        classes="xs:w-22.3 shadow-templateDesign"
                    />
                </div>
            </ModalCustom>
        </div>
    );
};
