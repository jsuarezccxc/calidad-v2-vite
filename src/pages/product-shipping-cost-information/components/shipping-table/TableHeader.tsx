import React from 'react';
import { Icon } from '@components/icon';
import { TABLES } from '@pages/product-shipping-cost-information';
import { IGenericRecord } from '@models/GenericRecord';
import { ZERO } from '@constants/UtilsConstants';
import { TWO } from '@pages/purchasing-process/components/summary-table';

export const TableHeader: React.FC<IGenericRecord> = ({
    onClickTrash = (): void => {},
    checkedFields = ZERO,
    isNationalTable = false,
}) => (
    <>
        <tr>
            <th className="shipping-cost__check-field custom-field-height" />
            <th
                colSpan={TWO}
                className="items-center justify-center text-center align-middle border-b border-gray field-header--uneditable shipping-cost__field-title shipping-cost__destination-field"
            >
                <p className="text-sm text-center w-141">Destino</p>
            </th>
            <th />
            <th className="flex justify-end custom-field-height ">
                <Icon
                    name="trashBlue"
                    className="mr-0 mt-2 xs:mt-1 xs:w-5.5 xs:h-5.5 h-5.5 w-5.5"
                    hoverIcon={`${checkedFields ? 'trashGreen' : 'trashBlue'}`}
                    onClick={(): void => onClickTrash(isNationalTable ? TABLES.NATIONAL : TABLES.FOREIGN)}
                />
            </th>
        </tr>
        <tr>
            <th />
            <th className="shipping-cost__place-field shipping-cost__field-title w-72 field-header--uneditable">
                *{isNationalTable ? 'Departamento' : 'País'}
            </th>
            <th className="shipping-cost__place-field shipping-cost__field-title w-72 field-header--uneditable">*Ciudad</th>
            <th className="border-t shipping-cost__time-field shipping-cost__field-title field-header--uneditable">
                *Tiempo estimado de entrega (Días)
            </th>
            <th className="border-t shipping-cost__cost-field shipping-cost__field-title field-header--uneditable">
                *Costo de envío
            </th>
        </tr>
    </>
);
