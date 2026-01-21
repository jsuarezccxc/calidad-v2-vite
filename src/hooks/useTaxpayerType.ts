import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { LEGAL_PERSON, NATURAL_PERSON, NATURAL_PERSON_MERCHANT, PERSON_OPTIONS } from '@constants/DynamicRequest';
import { IDS_FOR_NATURAL_PERSON, ID_FOR_ARTIFICIAL_PERSON, ID_FOR_BUSINESSMAN, TaxpayerType } from '@constants/LegalInformation';

/**
 * This interface is for hook custom
 *
 * @typeParam setDocumentType: Dispatch<SetStateAction<string>> - Dispatch state document type
 * @typeParam optionsTaxpayer: IGenericRecord[] - Options taxpayer type
 * @typeParam setTaxpayer: Dispatch<SetStateAction<string>> - Dispatch state taxpayer
 * @typeParam optionsDocumentType: IGenericRecord[] - Options document type
 */
interface IUseTaxpayerType {
    setDocumentType: Dispatch<SetStateAction<string>>;
    optionsTaxpayer: IGenericRecord[];
    setTaxpayer: Dispatch<SetStateAction<string>>;
    optionsDocumentType: IGenericRecord[];
}

/**
 * This interface is selector redux
 * 
 * @typeParam taxpayerTypes: { id: string; name: string }[] - Utils taxpayer
 * @typeParam documentTypes: { id: string; name: string }[] - Utils document types
 */
interface ISelectorOptions {
    taxpayerTypes: { id: string; name: string }[];
    documentTypes: { id: string; name: string }[];
}

/**
 * This function is validate options by document type
 *
 * @param isInformationInvoice: boolean - Optional param
 * @returns IUseTaxpayerType
 */
const useTaxpayerType = (isInformationInvoice = false): IUseTaxpayerType => {
    const { taxpayerTypes, documentTypes }: ISelectorOptions = useSelector(
        ({ warehouses: { getDynamicRequest }, dynamicData: { dynamicData }, utils: { utils } }: RootState) => ({
            taxpayerTypes: getDynamicRequest?.type_tax_payer || dynamicData?.type_tax_payer || utils?.type_tax_payer || [],
            documentTypes: getDynamicRequest?.document_types || [],
        })
    );
    const [taxpayer, setTaxpayer] = useState<string>('');
    const [documentType, setDocumentType] = useState<string>('');
    const [optionsTaxpayer, setOptionsTaxpayer] = useState<IGenericRecord[]>([]);
    const [optionsDocumentType, setOptionsDocumentType] = useState<IGenericRecord[]>([]);

    const filterTaxpayer = (): IGenericRecord[] => {
        if (IDS_FOR_NATURAL_PERSON.includes(documentType))
            return isInformationInvoice
                ? PERSON_OPTIONS.filter(({ value }) => value === NATURAL_PERSON)
                : taxpayerTypes.filter(({ name }) => name === NATURAL_PERSON);
        if (ID_FOR_ARTIFICIAL_PERSON.includes(documentType))
            return isInformationInvoice
                ? PERSON_OPTIONS.filter(({ value }) => value === LEGAL_PERSON)
                : taxpayerTypes.filter(({ name }) => name === LEGAL_PERSON);
        if (ID_FOR_BUSINESSMAN === documentType)
            return isInformationInvoice
                ? PERSON_OPTIONS.filter(({ value }) => value === NATURAL_PERSON_MERCHANT)
                : taxpayerTypes.filter(({ name }) => name === NATURAL_PERSON_MERCHANT);
        return [];
    };

    const filterDocumentType = (): IGenericRecord[] => {
        if (TaxpayerType.NATURAL_PERSON === taxpayer)
            return documentTypes.filter(item => IDS_FOR_NATURAL_PERSON.includes(item.id));
        if (TaxpayerType.LEGAL_PERSON === taxpayer) return documentTypes.filter(item => ID_FOR_ARTIFICIAL_PERSON.includes(item.id));
        if (TaxpayerType.NATURAL_PERSON_MERCHANT === taxpayer)
            return documentTypes.filter(item => ID_FOR_BUSINESSMAN === item.id);
        return [];
    };

    useEffect(() => {
        setOptionsDocumentType([...filterDocumentType()]);
    }, [taxpayer]);

    useEffect(() => {
        setOptionsTaxpayer([...filterTaxpayer()]);
    }, [documentType]);

    return {
        setTaxpayer,
        setDocumentType,
        optionsTaxpayer,
        optionsDocumentType,
    };
};

export default useTaxpayerType;
