import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { deleteCategoryOrVariant } from '@redux/product-catalog/actions';
import { ProductDatabaseContext } from '@pages/product-database/context';
import { ADD_PRICE_CODE, PRODUCT_CATALOG } from '@information-texts/ProductDatabase';
import { IGenericRecord } from '@models/GenericRecord';
import { ModalCustom } from '@components/modal-custom';
import { Information } from '@components/information';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { UNIQUE_PRODUCT } from '@constants/Product';
import { UniqueProduct, VariantsTable } from './components';
import './AddPriceAndCode.scss';

export const AddPriceAndCode: React.FC<IGenericRecord> = () => {
    const { setData, variantList, setVariantList, isUniqueProduct, data, validate, edit, productEdit } = useContext(
        ProductDatabaseContext
    );

    const { errorDelete } = useSelector((state: RootState) => state.productCatalog);

    const dispatch = useDispatch();

    const [productsError] = errorDelete;

    const [showModalError, setShowModalError] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState('');
    const [idExistingProducts, setIdExistingProducts] = useState<string[]>([]);

    useEffect(() => {
        setIdExistingProducts(productEdit?.unique_products?.map((product: IGenericRecord) => product.id) ?? []);
    }, [productEdit]);

    const deleteProductInEdition = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const documentsInProcess: any = await dispatch(deleteCategoryOrVariant([{ id: deleteProductId }], false, false));
        if (documentsInProcess) {
            setShowModalConfirmDelete(!showModalConfirmDelete);
            return setShowModalError(true);
        }
        setIdExistingProducts(idExistingProducts.filter(id => id !== deleteProductId));
        setVariantList((prevVariantList: IGenericRecord) =>
            prevVariantList.map((variant: IGenericRecord) =>
                variant.id === deleteProductId ? { ...variant, select: !variant.select } : variant
            )
        );
        setShowModalConfirmDelete(!showModalConfirmDelete);
        setDeleteProductId('');
    };

    const toggleSelect = (idOption: string): void => {
        if (edit && idExistingProducts.includes(idOption)) {
            setDeleteProductId(idOption);
            setShowModalConfirmDelete(true);
            return;
        }
        setVariantList((prevVariantList: IGenericRecord) =>
            prevVariantList.map((variant: IGenericRecord) =>
                variant.id === idOption ? { ...variant, select: !variant.select } : variant
            )
        );
    };

    const handleChangeValue = ({ value }: IGenericRecord, idVariant: string, name: string): void => {
        setVariantList(
            variantList.map((variant: IGenericRecord) => (variant.id === idVariant ? { ...variant, [name]: value } : variant))
        );
    };

    const handleChangeUniqueValue = ({ value }: IGenericRecord, reference: string, name: string): void => {
        setData((data: IGenericRecord) => ({
            ...data,
            unique_products: data.unique_products.map((product: IGenericRecord) =>
                product.id === reference ? { ...product, [name]: value } : product
            ),
        }));
    };

    const closeModal = (): void => {
        setShowModalError(!showModalError);
    };

    return (
        <div className="bg-white rounded-lg shadow-templateDesign product-management__price-code">
            <Information
                title={ADD_PRICE_CODE.TITLE}
                classNameTitle="add-price-code__title"
                description={ADD_PRICE_CODE.DESCRIPTION(isUniqueProduct)}
            />
            {isUniqueProduct ? (
                <UniqueProduct
                    handleChangeUniqueValue={handleChangeUniqueValue}
                    uniqueProduct={data.unique_products?.[UNIQUE_PRODUCT]}
                    validate={validate}
                />
            ) : (
                <VariantsTable
                    variantList={variantList}
                    toggleSelect={toggleSelect}
                    handleChangeValue={handleChangeValue}
                    validate={validate}
                />
            )}
            <ModalCustom
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'product-service-price-code-delete',
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={showModalConfirmDelete}
                removeMinWidth
                classesModal="add-inventory__modal-wrapper"
                showModal={(): void => setShowModalConfirmDelete(!showModalConfirmDelete)}
            >
                <Icon name="trashMulticolor" classIcon="w-22" />
                <Information
                    title="Eliminar producto/servicio"
                    description="¿Está seguro que desea eliminar el producto/servicio seleccionado?"
                    classNameTitle="text-center mt-2"
                    classNameDescription="text-center mb-7 mt-2"
                    classNameSubContainer="flex flex-col justify-center items-center"
                />
                <div className="flex gap-4.5">
                    <Button
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-price-code-delete',
                            action: ActionElementType.CANCEL,
                            elementType: ElementType.BTN,
                        })}
                        text="Cancelar"
                        onClick={(): void => setShowModalConfirmDelete(!showModalConfirmDelete)}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-price-code-delete',
                            action: ActionElementType.DELETE,
                            elementType: ElementType.BTN,
                        })}
                        text="Eliminar"
                        onClick={(): Promise<void> => deleteProductInEdition()}
                    />
                </div>
            </ModalCustom>
            <ModalCustom
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'product-service-price-code-delete-error',
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={showModalError}
                showModal={closeModal}
                classesModal="product-catalog__modal-error-delete modal--full"
                classAdditional="z-40"
                removeMinWidth
            >
                {PRODUCT_CATALOG.notDeletedProduct(productsError?.unique_product_name, productsError?.electronic_documents)}
                <div className="flex gap-5.5 justify-center">
                    <Button
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-price-code-delete-error',
                            action: ActionElementType.ACCEPT,
                            elementType: ElementType.BTN,
                        })}
                        text="Aceptar"
                        onClick={closeModal}
                        classes="mt-7 xs:block bg-blue"
                    />
                </div>
            </ModalCustom>
        </div>
    );
};
