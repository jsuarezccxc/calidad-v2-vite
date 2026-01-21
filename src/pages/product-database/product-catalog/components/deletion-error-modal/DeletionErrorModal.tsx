import React from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { Table } from '@components/table';
import { ONE_PRODUCT } from '@constants/AssembleProduct';
import { PRODUCT_CATALOG } from '@information-texts/ProductDatabase';
import { IGenericRecord } from '@models/GenericRecord';
import { documentText } from '@utils/ElectronicInvoice';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';

export const DeletionErrorModal: React.FC<IGenericRecord> = ({ showModalError, closeModal, data = [] }) => {
    const [product] = data;

    const showTableModal = data?.length > ONE_PRODUCT;

    const modalContent = showTableModal ? (
        <TableModal data={data} />
    ) : (
        PRODUCT_CATALOG.notDeletedProduct(product?.unique_product_name, product?.electronic_documents)
    );

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                submodule: `${ModuleApp.MODALS}-product-services-error`,
                action: ActionElementType.DELETE,
                elementType: ElementType.MDL,
            })}
            show={showModalError}
            showModal={closeModal}
            classesModal="product-catalog__modal-error-delete modal--full"
            classAdditional="z-40"
            removeMinWidth
        >
            {modalContent}
            <div className="flex gap-5.5 justify-center">
                <Button
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: `${ModuleApp.MODALS}-product-services-error`,
                        action: ActionElementType.ACCEPT,
                        elementType: ElementType.BTN,
                    })}
                    text="Aceptar"
                    onClick={closeModal}
                    classes="mt-7 xs:block bg-blue"
                />
            </div>
        </ModalCustom>
    );
};

export const TableModal: React.FC<IGenericRecord> = ({ data }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full xs:p-11 xs:pb-0">
            <Icon name="triangleInfoMulticolor" className="w-22.2" />
            <h4 className="px-10 mt-2 ml-2 text-xl text-center text-blue font-allerbold leading-xl">
                Los productos/servicios no se han eliminado
            </h4>

            <p className="mt-2 mb-2 text-center text-gray-dark">
                Los productos/servicios no se han eliminado porque se encuentran en un proceso pendiente de transmisión. Una vez
                se finalice este proceso pueden eliminar los productos/servicios.
            </p>
            <Table
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: `${ModuleApp.TABLE}-product-services-error`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                wrapperClassName="max-h-52"
                isHeaderRowsCustom
                headerRowsCustom={
                    <tr>
                        <th className="modal-delete__product text-blue xs:h-8.75 h-10">
                            <p className="text-sm leading-tight font-allerbold">Producto</p>
                        </th>
                        <th className="modal-delete__document text-blue xs:h-8.75 h-10">
                            <p className="text-sm leading-snug font-allerbold">Documento electrónico</p>
                        </th>
                    </tr>
                }
                customTable
                data={[]}
            >
                {data?.map((product: IGenericRecord, index: number) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `${ModuleApp.TABLE}-product-services-error-${product.id}-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        key={`${product.id}-${index}`}
                    >
                        <td className="modal-delete__cell">
                            <p className="text-sm">{product.unique_product_name}</p>
                        </td>

                        <td className="modal-delete__cell">
                            <p className="text-sm">{documentText(product?.electronic_documents)}</p>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};
