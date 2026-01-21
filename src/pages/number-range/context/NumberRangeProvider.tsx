import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { INVOICE_TYPE } from '@constants/InvoiceType';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import { getSynchronizeAction, updateTypePrefix } from '@redux/parameterization-customization-electronic-invoice/actions';
import { DocumentsTypePrefix } from '..';
import { NumberRangeContext } from '.';

export const NumberRangeProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch();
    const {
        company: { information },
        parameterizationInvoice: { storePrefix },
    } = useSelector(({ company, electronicInvoice, parameterizationInvoice }: RootState) => ({
        company,
        electronicInvoice,
        parameterizationInvoice,
    }));

    const [electronicInvoiceRanges, setElectronicInvoiceRanges] = useState<IGenericRecord[]>([]);
    const [unssignedRange, setUnssignedRange] = useState<IGenericRecord[]>([]);
    const [supportDocumentRange, setSupportDocumentRange] = useState<IGenericRecord[]>([]);
    const [syncModal, setSyncModal] = useState<boolean>(false);
    const [synchronizeModal, setSynchronizeModalModal] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getInformationCompany());
    }, []);

    useEffect(() => {
        if (information) getSynchronizeNumberRanges(false);
    }, [information]);

    useEffect(() => {
        setUnssignedRange(storePrefix.filter((document: IGenericRecord) => document.type === INVOICE_TYPE.UNASSIGNED));
        setElectronicInvoiceRanges(
            storePrefix.filter((document: IGenericRecord) => document.contingency || document.type === INVOICE_TYPE.INVOICE)
        );
        setSupportDocumentRange(
            storePrefix.filter(
                (document: IGenericRecord) => !document.contingency && document.type === INVOICE_TYPE.SUPPORTING_DOCUMENT
            )
        );
    }, [storePrefix]);

    const getSynchronizeNumberRanges = (showModal = true): void => {
        if (showModal && unssignedRange.some(prefix => prefix.type === INVOICE_TYPE.UNASSIGNED)) {
            handleModalSync(true);
        } else {
            dispatch(getSynchronizeAction(information?.document_number ?? ''));
            handleModalSynchronize(showModal);
        }
    };

    const saveTypePrefix = async (): Promise<boolean> => {
        const updateTypes = unssignedRange.map(prefix => ({
            type: prefix.type === DocumentsTypePrefix.RECEIPT_INVOICE ? DocumentsTypePrefix.INVOICE : prefix.type,
            resolution_id: prefix.id,
            contingency: prefix.type === DocumentsTypePrefix.RECEIPT_INVOICE,
        }));

        const status = await dispatch(updateTypePrefix(updateTypes));
        return SUCCESS_RESPONSE.includes(Number(status));
    };

    const handleSetTypeUnssignedPrefix = (option: IGenericRecord, row: IGenericRecord): void => {
        setUnssignedRange(
            unssignedRange.map(prefix => ({
                ...prefix,
                ...(prefix.id === row.id && { type: option.key }),
            }))
        );
    };

    const handleModalSync = (state: boolean, isConfirm = false): void => {
        if (!state && !isConfirm) {
            setUnssignedRange(storePrefix.filter((document: IGenericRecord) => document.type === INVOICE_TYPE.UNASSIGNED));
        }
        setSyncModal(state);
    };
    const handleModalSynchronize = (state: boolean): void => {
        setSynchronizeModalModal(state);
    };

    return (
        <NumberRangeContext.Provider
            value={{
                storePrefix,
                electronicInvoiceRanges,
                supportDocumentRange,
                unssignedRange,
                getSynchronizeNumberRanges,
                handleModalSync,
                handleModalSynchronize,
                syncModal,
                synchronizeModal,
                handleSetTypeUnssignedPrefix,
                saveTypePrefix,
            }}
        >
            {children}
        </NumberRangeContext.Provider>
    );
};
