import React from 'react';
import { InformativeText } from '@components/informative-text';
import { DOCUMENT_INFORMATION } from '@information-texts/ElectronicDocumentsGenerated';

export const TableHeader: React.FC = () => (
    <tr className="bg-green-extraLight">
        <th className="text-left table-head document-table__field--document table-text-blue">Número de documento electrónico</th>
        <th className="table-head document-table__field--standard">
            <InformativeText {...DOCUMENT_INFORMATION.TRANSMISSION_DATE} />
        </th>
        <th className="table-head document-table__field--standard">Cliente/proveedor</th>
        <th className="table-head document-table__field--standard">Unidades vendidas</th>
        <th className="table-head document-table__field--standard">
            <InformativeText {...DOCUMENT_INFORMATION.TOTAL_SALE} />
        </th>
        <th className="table-head document-table__field--standard width--response">Respuesta DIAN</th>
        <th className="table-head document-table__field--standard width--response">Respuesta Cliente</th>
    </tr>
);
