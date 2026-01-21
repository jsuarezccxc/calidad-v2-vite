/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FormEvent, useContext, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import trashIcon from '@assets/images/trash-blue.svg';
import { Button, SimpleButton } from '@components/button';
import { Modal } from '@components/modal';
import { IOptionSelect } from '@components/input';
import { ChangeEvent } from '@components/radiobutton';
import { DISCOUNT } from '@information-texts/WebsiteEditor';
import { ElementOption } from '@models/WebsiteNode';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { RootState } from '@redux/rootReducer';
import { uploadImage } from '@redux/website-node/actions';
import { createProductOptions } from '@utils/WebsiteNode';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { ProductItem } from './ProductItem';
import { IDiscountModalProps, DEFAULT_PRODUCT, IProduct, FIELDS_BY_OPTION } from '.';

export const DiscountModal: React.FC<IDiscountModalProps> = ({ deleteProduct, products, toggleModal, updateProducts }) => {
    const dispatch = useDispatch();
    const {
        catalogWebsite: { data: catalogWebsite },
    } = useSelector((state: RootState) => state.productCatalog);
    const { handleSettingChange, selectedElement } = useContext(ElementsContext);

    const [sizeError, setSizeError] = useState<boolean>(false);
    const [validate, setValidate] = useState<boolean>(false);

    const checkedProducts = useMemo(() => products.filter(product => product.checked), [products]);
    const discountedProducts: IProduct[] = selectedElement?.setting?.products ?? [];

    const fieldsNumber = FIELDS_BY_OPTION[selectedElement?.option ?? ElementOption.One];

    const enableLink = products.every(item => !item.edited) && discountedProducts.length + products.length < fieldsNumber;

    const productOptions = useMemo(() => createProductOptions(catalogWebsite), [catalogWebsite]);

    const deleteCheckedProducts = (): void => {
        if (checkedProducts.length) {
            const newProducts =
                checkedProducts.length === products.length ? [DEFAULT_PRODUCT] : products.filter(({ checked }) => !checked);
            updateProducts(newProducts);
            checkedProducts.map(product => deleteProduct(product.id));
        }
    };

    const handleProductChange = ({ target: { checked, name, value } }: any, id: string): void => {
        const newValue = name === 'checked' ? checked : value;
        updateProducts(products.map(product => ({ ...product, ...(product.id === id && { [name]: newValue }) })));
    };

    const handleImageChange = async ({ target: { files } }: ChangeEvent, id: string): Promise<void> => {
        if (!files) return;
        if (files[0].size > MAXIMUM_IMAGE_SIZE) return setSizeError(true);
        setSizeError(false);
        const src = String(await dispatch(uploadImage(files[0])));
        updateProducts(products.map(product => ({ ...product, ...(product.id === id && { src }) })));
    };

    const saveProducts = (): void => {
        const editedData = discountedProducts.flatMap(item => products.find(product => product.id === item.id) ?? item);
        handleSettingChange({ name: 'products', value: [...editedData, ...products.filter(item => !item.edited)] });
        updateProducts([]);
    };

    const selectProduct = (option: IOptionSelect, id: string): void => {
        updateProducts(products.map(product => ({ ...product, ...(product.id === id && option) })));
    };

    const sendForm = (e: FormEvent): void => {
        e.preventDefault();
        if (products.some(product => !product.name || !product.src)) return setValidate(true);
        saveProducts();
        toggleModal();
        setValidate(false);
    };

    return (
        <Modal
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            modalClassName="discount-modal"
            open
            handleClose={toggleModal}
        >
            <div className="discount-modal__content">
                <div className="discount-modal__fields bg-green-scrollbar">
                    <h2 className="discount-modal__title">Descuentos</h2>
                    <p className="discount-modal__description mb-4.5">{DISCOUNT[selectedElement?.option ?? ElementOption.One]}</p>
                    <img
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount`,
                            action: ActionElementType.TRASH,
                            elementType: ElementType.ICO,
                        })}
                        src={trashIcon}
                        alt="Trash icon"
                        onClick={deleteCheckedProducts}
                        className={`discount-modal__trash-icon cursor-${checkedProducts.length ? 'pointer' : 'default'}`}
                    />
                    <div className="flex flex-col gap-2">
                        {products.map((product, index) => (
                            <ProductItem
                                key={product.id}
                                handleProductChange={handleProductChange}
                                options={productOptions}
                                product={product}
                                selectProduct={selectProduct}
                                index={index}
                                validate={validate}
                                handleImageChange={handleImageChange}
                                sizeError={sizeError}
                                showCheckbox={product.edited || !!index || products.length > 1}
                            />
                        ))}
                    </div>
                    {enableLink && (
                        <SimpleButton
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.BTN,
                            })}
                            className="underline text-green hover:text-blue"
                            onClick={(): void =>
                                updateProducts([...products, { ...DEFAULT_PRODUCT, id: v4(), number: products.length }])
                            }
                        >
                            + Agregar producto/servicio
                        </SimpleButton>
                    )}
                </div>
                <div className="flex justify-end gap-5.5 mt-4.5">
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        onClick={toggleModal}
                        text="Atrás"
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount`,
                            action: ActionElementType.SAVE,
                            elementType: ElementType.BTN,
                        })}
                        onClick={sendForm}
                        text="Guardar"
                    />
                </div>
            </div>
        </Modal>
    );
};
