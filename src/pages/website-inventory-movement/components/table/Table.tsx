import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { Table as TableComponent } from '@components/table';
import { ZERO } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';
import { availableWarehouseQuantity } from '@pages/website-inventory-movement';
import HeaderTable from '@pages/website-inventory/components/table/components/header-table';
import { RootState } from '@redux/rootReducer';
import { lengthGreaterThanOne } from '@utils/Length';
import { ONE } from '@constants/Numbers';
import { generateId, ElementType, ActionElementType, ModuleApp } from '@utils/GenerateId';
import { DynamicBody } from './components/dynamic-body';
import '../../WebsiteInventory.scss';
import { ITableParams } from '.';

const Table: React.FC<ITableParams> = ({ validations, data, setDataToSend, dataToSend, isOutput }) => {
    const { validate, quantityValidate } = validations;
    const { loader: loaderState } = useSelector(({ loader }: RootState) => ({ ...loader }));
    const [itemsSelected, setItemsSelected] = useState<IGenericRecord>({});
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        setItemsSelected(validateItemsToDelete());
    }, [dataToSend]);

    const validateItemsToDelete = (): IGenericRecord => {
        const dataObj = dataToSend[0];
        const itemsToDelete: IGenericRecord = { batches: [], warehouses: [] };
        dataObj?.batches?.forEach((batch: IGenericRecord) => {
            if (batch?.isChecked) {
                itemsToDelete.batches.push(batch);
            } else {
                batch?.warehouses?.forEach((warehouse: IGenericRecord) => {
                    if (warehouse?.isChecked) {
                        itemsToDelete.warehouses.push(warehouse);
                    }
                });
            }
        });
        return itemsToDelete;
    };

    const handleTrash = (): void => {
        const dataObj = dataToSend[ZERO];
        setDataToSend([
            {
                ...dataObj,
                batches: dataObj?.batches
                    ?.map((batch: IGenericRecord) => {
                        if (!batch?.isChecked || dataObj?.batches?.length === ONE) {
                            return {
                                ...batch,
                                warehouses: lengthGreaterThanOne(batch?.warehouses)
                                    ? batch?.warehouses
                                          ?.map((warehouse: IGenericRecord) => {
                                              if (!warehouse?.isChecked) {
                                                  return {
                                                      ...warehouse,
                                                  };
                                              }
                                          })
                                          .filter((warehouse: IGenericRecord) => warehouse?.id)
                                    : batch?.warehouses,
                            };
                        }
                    })
                    .filter((batch: IGenericRecord) => batch?.id),
            },
        ]);
        setDeleteModal(!deleteModal);
    };

    return (
        <section className="flex flex-col w-full xl:w-max">
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-website-inventory-movement`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => setDeleteModal(!deleteModal)}
                open={deleteModal}
            >
                <div className="delete-modal">
                    <Icon name="recycleBin" className="w-22.2 h-22.2 mb-2" />
                    <p className="mb-2 text-xl font-bold text-blue font-allerbold">{`Eliminar ${
                        itemsSelected?.batches?.length ? 'lote' : 'bodega'
                    }`}</p>
                    <p className="text-base text-center text-gray-dark">
                        ¿Está seguro que desea eliminar la información seleccionada?
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-website-inventory-movement`,
                                action: ActionElementType.CANCEL,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => setDeleteModal(!deleteModal)}
                            text="Cancelar"
                            classes="mr-6"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-website-inventory-movement`,
                                action: ActionElementType.DELETE,
                                elementType: ElementType.BTN,
                            })}
                            text="Eliminar"
                            onClick={handleTrash}
                        />
                    </div>
                </div>
            </Modal>
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `website-inventory-movement`,
                    action: ActionElementType.TRASH,
                    elementType: ElementType.ICO,
                })}
                name="trashBlue"
                classIcon="w-5.5 mt-1 mb-2 self-end cursor-pointer"
                onClick={(): void => {
                    setDeleteModal(!deleteModal);
                }}
            />
            <TableComponent
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `website-inventory-movement`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isLoading={loaderState}
                sendFormWithEnter
                isHeaderRowsCustom
                headerRowsCustom={<HeaderTable />}
                fieldsBody={[]}
                data={[]}
                editable={false}
                customTable
                className="overflow-x-scroll table-inventory"
                isNew
                wrapperClassName="overflow-x-scroll table-inventory__container"
            >
                <DynamicBody
                    data={data}
                    validations={validations}
                    setDataToSend={setDataToSend}
                    dataToSend={dataToSend}
                    isOutput={isOutput}
                />
            </TableComponent>
            {validate && (
                <p className="p-0 mt-2 leading-4 text-tiny text-purple font-aller">{`${
                    quantityValidate ? '*La cantidad de salida supera la cantidad disponible en la bodega' : '*Campo obligatorio'
                }`}</p>
            )}
            <div>
                <div className="mt-4.5 bg-white md:w-full lg:w-max xl:w-max">
                    <div className="flex flex-row">
                        <div className="px-2 py-3 text-sm whitespace-normal font-aller bg-opacity-20 bg-green text-blue">
                            Total cantidad disponible para la venta
                        </div>
                        <div className="px-2 py-3 text-sm text-right bg-white font-allerbold text-gray-dark">
                            {data?.quantity ?? 0}
                        </div>
                    </div>
                    <div className="w-full px-2 py-3 text-sm whitespace-normal bg-opacity-20 font-aller text-blue bg-green border-b-1 border-gray">
                        <div>Total cantidad disponible para la venta por bodega</div>
                    </div>
                    {availableWarehouseQuantity(data, data?.is_perishable)?.map(({ warehouseName, quantity }, index) => (
                        <div key={`${index}-${warehouseName}`} className={`flex flex-row ${index % 2 ? 'bg-gray-light' : ''}`}>
                            <div className="px-2 py-3 text-sm whitespace-normal font-aller footer-width-field text-gray">
                                Cantidad disponible de {warehouseName}
                            </div>
                            <div className="w-full px-2 py-3 text-sm text-right font-aller text-gray">
                                {(quantity as number) ?? 0}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Table;
