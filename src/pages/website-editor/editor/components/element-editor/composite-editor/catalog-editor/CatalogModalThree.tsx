import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import defaultProduct from '@assets/images/catalog/default-catalog.svg';
import { Button, ButtonType } from '@components/button';
import { TextInput } from '@components/input';
import { ModalCustom } from '@components/modal-custom';
import { Icon } from '@components/icon';
import { TitleButtons } from '@constants/Buttons';
import { ZERO } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { formatMoney } from '@utils/Decimals';
import { getWordWrap } from '@utils/Text';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { MAX__PRODUCTS } from '.';

export const CatalogModalThree: React.FC<{
    toggleModal: () => void;
    handleSettingChange: (selectProducts: string[]) => void;
    dataSelectProducts: string[];
}> = ({ toggleModal, handleSettingChange, dataSelectProducts = [] }) => {
    const {
        catalogWebsite: { data: catalogWebsite },
    } = useSelector((state: RootState) => state.productCatalog);

    const [productSearch, setProductSearch] = useState('');
    const [selectProducts, setSelectProducts] = useState<string[]>(dataSelectProducts);

    const getProducts = (): IGenericRecord[] => {
        if (productSearch) return catalogWebsite.filter(item => item?.name.toLowerCase().includes(productSearch.toLowerCase()));
        return catalogWebsite;
    };

    const products = catalogWebsite
        .filter(item => selectProducts.includes(item?.id))
        .flatMap(item => item.name)
        .join(', ');

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-editor-composite-element-catalog`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            classesModal="h-140  w-164"
            classAdditional="modal-catalog"
            show
            showModal={toggleModal}
        >
            <h2 className="mb-2 text-xl text-center font-allerbold text-blue">
                Productos que se visualizarán en el banner del catálogo
            </h2>
            <p className="text-center text-gray-dark mb-7">Seleccione 3 productos que quiere destacar en el banner</p>
            <div className="w-57.5 relative">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-catalog-search`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    onChange={({ target: { value } }): void => setProductSearch(value)}
                    labelText="Buscador:"
                    placeholder="Producto"
                    value={productSearch}
                    name="product"
                    classesWrapper="w-57.5"
                />
                <Icon name="searchBlue" className="absolute right-1 top-7 w-5.5 h-5.5 p-1" />
            </div>

            <div className="flex gap-4.5 flex-wrap mt-4.5 overflow-y-auto rounded bg-green-scrollbar max-h-60 overflow-x-hidden">
                {getProducts().map(item => {
                    const valueDiscount = item.discount_website
                        ? item.value_with_taxes - (item.value_with_taxes * item.discount_website) / 100
                        : 0;
                    const isProductsIncluded = selectProducts.includes(item?.id || '');
                    return (
                        <div
                            className={`flex flex-col w-28 ${
                                selectProducts.length === MAX__PRODUCTS && !isProductsIncluded ? ' opacity-40' : ''
                            }`}
                            key={item.id}
                        >
                            <div
                                className="relative cursor-pointer h-28"
                                onClick={(): void => {
                                    (selectProducts.length < MAX__PRODUCTS || isProductsIncluded) &&
                                        setSelectProducts(
                                            isProductsIncluded
                                                ? selectProducts.filter(product => product !== item.id)
                                                : [...selectProducts, item.id]
                                        );
                                }}
                            >
                                <Icon
                                    name={isProductsIncluded ? 'starGreenBg' : 'starBlueBg'}
                                    className="absolute top-0 right-0 w-4 h-4"
                                />
                                <img
                                    alt="product"
                                    className="h-full rounded-lg"
                                    src={
                                        item?.unique_product_images?.length
                                            ? item?.unique_product_images[ZERO]?.url
                                            : defaultProduct
                                    }
                                />
                            </div>
                            <p className={`text-center text-xtiny text-blue font-allerbold ${getWordWrap(item.name)}`}>
                                {item.name}
                            </p>
                            <div className="flex justify-center">
                                <span className="text-blue text-xtiny">
                                    {formatMoney(valueDiscount ? valueDiscount : item?.value_with_taxes, ZERO)}
                                </span>
                                {!!valueDiscount && (
                                    <span className="text-xntiny text-purple flex items-center ml-0.5 line-through">
                                        {formatMoney(item.value_with_taxes, ZERO)}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-center mt-7 text-gray-dark">
                Usted ha seleccionado {selectProducts.length} productos: <span className="italic"> {products}</span>
            </p>
            <div className="flex justify-center mt-7 gap-7">
                <Button
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-catalog`,
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    onClick={toggleModal}
                    text={TitleButtons.CANCEL}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-catalog`,
                        action: ActionElementType.SAVE,
                        elementType: ElementType.BTN,
                    })}
                    text="Guardar"
                    type={ButtonType.Submit}
                    onClick={(): void => {
                        handleSettingChange(selectProducts);
                        toggleModal();
                    }}
                />
            </div>
        </ModalCustom>
    );
};
