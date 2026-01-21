import React, { useContext, useState } from 'react';
import { v4 } from 'uuid';
import { TextFields } from '../components';
import { SimpleButton } from '@components/button';
import { ColorPicker } from '@components/color-picker';
import { TextArea } from '@components/input';
import { Color } from '@constants/Color';
import { ElementOption } from '@models/WebsiteNode';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DiscountModal, IProduct, ProductField, DEFAULT_PRODUCT, FIELDS_BY_OPTION } from '.';
import './BannerEditor.scss';

export const BannerEditor: React.FC = () => {
    const { handleSettingChange, selectedElement, handleStyleChange } = useContext(ElementsContext);
    const { styleKey } = useContext(ScreensContext);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalProducts, setModalProducts] = useState<IProduct[]>([DEFAULT_PRODUCT]);

    const fieldsNumber = selectedElement ? FIELDS_BY_OPTION[selectedElement?.option] : 1;
    const isOptionOne = selectedElement?.option === ElementOption.One;
    const discountedProducts: IProduct[] = selectedElement?.setting?.products ?? [];

    const addDiscount = (): void => {
        setModalProducts([{ ...DEFAULT_PRODUCT, id: v4(), number: modalProducts.length }]);
        toggleModal();
    };

    const toggleModal = (): void => setOpenModal(!openModal);

    const deleteProduct = (id: string): void => {
        handleSettingChange({ name: 'products', value: discountedProducts.filter(product => product.id !== id) });
    };

    const selectProductToEdit = (product: IProduct): void => {
        setModalProducts([{ ...product, edited: true }]);
        toggleModal();
    };

    const updateModalProducts = (products: IProduct[]): void => setModalProducts(products);

    return (
        <>
            <div className="pt-2">
                <TextFields item="title" labelText="Título banner" wrapperClassName="mb-4.5" />
                <TextArea
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-composite-element-banner-title',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    placeholder="..."
                    classesWrapper="w-57"
                    rows={3}
                    value={selectedElement?.setting?.title}
                    onChange={({ target: { value } }): void => handleSettingChange({ name: 'title', value })}
                />
                {selectedElement?.option !== ElementOption.One && (
                    <>
                        <TextFields item="description" labelText="Descripción banner" wrapperClassName="my-4.5" />
                        <TextArea
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: 'editor-composite-element-banner-description',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            placeholder="..."
                            rows={3}
                            value={selectedElement?.setting?.description}
                            onChange={({ target: { value } }): void => handleSettingChange({ name: 'description', value })}
                        />
                    </>
                )}
                <h2 className="composite-editor__title mt-4.5">Producto/servicio</h2>
                <div className="flex flex-col gap-2 mt-2">
                    {discountedProducts?.map((product, index) => (
                        <ProductField
                            key={index}
                            index={index}
                            chooseToEdit={selectProductToEdit}
                            deleteProduct={deleteProduct}
                            product={product}
                        />
                    ))}
                </div>
                {discountedProducts.length < fieldsNumber && (
                    <SimpleButton
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-composite-element-banner-product-discount',
                            action: ActionElementType.ADD,
                            elementType: ElementType.BTN,
                        })}
                        className="composite-editor__link"
                        onClick={addDiscount}
                    >
                        + Agregar descuento
                    </SimpleButton>
                )}
                <TextFields
                    item="productName"
                    labelText={isOptionOne ? 'Nombre producto/servicio' : 'Nombre y valor unitario del producto/servicio'}
                    wrapperClassName="my-4.5"
                />
                {isOptionOne && (
                    <TextFields item="productValue" labelText="Valor unitario producto/servicio" wrapperClassName="mb-2" />
                )}
                {!isOptionOne && (
                    <ColorPicker
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-composite-element-banner-background',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        handleChange={(value): void => handleStyleChange({ item: 'card', name: 'background', value })}
                        labelText="Fondo"
                        value={selectedElement?.[styleKey]?.card?.background ?? Color.Secondary}
                    />
                )}
            </div>
            {openModal && (
                <DiscountModal
                    deleteProduct={deleteProduct}
                    products={modalProducts}
                    toggleModal={toggleModal}
                    updateProducts={updateModalProducts}
                />
            )}
        </>
    );
};
