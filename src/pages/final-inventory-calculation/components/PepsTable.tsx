import React from 'react';
import { Table } from '@components/table/Table';
import { IGenericRecord } from '@models/GenericRecord';
import { getEnum } from '@utils/Object';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { PepsFooter } from './CustomFooters';
import { INITIAL_INVENTORY, INITIAL_INVENTORY_TEXT, TYPE_OF_OPERATION, fieldsBodyTablePeps, headerTablePeps } from '.';

export const PepsTable: React.FC<IGenericRecord> = ({ data = {}, date }) => {
    const { total_operation_data, final_inventory_month } = data;

    const combinedData = [...(total_operation_data || [])].map((e: IGenericRecord) => ({
        ...e,
        operation: getEnum(TYPE_OF_OPERATION, e?.operation === INITIAL_INVENTORY_TEXT ? INITIAL_INVENTORY : e?.operation),
    }));
    return (
        <Table
            id={generateId({
                module: ModuleApp.ANALYTICAL_REPORTS,
                submodule: `final-inventory-calculation-peps`,
                action: ActionElementType.INFO,
                elementType: ElementType.TBL,
            })}
            headersTable={headerTablePeps}
            data={combinedData}
            fieldsBody={fieldsBodyTablePeps}
            className="pepsTable__totalWidth"
            isFooterRowsCustom
            footerRowsCustom={<PepsFooter data={final_inventory_month} date={date} />}
            wrapperClassName="pepsTable__withScrollTable"
            isNew
        />
    );
};
