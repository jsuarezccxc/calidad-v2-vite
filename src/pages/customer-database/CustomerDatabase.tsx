/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatabaseSupplierCustomer from '@components/database-supplier-customer';
import { IUserData } from '@components/database-supplier-customer/components';
import { paginationDataFormat } from '@constants/PaginationBack';
import { ONE, NA } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { FIFTEEN } from '@pages/new-payment-plans';
import { DEFAULT_FISCAL_RESPONSIBILITIES } from '@pages/supplier-database';
import { RootState } from '@redux/rootReducer';
import { createClient, createCustomerFile, getClients, updateClient } from '@redux/clients/actions';
import { isCorrectResponse } from '@utils/Response';
import { componentProps } from '.';

const CustomerDatabase: React.FC = () => {
    const dispatch = useDispatch();

    const [showModalSave, setShowModalSave] = useState(false);
    const [dataTableDetail, setDataTableDetail] = useState<IGenericRecord[]>([]);
    const [validateCustomer, setValidateCustomer] = useState(false);
    const [dataClients, setDataClients] = useState<IGenericRecord>(paginationDataFormat);
    const {
        clients: {
            clients: { data: clients, ...metaTable },
        },
    } = useSelector(({ clients }: RootState) => ({ clients }));

    const handelGetClients = async (): Promise<void> => {
        await dispatch(getClients());
        setValidateCustomer(true);
    };

    useEffect(() => {
        handelGetClients();
    }, []);

    useEffect(() => {
        const initialCount = (dataClients?.meta?.current_page - ONE) * FIFTEEN;
        setDataTableDetail(
            dataClients?.data?.map?.((item, index) => ({
                ...item,
                number: ONE + index + initialCount,
            })) || []
        );
    }, [dataClients]);

    useEffect(() => {
        setDataTableDetail(
            clients?.map?.((item, index) => ({
                ...item,
                number: index + ONE,
            }))
        );
        setDataClients({ data: clients, ...metaTable });
    }, [clients]);

    const saveCustomer = async (data: IUserData | IGenericRecord): Promise<void> => {
        let statusCodeFile;
        if (Array.isArray(data)) {
            const statusCode: any = await dispatch(createCustomerFile({ customers: { ...data } }));
            statusCodeFile = { statusCode };
        } else {
            if (data.id) delete data.id;
            const statusCode: any = await (data?.customerId
                ? dispatch(updateClient(data?.client_id, data, data?.customerId))
                : dispatch(
                      createClient({
                          ...data,
                          is_update: false,
                          fiscal_responsibilities:
                              data.fiscal_responsibilities.map((item: IGenericRecord) =>
                                  item.id ? item : DEFAULT_FISCAL_RESPONSIBILITIES
                              ) || [],
                          tax_details_code: data?.tax_details_code || 'ZZ',
                          tax_details_name: data?.tax_details_name || 'No aplica',
                          name_legal_representative: data?.name_legal_representative ?? null,
                      })
                  ));
            statusCodeFile = statusCode;
        }

        if (isCorrectResponse(statusCodeFile.statusCode)) {
            setShowModalSave(true);
            handelGetClients();
        }
    };

    const dataClientsFormatted = (): IGenericRecord[] => {
        return dataTableDetail?.map?.(item => {
            const copy = { ...item };
            Object.keys(copy).forEach(key => {
                if (!copy[key]) copy[key] = NA;
            });
            return {
                ...copy,
                name_legal_representative: copy?.name_legal_representative || NA,
            };
        });
    };

    return validateCustomer ? (
        <DatabaseSupplierCustomer
            {...componentProps}
            propsTable={{
                ...componentProps.propsTable,
                paginatorBackendData: {
                    ...dataClients,
                    setData: (data: IGenericRecord): void => {
                        setDataClients(data);
                    },
                },
                dataTable: dataClientsFormatted(),
            }}
            saveUser={saveCustomer}
            setShowModalSave={setShowModalSave}
            showModalSave={showModalSave}
        />
    ) : (
        <></>
    );
};

export default CustomerDatabase;
