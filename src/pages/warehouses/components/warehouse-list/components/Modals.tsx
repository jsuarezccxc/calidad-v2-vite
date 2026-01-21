import React from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { TableHeaderModal } from './TableHeader';

const UNIQUE_ELEMENT = 1;

export const ModalDelete: React.FC<{ listDelete: string[]; onCancel: () => void; onConfirm: () => void; show: boolean }> = ({
    listDelete,
    onCancel,
    onConfirm,
    show,
}) => {
    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                submodule: `${ModuleApp.MODALS}-delete`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={onCancel}
            classesModal="warehouse-list__modal-delete"
            classIconClose="warehouse-add__modal-icon"
            removeMinWidth
        >
            <Icon name="trashMulticolor" className="w-22" />
            <h4 className="my-2 font-allerbold text-blue">
                {listDelete.length > UNIQUE_ELEMENT ? 'Eliminar bodegas' : 'Eliminar bodega'}
            </h4>
            <p className="mb-7">
                {listDelete.length > UNIQUE_ELEMENT
                    ? '¿Está seguro que desea eliminar las bodegas?'
                    : '¿Está seguro que desea eliminar la bodega?'}
            </p>
            <div className="flex gap-7">
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: `${ModuleApp.MODALS}-delete`,
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    text="Cancelar"
                    onClick={onCancel}
                    classes="xs:w-22.3 shadow-templateDesign"
                />
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: `${ModuleApp.MODALS}-delete`,
                        action: ActionElementType.DELETE,
                        elementType: ElementType.BTN,
                    })}
                    text="Eliminar"
                    onClick={onConfirm}
                    classes="xs:w-22.3 shadow-templateDesign"
                />
            </div>
        </ModalCustom>
    );
};

export const ModalTransferAlert: React.FC<{ listDelete: string[]; onClose: () => void; show: boolean }> = ({
    listDelete,
    onClose,
    show,
}) => (
    <ModalCustom
        id={generateId({
            module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
            submodule: `${ModuleApp.MODALS}-transfer-alert`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        show={show}
        showModal={onClose}
        classesModal="warehouse-list__transfer-alert"
        removeMinWidth
    >
        <Icon name="warning" className="w-22" />
        <h4 className="warehouse-list__transfer-alert--title">
            {listDelete.length > UNIQUE_ELEMENT ? 'No es posible eliminar las bodegas' : 'No es posible eliminar la bodega'}
        </h4>
        <p className="text-center mb-7 text-gray-dark">
            {listDelete.length > UNIQUE_ELEMENT
                ? 'No se puede eliminar las bodegas porque actualmente hay productos almacenados en estas. Para eliminarlas, primero traslade los productos a otra bodega.'
                : 'No se puede eliminar la bodega porque actualmente hay productos almacenados en esta. Para eliminarla, primero traslade los productos a otra bodega.'}
        </p>
        <div className="flex gap-7">
            <Button
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                    submodule: `${ModuleApp.MODALS}-transfer-alert`,
                    action: ActionElementType.BACK,
                    elementType: ElementType.BTN,
                })}
                text="Atrás"
                onClick={onClose}
                classes="xs:w-22.3 shadow-templateDesign"
            />
        </div>
    </ModalCustom>
);

export const ModalErrorDeleteInvoice: React.FC<{
    listDelete: string[];
    onClose: () => void;
    show: boolean;
    invoices: IGenericRecord[];
}> = ({ listDelete, onClose, invoices, show }) => {
    const firstElement = invoices[0];
    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                submodule: `${ModuleApp.MODALS}-error-delete-invoice`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={onClose}
            classesModal={
                invoices.length === UNIQUE_ELEMENT
                    ? 'warehouse-list__modal-error-invoice'
                    : 'warehouse-list__modal-error-invoices'
            }
            removeMinWidth
        >
            <Icon name="warning" className="w-22" />
            <h4 className="warehouse-list__transfer-alert--title">
                {listDelete.length > UNIQUE_ELEMENT ? 'Las bodegas no se han eliminado' : 'La bodega no se ha eliminado'}
            </h4>
            <div className="text-center mb-7 text-gray-dark">
                {invoices.length === UNIQUE_ELEMENT ? (
                    <p className="font-aller text-gray-dark">
                        `La bodega <span className="font-allerbold text-blue">{firstElement.warehouse_name}</span> no se ha
                        eliminado porque hay productos almacenados que se encuentran en un proceso pendiente de transmisión en
                        &nbsp;
                        <span className="font-allerbold text-blue">
                            {firstElement.invoice_type} - {firstElement.invoice_number}.
                        </span>
                        &nbsp; Una vez se finalice este proceso puede eliminar la bodega.`
                    </p>
                ) : (
                    <>
                        <p className="pb-2 text-base text-center font-aller">
                            Las bodegas no se han eliminado porque hay productos almacenados que se encuentran en un proceso
                            pendiente de transmisión. Una vez se finalice este proceso pueden eliminar las bodegas.
                        </p>
                        <Table
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                submodule: `${ModuleApp.MODALS}-error-delete-invoice`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TBL,
                            })}
                            isHeaderRowsCustom
                            headerRowsCustom={<TableHeaderModal />}
                            customTable
                            data={[]}
                            wrapperClassName="warehouse-list__wrapper-table-modal"
                        >
                            {invoices.map((item, index) => (
                                <tr
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                        submodule: `${ModuleApp.MODALS}-error-delete-invoice-${index}`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ROW,
                                    })}
                                    key={`invoice - ${index}`}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}
                                >
                                    <td className="border-b border-gray h-10 xs:h-8.5">
                                        <Text
                                            text={item.warehouse_name}
                                            disabled
                                            type="text"
                                            className="p-2 text-sm text-gray font-aller"
                                        />
                                    </td>
                                    <td className="border-b border-gray">
                                        <Text
                                            text={`${item.invoice_type}-${item.invoice_number}`}
                                            disabled
                                            type="text"
                                            className="p-2 text-sm text-gray font-aller"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </>
                )}
            </div>
            <div className="flex gap-7">
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: `${ModuleApp.MODALS}-error-delete-invoice`,
                        action: ActionElementType.ACCEPT,
                        elementType: ElementType.BTN,
                    })}
                    text="Aceptar"
                    onClick={onClose}
                    classes="xs:w-22.3 shadow-templateDesign"
                />
            </div>
        </ModalCustom>
    );
};
