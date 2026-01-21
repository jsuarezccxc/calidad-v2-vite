import React from 'react';
import { Table } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';

export const SUPPLIER_DATABASE: IGenericRecord = {
    TOOLTIP_TYPE_TAXPAYER: (
        <div className=" text-blue">
            <h3 className="text-sm font-allerbold">Tipo de contribuyente:</h3>
            <div className="flex">
                <p className="ml-2 mr-1">• &nbsp;</p>
                <p className="text-sm w-59">
                    <span className="font-allerbold">Persona natural:</span> Cuando el cliente actúa a título personal.
                </p>
            </div>
            <br />
            <div className="flex">
                <p className="ml-2 mr-1">• &nbsp;</p>
                <p className="text-sm w-59">
                    <span className="font-allerbold">Persona jurídica:</span> Cuando el cliente actúa en representación de una
                    sociedad conformada por una o más personas.
                </p>
            </div>
        </div>
    ),
    DELETE_USER: (data: IGenericRecord) => (
        <p className="text-center text-gray-dark xs:px-2">
            El {data?.title} <span className="font-allerbold">{data?.name} </span> no se ha eliminado porque se encuentra en un
            proceso pendiente de transmisión en &nbsp;
            <span className="font-allerbold">{data?.invoice}. &nbsp;</span>
            Una vez se finalice este proceso puede eliminar el cliente.
        </p>
    ),
    DELETE_USERS: (data: IGenericRecord) => (
        <div className="flex flex-col w-full h-full">
            <p className="mb-2 text-center text-gray-dark">
                Los {data?.title} no se han eliminado porque se encuentran en un proceso pendiente de transmisión. Una vez se
                finalice este proceso pueden eliminar los {data?.title}.
            </p>
            <Table
                headersTable={data?.header}
                fieldsBody={data?.body}
                data={data?.dataDelete}
                editable={false}
                isNew
                wrapperClassName="supplier-database__table-delete w-full"
            />
        </div>
    ),
};
