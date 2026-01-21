/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import DatabaseSupplierCustomer from '@components/database-supplier-customer';
import { IUserData } from '@components/database-supplier-customer/components';
import { paginationDataFormat } from '@constants/PaginationBack';
import { FIFTEEN, ONE, NA } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { getSuppliers, postStoreSupplier, putUpdateSupplier } from '@redux/suppliers/actions';
import { RootState } from '@redux/rootReducer';
import { createCustomerFile } from '@redux/clients/actions';
import { isCorrectResponse } from '@utils/Response';
import { DEFAULT_FISCAL_RESPONSIBILITIES, DEFAULT_ID_TAXPAYER, componentProps } from '.';

const SupplierDatabase: React.FC = () => {
    const dispatch = useDispatch();

    const {
        suppliers: {
            suppliers: { data: suppliers, ...metaTable },
        },
        session: { user },
    } = useSelector(({ suppliers, session }: RootState) => ({ suppliers, session }));

    const [showModalSave, setShowModalSave] = useState(false);
    const [dataTableDetail, setDataTableDetail] = useState<IGenericRecord[]>([]);
    const [validateSupplier, setValidateSupplier] = useState(false);
    const [dataSuppliers, setDataSuppliers] = useState<IGenericRecord>(paginationDataFormat);
    const handelGetSupplier = async (): Promise<void> => {
        await dispatch(getSuppliers());
        setValidateSupplier(true);
    };

    useEffect(() => {
        handelGetSupplier();
    }, []);

    const saveSupplier = async (data: IUserData | IGenericRecord): Promise<void> => {
        let statusCodeFile;
        if (Array.isArray(data)) {
            const statusCode: any = await dispatch(
                createCustomerFile({ suppliers: data.map(item => ({ ...item, qualification_id: uuid() })) }, false)
            );
            statusCodeFile = statusCode;
        } else {
            if (!data.id) {
                delete data.id;
            }
            const statusCode: any = await (data?.supplier_id
                ? dispatch(putUpdateSupplier(data?.supplier_id, { ...data, qualification_id: uuid() }))
                : dispatch(
                      postStoreSupplier({
                          ...data,
                          buy_responsible: user?.id,
                          qualification_id: uuid(),
                          company_id: user?.company_id,
                          fiscal_responsibilities:
                              data.fiscal_responsibilities.map((item: IGenericRecord) =>
                                  item.id ? item : DEFAULT_FISCAL_RESPONSIBILITIES
                              ) || [],
                          tax_details_code: data?.tax_details_code || 'ZZ',
                          tax_details_name: data?.tax_details_name || 'No aplica',
                          type_taxpayer_name: data?.type_taxpayer_name || 'Persona natural',
                          type_taxpayer_id: data?.type_taxpayer_id || DEFAULT_ID_TAXPAYER,
                      })
                  ));
            statusCodeFile = statusCode;
        }

        if (!!statusCodeFile || isCorrectResponse(statusCodeFile)) {
            setShowModalSave(true);
            handelGetSupplier();
        }
    };

    const formatSuppliers = (data: IGenericRecord[]): IGenericRecord[] => {
        const initialCount = (dataSuppliers?.meta?.current_page - ONE) * FIFTEEN;
        return data?.map((item, index) => ({
            ...item,
            ...item?.person,
            supplier_id: item.id,
            id: item.id,
            number: ONE + index + initialCount,
        }));
    };

    useEffect(() => {
        setDataTableDetail(formatSuppliers(dataSuppliers?.data));
    }, [dataSuppliers]);

    useEffect(() => {
        setDataTableDetail(formatSuppliers(suppliers));
        setDataSuppliers({ data: suppliers, ...metaTable });
    }, [suppliers]);

    const supplierNullToNA = (): IGenericRecord[] => {
        return dataTableDetail.map((item: IGenericRecord) => {
            const { person } = item;
            return {
                ...item,
                email: item?.email || NA,
                address: item?.address || NA,
                city_name: item?.city_name || NA,
                department_name: item?.department_name || NA,
                country_name: item?.country_name || NA,
                person: {
                    ...person,
                    name: person?.name || NA,
                    phone: person?.phone || NA,
                    email: person?.email || NA,
                    address: person?.address || NA,
                    city_name: person?.city_name || NA,
                    department_name: person?.department_name || NA,
                    country_name: person?.country_name || NA,
                    cellphone: person?.cellphone || NA,
                },
            };
        });
    };

    return validateSupplier ? (
        <DatabaseSupplierCustomer
            {...componentProps}
            propsTable={{
                ...componentProps.propsTable,
                dataTable: supplierNullToNA(),
                paginatorBackendData: {
                    ...dataSuppliers,
                    setData: (data: IGenericRecord): void => {
                        setDataSuppliers(data);
                    },
                },
            }}
            saveUser={saveSupplier}
            setShowModalSave={setShowModalSave}
            showModalSave={showModalSave}
        />
    ) : (
        <></>
    );
};

export default SupplierDatabase;
