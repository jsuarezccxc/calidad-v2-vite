import React from 'react';
import usePopper from '@hooks/usePopper';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';

export const TableHeader: React.FC = () => {
    const { anchorEl: anchorVariant, mouseProps: mouseVariant } = usePopper();
    const { anchorEl: anchorSku, mouseProps: mouseSku } = usePopper();
    return (
        <tr className="leading-none ">
            <th className="w-10"></th>
            <th className="add-price-code__table-variant">
                <div className="flex items-center gap-1">
                    <div {...mouseVariant}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    <span className="text-sm">Variantes</span>
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorVariant}
                        description=" diferentes opciones disponibles para un mismo producto, como tallas, colores o especificaciones. "
                        title="Variantes:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="add-price-code__table-name">*Nombre</th>
            <th className="add-price-code__table-sku">
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        <div {...mouseSku}>
                            <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                        </div>
                        <span className="text-sm">SKU</span>
                        <Tooltip
                            iconName="infoBlue"
                            anchorEl={anchorSku}
                            description="es el código único de identificación del producto."
                            title="SKU Producto/servicio:"
                            placement="bottom-start"
                        />
                    </div>
                </div>
            </th>
            <th className="add-price-code__table-value">*Valor unitario de venta</th>
        </tr>
    );
};
