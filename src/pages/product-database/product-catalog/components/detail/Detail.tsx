import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUpdateProduct } from '@redux/product-catalog/actions';
import { EDIT_VARIANT_SELECTED } from '@pages/product-database/context';
import { BreadCrumb } from '@components/bread-crumb';
import { PRODUCT_CATALOG } from '@information-texts/ProductDatabase';
import { IGenericRecord } from '@models/GenericRecord';
import { Information } from '@components/information';
import { PageTitle } from '@components/page-title';
import { SimpleButton } from '@components/button';
import { Icon } from '@components/icon';
import { TextInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import LocalStorage from '@utils/LocalStorage';
import { formatNumber } from '@utils/Number';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { VariantsTable } from './components';
import { routesDetail } from '.';

export const Detail: React.FC<IGenericRecord> = ({ toggleShowDescription, product, toggleShowCatalog, setShowCatalog }) => {
    const dispatch = useDispatch();
    const taxes = product.taxes;

    const { disabledInputs } = usePermissions();

    const editItem = (id: string): void => {
        dispatch(getUpdateProduct(id));
        LocalStorage.set(EDIT_VARIANT_SELECTED, id);
        toggleShowCatalog();
    };

    useEffect(() => {
        if (product?.editCarrousel) {
            dispatch(getUpdateProduct(product.id));
            LocalStorage.set(EDIT_VARIANT_SELECTED, product.id);
            setShowCatalog(false);
        }
    }, []);

    return (
        <div className="pl-2">
            <PageTitle title="Ficha técnica" classTitle="text-base" />
            <BreadCrumb routes={routesDetail(toggleShowDescription)} />
            <Information
                title={PRODUCT_CATALOG.DETAIL_TITLE}
                color="blue"
                classNameTitle="product-management__title"
                description={PRODUCT_CATALOG.DETAIL_DESCRIPTION}
            />
            <SimpleButton
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: `product-services-detail-${product.id}`,
                    action: ActionElementType.EDIT,
                    elementType: ElementType.BTN,
                })}
                className="product-catalog__detail-edit"
                {...(!disabledInputs && { onClick: (): void => editItem(product.id) })}
                disabled={disabledInputs}
            >
                <Icon name="pencilMulticolor" classIcon="w-7.5 inline" /> Editar información del producto/servicio
            </SimpleButton>
            <div className="product-catalog__detail-container">
                <Information title="Información básica" classNameTitle="product-catalog__detail-subtitle" />
                <div className="flex flex-wrap justify-between xs:flex-col">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `product-services-detail-${product.id}-name`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Nombre producto/servicio"
                        classesLabel="product-catalog__input-label"
                        classesWrapperInput="product-catalog__input-wrapper"
                        classesInput="product-catalog__input-text"
                        classesWrapper="product-catalog__input-name"
                        value={product.name}
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `product-services-detail-${product.id}-category`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Categoria"
                        classesLabel="product-catalog__input-label"
                        classesWrapperInput="product-catalog__input-wrapper"
                        classesInput="product-catalog__input-text"
                        classesWrapper="product-catalog__input-category"
                        value={product.category_name}
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `product-services-detail-${product.id}-unit-measure`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Unidad de medida"
                        classesLabel="product-catalog__input-label"
                        classesWrapperInput="product-catalog__input-wrapper"
                        classesInput="product-catalog__input-text"
                        classesWrapper="product-catalog__input-unit-measure"
                        value={product.unit_measurement_name}
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `product-services-detail-${product.id}-sale-channel`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Canal de venta"
                        classesLabel="product-catalog__input-label"
                        classesWrapperInput="product-catalog__input-wrapper"
                        classesInput="product-catalog__input-text"
                        classesWrapper="product-catalog__input-sale-channel"
                        value={product.sale_channel_name}
                        disabled
                    />
                </div>
                <div className="product-catalog__separator" />
                <Information title="Características del producto/servicio:" classNameTitle="product-catalog__title-table" />
                <VariantsTable variants={product.variants} />
                <div className="product-catalog__separator" />
                <Information
                    title="Información para generar y transmitir documentos electrónicos"
                    classNameTitle="product-catalog__title-tax"
                />
                {taxes?.length ? (
                    <div className="flex gap-16 xs:flex-col">
                        {taxes.map((tax: IGenericRecord, index: number) => (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: `product-services-detail-${product.id}-tax-${index}-${tax.id}`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                key={`tax-${index}-${tax.id}`}
                                labelText={`Impuesto calculado ${tax.tax_name}`}
                                classesLabel="product-catalog__input-label"
                                classesWrapperInput="product-catalog__input-wrapper"
                                classesInput="product-catalog__input-text"
                                classesWrapper="product-catalog__sale-channel"
                                placeholder={formatNumber(tax.tax_value)}
                                disabled
                            />
                        ))}
                    </div>
                ) : (
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `product-services-detail-${product.id}-tax`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Impuesto"
                        classesLabel="product-catalog__input-label"
                        classesWrapperInput="product-catalog__input-wrapper"
                        classesInput="product-catalog__input-text"
                        classesWrapper="product-catalog__no-taxes"
                        placeholder="N/A"
                        disabled
                    />
                )}
                <div className="product-catalog__separator" />
                <Information title="Descripción del producto/servicio" classNameTitle="product-catalog__title-tax" />
                <TextInput
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: `product-services-detail-${product.id}-description`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="Descripción"
                    classesLabel="product-catalog__input-label"
                    classesWrapperInput="product-catalog__input-wrapper"
                    classesInput="product-catalog__input-text"
                    classesWrapper="product-catalog__sale-channel"
                    placeholder="Texto"
                    disabled
                    value={product.description}
                />
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                titleButtonLeft="Atrás"
                onClickButtonLeft={toggleShowDescription}
            />
        </div>
    );
};
