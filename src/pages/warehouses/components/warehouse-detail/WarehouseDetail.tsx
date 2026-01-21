import { useHistory } from 'react-router';
import React from 'react';
import { INFORMATION } from '@information-texts/Warehouses';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { Information } from '@components/information';
import { BreadCrumb } from '@components/bread-crumb';
import { TextInput } from '@components/input';
import { Button } from '@components/button';
import { Routes } from '@constants/Paths';
import { Icon } from '@components/icon';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { routesWarehouseDetail } from '.';
import './WarehouseDetail.scss';

export const WarehouseDetail: React.FC<IGenericRecord> = ({ warehouse }) => {
    const history = useHistory();

    const { disabledInputs } = usePermissions();

    const { WAREHOUSE_DETAIL } = INFORMATION;

    return (
        <div className="flex flex-col h-full ">
            <BreadCrumb routes={routesWarehouseDetail} />
            <Information
                classNameTitle="product-management__title text-26lg"
                classNameSubContainer="flex justify-center mb-4.5"
                title={WAREHOUSE_DETAIL.TITLE}
                color="blue"
                description={WAREHOUSE_DETAIL.DESCRIPTION}
            />
            <div
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                    submodule: 'detail-warehouse-edit',
                    action: ActionElementType.REDIRECT,
                    elementType: ElementType.BTN,
                })}
                className="warehouse-detail__edit"
                {...(!disabledInputs && {
                    onClick: (): void => history.push(`${getRoute(Routes.WAREHOUSES)}?mode=edit&id=${warehouse.id}`),
                })}
            >
                <Icon name="documentAddMulticolor" classIcon="warehouse-detail__icon" />
                <p className="text-sm text-center font-allerbold text-blue">Editar información de la bodega</p>
            </div>
            <div className="warehouse-detail__basic-information">
                <h5 className="text-base font-allerbold text-green ml-1.5 mb-4">Información básica</h5>
                <TextInput
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: 'detail-warehouse-name',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="Nombre de la bodega"
                    classesLabel="warehouse-detail__input-label"
                    classesWrapperInput="warehouse-detail__input"
                    classesInput="warehouse-detail__input-text"
                    classesWrapper="xs:w-full"
                    value={warehouse?.name}
                    disabled
                />
                <div className="warehouse-detail__location">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                            submodule: 'detail-warehouse-country',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Pais"
                        classesLabel="warehouse-detail__input-label"
                        classesWrapperInput="warehouse-detail__input"
                        classesInput="warehouse-detail__input-text"
                        classesWrapper="warehouse-detail__location-country"
                        value={warehouse.country_name}
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                            submodule: 'detail-warehouse-department',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Departamento"
                        classesLabel="warehouse-detail__input-label"
                        classesWrapperInput="warehouse-detail__input"
                        classesInput="warehouse-detail__input-text"
                        classesWrapper="warehouse-detail__location-department"
                        value={warehouse.department_name}
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                            submodule: 'detail-warehouse-city',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Ciudad"
                        classesLabel="warehouse-detail__input-label"
                        classesWrapperInput="warehouse-detail__input"
                        classesInput="warehouse-detail__input-text"
                        classesWrapper="warehouse-detail__location-city"
                        value={warehouse.city_name}
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                            submodule: 'detail-warehouse-address',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Dirección"
                        classesLabel="warehouse-detail__input-label"
                        classesWrapperInput="warehouse-detail__input"
                        classesInput="warehouse-detail__input-text"
                        classesWrapper="warehouse-detail__location-address"
                        value={warehouse.address}
                        disabled
                    />
                </div>
            </div>

            <div className="flex items-end justify-end flex-1 w-full mt-7">
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: 'detail-warehouse',
                        action: ActionElementType.BACK,
                        elementType: ElementType.BTN,
                    })}
                    background="white"
                    text="Atrás"
                    onClick={(): void => {
                        history.push(getRoute(Routes.WAREHOUSES));
                    }}
                    classes="xs:w-22.3 shadow-templateDesign xs:mb-2"
                />
            </div>
        </div>
    );
};
