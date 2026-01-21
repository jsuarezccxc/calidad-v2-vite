import * as React from 'react';
import { ITableFieldType } from '@constants/TableFieldType';
import { IBodyTable } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import './Table.scss';

export const getBodyAdmin = (admin: boolean, onClick: (e: IGenericRecord) => void): IBodyTable[] => {
    const element = admin ? 'other' : 'checkbox';
    const tableBodyAdmin: IBodyTable[] = [
        {
            type: ITableFieldType.CHECKBOX,
            field: 'checkbox',
            editableField: false,
            wrapperClassName: 'p-0 pl-0.375 user-table__td-checkbox',
            className: 'text-gray',
        },
        {
            type: ITableFieldType.TEXT,
            field: 'number',
            editableField: false,
            wrapperClassName: 'p-0 pl-0.375',
            className: 'text-gray',
        },
        {
            type: ITableFieldType.TEXT_ACTION,
            field: 'name',
            editableField: false,
            wrapperClassName: 'xs:h-8.2 lg:h-10',
            className: 'text-purple underline cursor-pointer hover:text-blue',
            onClick,
        },
        {
            type: ITableFieldType.TEXT,
            field: 'email',
            editableField: false,
            className: 'xs:px-1 xs:mx-2 text-gray',
            emailWrap: true,
        },
        {
            type: ITableFieldType.TEXT,
            field: 'permits',
            editableField: false,
            className: 'text-gray',
        },
    ];

    return tableBodyAdmin.filter(item => item.field !== element);
};

export const TableHeader: React.FC<IGenericRecord> = ({ isSuperAdmin = false }) => (
    <tr className="lg:h-10 h-8.2 xs:w-226">
        {isSuperAdmin && <th className="w-7.5 ml-0.5" />}
        <th className="class-header-table class-header-table__number field-header--uneditable">N°</th>
        <th className="class-header-table field-header--uneditable class-header-table__user">Nombre del usuario</th>
        <th className="class-header-table field-header--uneditable class-header-table__email">Correo electrónico</th>
        <th
            className={`class-header-table field-header--uneditable class-header-table__permissions${
                isSuperAdmin ? '-admin' : ''
            }`}
        >
            Permisos
        </th>
    </tr>
);
