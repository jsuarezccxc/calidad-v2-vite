import React, { useContext, useMemo, useState } from 'react';
import { Information } from '@components/information';
import { useDispatch, useSelector } from 'react-redux';
import { addCategoryCatalog } from '@redux/product/actions';
import { RootState } from '@redux/rootReducer';
import { ProductDatabaseContext } from '@pages/product-database/context';
import { IGenericRecord } from '@models/GenericRecord';
import { lowerCase, removeAccents } from '@utils/Text';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { SelectSearchInput } from '@components/input';
import { ModalType } from '@components/modal';
import { Form } from '@components/form';
import { SelectCategory } from './components';
import { optionsSaleChannel } from '.';
import './SaleProduct.scss';

export const SaleProduct: React.FC<IGenericRecord> = ({ data, setData }) => {
    const {
        product: { categoryCatalog },
    } = useSelector((state: RootState) => state);

    const dispatch = useDispatch();

    const [showModalSuccess, setShowModalSuccess] = useState(false);

    const { disabledInputs } = usePermissions();

    const { validate } = useContext(ProductDatabaseContext);

    const handleChangeSaleChannel = ({ value }: { value: string }): void =>
        setData((prev: IGenericRecord) => ({ ...prev, sale_channel: value }));

    const buildCategoryList = (): string[] => {
        const newData: string[] = [];
        categoryCatalog?.forEach((category: IGenericRecord) => {
            newData.push(removeAccents(lowerCase(category.name)));
            if (category.sub_categories.length) {
                category.sub_categories.forEach((subCategory: IGenericRecord) => {
                    newData.push(removeAccents(lowerCase(subCategory.name)));
                    if (subCategory.sub_categories.length) {
                        subCategory.sub_categories.forEach((subSubCategory: IGenericRecord) => {
                            newData.push(removeAccents(lowerCase(subSubCategory.name)));
                        });
                    }
                });
            }
        });
        return newData;
    };

    const totalCategories = useMemo(() => buildCategoryList(), [categoryCatalog]);

    const addCategoryLevel = async (name: string): Promise<void> => {
        const newCategory = await dispatch(addCategoryCatalog({ name, is_product: data.is_product }));
        setData({ ...data, categories: [{ id: newCategory?.id, name: newCategory?.name }] });
        setShowModalSuccess(true);
    };

    const handleChangeCategory = (option: IGenericRecord): void =>
        setData({ ...data, categories: [{ id: option.id, name: option.name }] });

    const optionsSaleChannelRender = optionsSaleChannel.map(item => ({ id: item.key, name: item.value, value: item.key }));

    return (
        <div className="sale-product__container">
            <Information
                title="Venta del producto/servicio"
                description="Seleccione el canal de venta por el que vende el producto/servicio y agregue la categoría para que lo encuentren fácil en su tienda virtual."
            />
            <Form sendWithEnter>
                <div className="flex xs:flex-col gap-4.5">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-sale-channel',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        autoComplete="new-password"
                        name="sale_channel"
                        placeholder="Seleccionar"
                        classesWrapper="w-full lg:w-73 mt-4.5"
                        labelText="*Canal de venta:"
                        valueSelect={data.sale_channel}
                        required={validate && !data.sale_channel}
                        tooltipInfo
                        titleTooltip="Canal de venta:"
                        descTooltip=" medio o la plataforma a través de la cual se comercializa este producto o servicio. "
                        selectTextClass="select-value"
                        optionSelect={optionsSaleChannelRender}
                        onChangeSelect={(_, e): void => handleChangeSaleChannel(e)}
                        disabled={disabledInputs}
                    />
                    <SelectCategory
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-category',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        key="category-add-product"
                        classesWrapper={`xs:w-full lg:w-73 h-fix rounded-sm box-border catalogue__input-categories `}
                        labelText="*Categoría:"
                        options={categoryCatalog}
                        onClickValue={(option: IGenericRecord): void => handleChangeCategory(option)}
                        value={data.categories?.[0]?.name || ''}
                        totalCategories={totalCategories}
                        titleTooltip="Canal de venta:"
                        tooltipInfo
                        disabled={disabledInputs}
                        classesInput="product-management__category-container"
                        descTooltip=" medio o la plataforma a través de la cual se comercializa este producto o servicio. "
                        required={validate && !data.categories.length}
                        addCategory={(e: string): Promise<void> => addCategoryLevel(e)}
                    />
                </div>
            </Form>
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}-success-sale-channel`}
                iconName="checkMulticolor"
                open={showModalSuccess}
                handleClosed={(): void => {
                    setShowModalSuccess(!showModalSuccess);
                }}
                finalAction={(): void => {
                    setShowModalSuccess(!showModalSuccess);
                }}
            />
        </div>
    );
};
