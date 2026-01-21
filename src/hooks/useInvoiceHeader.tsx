import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IInformationDocument } from '@models/ElectronicInvoice';
import { DOCUMENT_TYPE } from '@information-texts/InvoiceHeader';
import { buildOptionsCustomSearch } from '@utils/Company';
import { getDateAnyFormat, getDateTablePicker, getDaysFromTwoDates } from '@utils/Date';
import { IInputProps } from '@components/Invoice-header';
import { DEFAULT_LANGUAGES, DEFAULT_LANG } from '@constants/ElectronicInvoice';
import { ONE } from '@constants/ElectronicInvoice';

/**
 * This interface is invoice header
 *
 * @typeParam leftColumn: () => JSX.Element - Column left information
 * @typeParam centerColumn: (param: IInformationDocument) => JSX.Element - Column center information
 * @typeParam cardFile: ICardFileProps - Card file
 * @typeParam propsInput: IInputProps - Props for input select
 * @typeParam setLang: Dispatch<SetStateAction<string>> - Dispatch state lang
 */
interface IUseInvoiceHeader {
    leftColumn: () => JSX.Element;
    centerColumn: (param: IInformationDocument) => JSX.Element;
    cardFile: {
        updateFile: (logo: IGenericRecord) => void;
        file: IGenericRecord;
    };
    propsInput: IInputProps;
    setLang: Dispatch<SetStateAction<string>>;
}

/**
 * This const is string month
 */
const MONTH = 'month';

/**
 * This hook return information for invoice header component
 *
 * @returns IUseInvoiceHeader
 */
const useInvoiceHeader = (): IUseInvoiceHeader => {
    const { fiscal_responsibilities = [], ciius, ...information } = useSelector(({ company: { information } }: RootState) => ({
        ...information,
    }));
    const languages = useSelector(
        ({ utils, correctionBusinessDocument }: RootState) =>
            utils.utils?.languages || correctionBusinessDocument.utilsData?.languages || null
    );

    const { initial_validity, prefix: prefixName, ...prefix } = useSelector(
        (state: RootState) => state.electronicInvoice.invoicePrefix || { initial_validity: '' }
    );

    const [file, setFile] = useState<{ file: IGenericRecord }>({ file: {} });
    const [lang, setLang] = useState<string>(DEFAULT_LANG);

    const { O13, O15, O23, O47, r99PN } = useMemo(
        () => ({
            O13: fiscal_responsibilities.find(({ code }) => code.includes('O-13')),
            O15: fiscal_responsibilities.find(({ code }) => code.includes('O-15')),
            O23: fiscal_responsibilities.find(({ code }) => code.includes('O-23')),
            O47: fiscal_responsibilities.find(({ code }) => code.includes('O-47')),
            r99PN: fiscal_responsibilities.find(({ code }) => code.includes('R-99-PN')),
        }),
        [fiscal_responsibilities]
    );

    const taxCode = (): string => {
        switch (information.params_from_utils?.code) {
            case '01':
            case 'ZA':
                return 'Contribuyente responsables de IVA';
            case '04':
                return 'Contribuyente responsables de INC';
            case 'ZZ':
                return 'Contribuyente no responsable de IVA e INC';
        }
        return '';
    };

    const leftColumn = (): JSX.Element => (
        <p>
            {information.name}
            <br />
            {information.document_type_name} {information.document_number}
            <br />
            {information.address}
            <br />
            {information.city_name}, {information.country_name}
            <br /> {information.phone}
            <br />
            {information.domain}
        </p>
    );

    const centerColumn = ({ documentType, isElectronicDocument = true }: IInformationDocument): JSX.Element => {
        return (
            <>
                {isElectronicDocument && (
                    <>
                        <p>
                            {!O13
                                ? 'No somos grandes contribuyentes'
                                : `Grandes contribuyentes Res. ${O13.number_resolution} del ${getDateAnyFormat(O13.date)}`}
                        </p>
                        <p>
                            {!O15
                                ? 'No somos autorretenedores'
                                : `Autorretenedores Res. ${O15.number_resolution} del ${getDateAnyFormat(O15.date)}`}
                        </p>
                        <p>
                            {!O23
                                ? 'No somos agentes de retención de IVA'
                                : `Somos agentes de retención de IVA Res. ${O23.number_resolution} del ${getDateAnyFormat(
                                      O23.date
                                  )}`}
                        </p>
                        {O47 && <p>Régimen simple de tributación</p>}
                        {r99PN && <p>R-99-PN No aplica - Otros</p>}
                        {<p>{taxCode()}</p>}
                        {ciius && <p>Actividad económica {ciius.map(({ code }) => code).join(';')}</p>}
                    </>
                )}
                <p>{DOCUMENT_TYPE[documentType]}</p>
                {!!Object.keys(prefix).length && (
                    <p>
                        Autorización resolución {prefix.resolution_number} del {getDateTablePicker(initial_validity)}&nbsp;
                        vigencia de {getDaysFromTwoDates(initial_validity, prefix.final_validity, MONTH) - ONE} meses Autorización
                        del &nbsp;
                        {prefixName}
                        {prefix.initial_authorization_range} al &nbsp;
                        {prefixName}
                        {prefix.final_authorization_range}
                    </p>
                )}
            </>
        );
    };

    const updateFile = (file: IGenericRecord): void => setFile({ file });

    const handleLang = (id: string): void => setLang(id);

    return {
        leftColumn,
        centerColumn,
        cardFile: {
            updateFile,
            file: file.file,
        },
        propsInput: {
            optionSelect: languages ? buildOptionsCustomSearch(languages, true) : DEFAULT_LANGUAGES,
            onChangeSelect: handleLang,
            valueSelect: lang,
            name: 'lang',
        },
        setLang,
    };
};

export default useInvoiceHeader;
