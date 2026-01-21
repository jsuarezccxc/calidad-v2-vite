import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { calculateVerificationDigit } from '@utils/Number';
import { lengthEqualToZero } from '@utils/Length';
import { createNewJson } from '@utils/Json';
import { VALUE_ZERO } from '@constants/ElectronicInvoice';

/**
 * @typeParam isTypeNit: boolean - Define if document type is NIT
 * @typeParam digitVerification: string - Digit verification of document number 
 * @typeParam setDocumentNumber: React.Dispatch<SetStateAction<string>> - Action to change state document number
 * @typeParam setTypeDocument: React.Dispatch<SetStateAction<string>> - Action to change state document type
 * @typeParam handleChangeSelect: (value:string, index:string) => void - Action to change state type document to object
 * @typeParam handleChangeText:  (value:string, index:string) => void - Action to change state document number to object
 * @typeParam multiDigitVerification: IFatherMultiDigit - Digit verification list
 * @typeParam setMultiDigitVerification:Dispatch<SetStateAction<IFatherMultiDigit>> - Handle change data
 */
interface IUseDigitVerification {
    isTypeNit: boolean;
    digitVerification: string;
    setDocumentNumber: React.Dispatch<SetStateAction<string>>;
    setTypeDocument: React.Dispatch<SetStateAction<string>>;
    handleChangeSelect: (value:string, index:string) => void | boolean;
    handleChangeText:  (value:string, index:string) => void | string;
    multiDigitVerification: IFatherMultiDigit;
    handleInitMulti: () => void;
    setMultiDigitVerification: React.Dispatch<SetStateAction<IFatherMultiDigit>>;
}

/**
 * This interface describes the digit verification list
 * 
 * @typeParam [key: string] : IItemMultiDigit - Body of object
 */
interface IFatherMultiDigit {
    [key: string] : IItemMultiDigit
}

/**
 * This interface describes the item's object
 * 
 * @typeParam isTypeNit: boolean - Define if document type is NIT
 * @typeParam digitVerification: string - Digit verification of document number
 */
interface IItemMultiDigit {
    isTypeNit: boolean;
    digitVerification: string;
    typeDocument?: string;
    numberDocument?: string;
}

/**
 * Custom hook that calculate the digit verification of document number
 * 
 * @param typeDoc string - Optional prop document type
 * @param document string - Optional prop document number
 * @param multiDigit: IFatherMultiDigit - Optional prop digit list
 * @returns IUseDigitVerification
 */
const useDigitVerification = (typeDoc = '', document = '', multiDigit:IFatherMultiDigit = {}):IUseDigitVerification => {
    const [digitVerification, setDigitVerification] = useState<string>(VALUE_ZERO);
    const [documentNumber, setDocumentNumber]       = useState<string>('');
    const [typeDocument, setTypeDocument]           = useState<string>('');
    const [multiDigitVerification, setMultiDigitVerification] = useState<IFatherMultiDigit>(createNewJson(multiDigit));

    const isTypeNit = useMemo(() => {
        return String(typeDocument || typeDoc).toLocaleLowerCase().includes(NIT);
    }, [typeDocument, typeDoc]);

    useEffect(() => {
        handleDigit(documentNumber);
    }, [documentNumber, isTypeNit]);

    useEffect(() => {
        handleDigit(document);
    }, [document]);

    const handleDigit = (document: string):void => {
        if (isTypeNit) {
            const digit =  calculateVerificationDigit(document);
            setDigitVerification(isNaN(digit) ? VALUE_ZERO : String(digit));
            return;
        }
        if (!isTypeNit) setDigitVerification(VALUE_ZERO);
        if (!documentNumber) setDocumentNumber(VALUE_ZERO);
    }

    const handleChangeSelect = (value:string, index:string, initState = false):void | boolean => {
        const isTypeNit = value.toLocaleLowerCase().includes(NIT);
        if (initState) return isTypeNit;
        setMultiDigitVerification({
            ...multiDigitVerification,
            [index]: {
                ...multiDigitVerification[index],
                isTypeNit,
            }
        });
    }

    const handleChangeText = (value:string, index:string, initState = false):void | string => {
        const digit = calculateVerificationDigit(value);
        const digitVerification = isNaN(digit) ? VALUE_ZERO : String(digit);
        if (initState) return digitVerification;
        setMultiDigitVerification({
            ...multiDigitVerification,
            [index]: {
                ...multiDigitVerification[index],
                digitVerification,
            }
        });
    }

    const handleInitMulti = ():void => {
        const arrayKeys = Object.keys(multiDigit);
        if (!lengthEqualToZero(arrayKeys)) {
            let copyMulti = multiDigit;
            arrayKeys.forEach(key => {
                const keysItem = Object.keys(copyMulti[key]);
                if (keysItem.includes('typeDocument') && copyMulti[key].typeDocument) {
                    copyMulti = {
                        ...copyMulti,
                        [key]: {
                            ...copyMulti[key],
                            isTypeNit: handleChangeSelect(copyMulti[key].typeDocument || '', key, true) || false
                        }
                    }
                }
                if (keysItem.includes('numberDocument') && copyMulti[key].numberDocument) {
                    copyMulti = {
                        ...copyMulti,
                        [key]: {
                            ...copyMulti[key],
                            digitVerification: handleChangeText(copyMulti[key].numberDocument || '', key, true) || VALUE_ZERO
                        }
                    }
                }
            });
            setMultiDigitVerification({...copyMulti});
        }
    } 

    return {
        isTypeNit,
        digitVerification,
        setDocumentNumber,
        setTypeDocument,
        handleChangeSelect,
        handleChangeText,
        multiDigitVerification,
        handleInitMulti,
        setMultiDigitVerification
    };
}

export default useDigitVerification;

export const NIT = 'nit';
