import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import noImage from '@assets/images/you-image-here.png';
import { SimpleButton } from '@components/button';
import { NA, ONE, Table } from '@components/table';
import { NumberFormatInput, Text } from '@components/table-input';
import { ZERO } from '@constants/UtilsConstants';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { TWO } from '@pages/virtual-store-sales-receipts';
import { FIFTEEN } from '@pages/new-payment-plans';
import { getUniqueProductDetail } from '@redux/product-catalog/actions';
import { taxInformationForTables } from '@utils/ElectronicInvoice';
import { lengthGreaterThanZero } from '@utils/Length';
import { cutString } from '@utils/Text';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { MAXIMUM_CHARACTERS, ONE_POSITION } from '.';
import { validateImages } from '..';

export const TableCatalog: React.FC<IGenericRecord> = ({
    listColumns,
    widthTable,
    data,
    toggleShowDescription,
    deleteList,
    handleDelete,
    paginatorDataBack,
    setData,
    isLoadingTable,
}) => {
    const { disabledInputs } = usePermissions();
    const { image, classification, unitMeasure, sku, unitValue, taxes, saleChannel, category } = listColumns;

    const dispatch = useDispatch();

    const sendDetailProduct = async (productId: string): Promise<void> => {
        await dispatch(getUniqueProductDetail(productId));
        toggleShowDescription();
    };

    const indexToBg = (index: number): string => (index % TWO === ZERO ? 'bg-white' : 'bg-gray-light');

    const initialCount = useMemo(() => (paginatorDataBack?.meta?.current_page - ONE) * FIFTEEN, [paginatorDataBack]);

    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: `${ModuleApp.TABLE}-product-services-catalog`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headerRowsCustom={<TableHeader listColumns={listColumns} />}
                isHeaderRowsCustom
                customTable
                data={[]}
                styleInline={{ width: widthTable }}
                paginatorBackendData={{ data: data, ...paginatorDataBack, setData }}
                isLoading={isLoadingTable}
            >
                {data?.map((product: IGenericRecord, index: number) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `${ModuleApp.TABLE}-product-services-catalog-${index}-${product.id}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        key={`row-${index}-${product.id}`}
                    >
                        <td className="product-catalog__table-check product-catalog__table-row">
                            <div
                                className={`w-4.5 h-4.5 border  border-gray rounded cursor-pointer mr-1.8 ${
                                    deleteList?.includes(product.id) ? 'bg-blue' : ''
                                }`}
                                onClick={(): void => !disabledInputs && handleDelete(product.id)}
                            />
                        </td>
                        <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                            <Text text={String(initialCount + (index + ONE_POSITION))} editTable={false} className="text-gray" />
                        </td>
                        {image && (
                            <td className={`product-catalog__table-row py-1 ${indexToBg(index)}`}>
                                <div className="product-catalog__image">
                                    <img
                                        src={validateImages(product) ? product.unique_product_images.url : noImage}
                                        alt="image"
                                        className="object-fill w-full h-full rounded-lg"
                                    />
                                </div>
                            </td>
                        )}
                        <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                            <SimpleButton
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: `${ModuleApp.TABLE}-product-services-catalog-${index}-${product.id}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.BTN,
                                })}
                                className="text-sm underline cursor-pointer text-purple font-aller"
                                onClick={(): Promise<void> => sendDetailProduct(product.id)}
                            >
                                {product.name}
                            </SimpleButton>
                        </td>
                        {classification && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                <Text text={product.classification} editTable={false} className="text-gray" />
                            </td>
                        )}
                        {unitMeasure && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                <Text text={product.unit_measurement_name} editTable={false} className="text-gray" />
                            </td>
                        )}
                        {sku && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                <Text text={product.sku_internal} editTable={false} className="text-gray" />
                            </td>
                        )}
                        {unitValue && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                <NumberFormatInput
                                    value={product.unit_value}
                                    allowNegative={false}
                                    containerClass="field-money"
                                    inputClass="field-money__input text-gray"
                                    disabled
                                />
                            </td>
                        )}
                        {taxes && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                {lengthGreaterThanZero(product.taxes) ? (
                                    product.taxes.map((tax: ITaxesProductsStock, subIndex: number) => (
                                        <p key={`row-${index}-${subIndex}`} className="text-sm xs:text-tiny text-gray">
                                            {tax.tax_name || NA}: &nbsp;
                                            {cutString(
                                                taxInformationForTables(tax, { quantity: 1, sale_value: product.unit_value }),
                                                MAXIMUM_CHARACTERS
                                            )}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm xs:text-tiny text-gray">N/A</p>
                                )}
                            </td>
                        )}
                        {saleChannel && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                <Text text={product.sale_channel_name} editTable={false} className="text-gray" />
                            </td>
                        )}
                        {category && (
                            <td className={`product-catalog__table-row ${indexToBg(index)}`}>
                                <Text text={product.category_name} editTable={false} className="text-gray" />
                            </td>
                        )}
                    </tr>
                ))}
            </Table>
        </>
    );
};

const TableHeader: React.FC<IGenericRecord> = ({ listColumns }) => {
    const { image, classification, unitMeasure, sku, unitValue, taxes, saleChannel, category } = listColumns;
    return (
        <tr className="md:h-10 xs:h-8.75">
            <th className="w-10" />
            <th className="product-catalog__table-item">N°</th>
            {image && <th className="product-catalog__table-image">Imagen</th>}
            <th className="product-catalog__table-name">Producto/servicio</th>
            {classification && <th className="product-catalog__table-classification">Clasificación</th>}
            {unitMeasure && <th className="product-catalog__table-unit-measure">Unidad de medida</th>}
            {sku && <th className="product-catalog__table-sku">SKU</th>}
            {unitValue && <th className="product-catalog__table-unit-value">Valor unitario</th>}
            {taxes && <th className="product-catalog__table-taxes">Impuestos</th>}
            {saleChannel && <th className="product-catalog__table-sale-channel">Canal de venta</th>}
            {category && <th className="product-catalog__table-category">Categoría</th>}
        </tr>
    );
};
