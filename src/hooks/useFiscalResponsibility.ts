import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { useDispatch, useSelector } from 'react-redux';
import { getDynamicRequest } from '@redux/dynamic-data/actions';
import { RootState } from '@redux/rootReducer';
import { changeUltimateItem } from '@utils/ElectronicInvoice';
import {
    CITIES,
    COUNTRIES,
    DEPARTMENTS,
    DOCUMENT_TYPES,
    FISCAL_RESPONSIBILITIES,
    OTHERS,
    PAYMENT_METHODS,
    SIMPLE_REGIMEN,
    TAX_DETAIL,
    TYPE_TAX_PAYER,
    NATURAL_PERSON,
    LEGAL_PERSON,
    NATURAL_PERSON_MERCHANT,
} from '@constants/DynamicRequest';
import { FIVE } from '@constants/ElectronicInvoice';

/**
 * This interface describes that properties the useFiscalResponsibilities hook return
 *
 * @typeParam fiscalResponsibilitiesOptions: IGenericRecord[] - Defines fiscal responsibilities filter according to tax payer selected
 * @typeParam taxpayerSelected: string - Defines tax payer selected
 * @typeParam setTaxpayerSelected: Dispatch<SetStateAction<string>> - Action that dispatch for changing tax payer selected
 * @typeParam disabledAddFiscal: boolean - Disabled add fiscal responsibilities
 */
interface IUseFiscalResponsibilities {
    fiscalResponsibilitiesOptions: IGenericRecord[];
    taxpayerSelected: string;
    setTaxpayerSelected: Dispatch<SetStateAction<string>>;
    disabledAddFiscal: boolean;
}

/**
 * Custom hook that filter fiscal responsibilities according to tax payer selected
 *
 * @param fiscalResponsibilitiesInfo: IGenericRecord[] - Fiscal responsibilities saved in each page
 * @param isDispatch?: boolean - Optional param for dispatch dynamic data
 * @returns IUseFiscalResponsibilities
 */
const useFiscalResponsibilities = (
    fiscalResponsibilitiesInfo: IGenericRecord[],
    isDispatch = true
): IUseFiscalResponsibilities => {
    const dispatch = useDispatch();

    const { dynamicData } = useSelector((state: RootState) => state.dynamicData);

    const [fiscalResponsibilitiesOptions, setFiscalResponsibilitiesOptions] = useState<IGenericRecord[]>([]);
    const [taxpayerSelected, setTaxpayerSelected] = useState<string>('');

    useEffect(() => {
        if (isDispatch) {
            dispatch(
                getDynamicRequest([
                    FISCAL_RESPONSIBILITIES,
                    DOCUMENT_TYPES,
                    COUNTRIES,
                    DEPARTMENTS,
                    CITIES,
                    TYPE_TAX_PAYER,
                    PAYMENT_METHODS,
                    TAX_DETAIL,
                ])
            );
        }
    }, []);

    const disabledAddFiscal = useMemo(
        () =>
            !taxpayerSelected ||
            taxpayerSelected === NATURAL_PERSON ||
            (taxpayerSelected === LEGAL_PERSON &&
                fiscalResponsibilitiesOptions.every((item: IGenericRecord) => item.name !== OTHERS)) ||
            fiscalResponsibilitiesOptions.every((item: IGenericRecord) => item.name !== SIMPLE_REGIMEN),
        [taxpayerSelected, fiscalResponsibilitiesOptions]
    );

    const fiscalResponsibilitiesAccordingTaxpayer = changeUltimateItem(
        taxpayerSelected === NATURAL_PERSON
            ? dynamicData?.fiscal_responsibilities?.filter(
                  (item: IGenericRecord) => item.name === SIMPLE_REGIMEN || item.name === OTHERS
              )
            : dynamicData?.fiscal_responsibilities?.filter(({ id }: IGenericRecord) =>
                  taxpayerSelected === NATURAL_PERSON_MERCHANT ? id !== FIVE : id
              ) || []
    );

    useEffect(() => {
        if (dynamicData && dynamicData?.fiscal_responsibilities) {
            setFiscalResponsibilitiesOptions(changeUltimateItem(dynamicData?.fiscal_responsibilities));
        }
    }, [dynamicData]);

    useEffect(() => {
        setFiscalResponsibilitiesOptions(fiscalResponsibilitiesAccordingTaxpayer);
    }, [taxpayerSelected]);

    useEffect(() => {
        if (fiscalResponsibilitiesInfo.length && Boolean(taxpayerSelected)) {
            setFiscalResponsibilitiesOptions(
                fiscalResponsibilitiesAccordingTaxpayer?.filter(
                    (item: IGenericRecord) =>
                        !fiscalResponsibilitiesInfo.some(
                            (info: IGenericRecord) => (info.name || info.value || info.fiscal_responsibility_name) === item.name
                        )
                )
            );
        }
    }, [fiscalResponsibilitiesInfo]);

    return {
        fiscalResponsibilitiesOptions,
        taxpayerSelected,
        setTaxpayerSelected,
        disabledAddFiscal,
    };
};

export default useFiscalResponsibilities;
