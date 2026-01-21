import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import noImage from '@assets/images/you-image-here.png';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { NA } from '@constants/ElectronicInvoice';
import { FILE_INDEX } from '@constants/File';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { validateImages } from '../..';

export const VariantsTable: React.FC<IGenericRecord> = ({ variants }) => {
    return (
        <Table
            id={generateId({
                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                submodule: `product-services-detail-variants`,
                action: ActionElementType.INFO,
                elementType: ElementType.TBL,
            })}
            customTable
            isHeaderRowsCustom
            headerRowsCustom={<TableHeader />}
            data={[]}
            withScrollTable={false}
            className="product-catalog__table-detail--container"
        >
            {variants.map((variant: IGenericRecord, index: number) => (
                <tr
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: `product-services-detail-variants-${index}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ROW,
                    })}
                    key={`variant-row-${index}-variant`}
                    className={`border-b border-gray ${index % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}
                >
                    <td className="product-catalog__table-detail--row">
                        <Text text={variant.reference} disabled editTable={false} />
                    </td>
                    <td>
                        <Text text={variant.variants} disabled editTable={false} className="text-gray-smoke" />
                    </td>
                    <td>
                        <Text text={variant.sku_internal} disabled editTable={false} className="text-gray-smoke" />
                    </td>
                    <td>
                        <Text text={variant.unit_value} disabled editTable={false} className="text-gray-smoke" />
                    </td>
                    <td>
                        <Text text={variant.mandate_name ?? NA} disabled editTable={false} className="text-gray-smoke" />
                    </td>
                    <td>
                        <figure className="product-catalog__image">
                            <img
                                src={validateImages(variant) ? variant.unique_product_images?.[FILE_INDEX]?.url : noImage}
                                alt="variant-product"
                                className="object-fill w-full h-full rounded-lg"
                            />
                        </figure>
                    </td>
                </tr>
            ))}
        </Table>
    );
};

const TableHeader: React.FC = () => {
    return (
        <tr className="h-10 xs:h-8.75">
            <th className="product-catalog__table-detail--variants">Variantes</th>
            <th className="product-catalog__table-detail--name">*Nombre</th>
            <th className="product-catalog__table-detail--sku">SKU</th>
            <th className="product-catalog__table-detail--value">*Valor unitario de venta</th>
            <th className="product-catalog__table-detail--mandate">Producto de tercero</th>
            <th className="product-catalog__table-detail--image">Imagen</th>
        </tr>
    );
};
