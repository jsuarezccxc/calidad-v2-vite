import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import usePermissions from '@hooks/usePermissions';
import { Form } from '@components/form';
import { CardFile } from '@components/card-file';
import { SelectSearchInput } from '@components/input';
import { TypeFile } from '@constants/ElectronicInvoice';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IInvoiceHeaderProps } from '.';
import './InvoiceHeader.scss';

const InvoiceHeader: React.FC<IInvoiceHeaderProps> = ({
    className = '',
    leftColumn,
    centerColumn,
    textBack = '',
    cardFile: { file, ...cardFile },
    dates,
    propsInput,
}) => {
    const fileUrl = useSelector((state: RootState) => state.parameterizationInvoice.filesLogo);
    const { disabledInputs } = usePermissions();
    return (
        <>
            {propsInput && (
                <Form sendWithEnter>
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `invoice-header-language`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        classesWrapper={`${className} w-37 xs:w-full mb-2`}
                        labelText="Idioma del documento:"
                        selectIconType="arrowDownGreen"
                        {...propsInput}
                        disabled={disabledInputs}
                    />
                </Form>
            )}
            <div className={`invoice-header ${!propsInput ? className : ''}`}>
                <div className="flex flex-col gap-y-2 width-197">
                    <CardFile
                        file={file}
                        className="w-full"
                        url={fileUrl?.url}
                        updateFile={cardFile.updateFile}
                        typeLogo={TypeFile.LOGO_SUPPORT}
                    />
                    <div className="invoice-header__card_style height-108 invoice-header__card_style--text">{leftColumn}</div>
                </div>
                <div className="w-full invoice-header__card_style invoice-header__card_style--text">{centerColumn}</div>
                <div className="flex flex-col gap-y-2 width-197">
                    <div className="invoice-header__card_style h-15">
                        <h3 className="m-auto underline text-green">Código QR</h3>
                    </div>
                    <div className="invoice-header__card_style height-108 invoice-header__card_style--text">
                        <p>Fecha de transmisión:</p>
                        <p>{dates?.transmission}</p>
                        <p>Hora de transmisión: {dates?.hour}</p>
                        <p>Fecha de vencimiento:</p>
                        <p>{dates?.expiration}</p>
                    </div>
                </div>
            </div>
            {textBack && <div className="paragraph-invoice-header">{textBack}</div>}
        </>
    );
};

export default InvoiceHeader;
