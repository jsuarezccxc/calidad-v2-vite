import React, { useState, useEffect } from 'react';

// Vite dynamic imports for general images
const generalImages = import.meta.glob<{ default: string }>('/src/assets/images/*.svg', { eager: true });
const getGeneralImage = (name: string): string => {
    const path = `/src/assets/images/${name}.svg`;
    return generalImages[path]?.default || '';
};
import ReactToPrint from 'react-to-print';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getIconName } from '@utils/Text';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import ImgPDF from '@assets/images/pdf.svg';
import ImgXLS from '@assets/images/xls.svg';
import ImgPDFHover from '@assets/images/pdf-shadow.svg';
import ImgXLSHover from '@assets/images/xls-shadow.svg';
import { XLSX } from '@constants/DownloadFile';
import { LANGUAGE_KEY } from '@constants/Translate';
import { IDownloadIconsProps, IIconProps, TypeIconDownloadEnum } from '.';

export const Icon: React.FC<IIconProps> = ({
    onClick,
    id = generateId({
        module: ModuleApp.OTHERS,
        submodule: 'default-id',
        action: ActionElementType.INFO,
        elementType: ElementType.ICO,
    }),
    className = '',
    name,
    alt = '',
    hoverIcon = name,
    classIcon,
}) => {
    const [iconName, setIconName] = useState<string>(getIconName(name));

    useEffect(() => {
        setIconName(getIconName(name));
    }, [name]);

    return (
        <img
            id={id}
            onClick={onClick}
            src={getGeneralImage(iconName)}
            alt={alt ? alt : name}
            className={`icon ${className} ${hoverIcon !== name ? 'cursor-pointer' : 'cursor-default'} ${classIcon}`}
            onMouseOver={(): void => setIconName(getIconName(hoverIcon))}
            onMouseLeave={(): void => setIconName(getIconName(name))}
        />
    );
};

export const DownloadIcons: React.FC<IDownloadIconsProps> = ({
    moduleId = '',
    className = '',
    download = {},
    pdfUrl = '',
    xlsUrl = '',
    getExcel = async (): Promise<void> => {},
    downloadXml,
    withoutText,
    notFirstXls,
}) => {
    const [translate] = useTranslation(LANGUAGE_KEY);
    return (
        <div className={`${className} flex justify-end`}>
            <div className="content">
                <div className="relative flex h-10 withoutText">
                    {!downloadXml &&
                        !notFirstXls &&
                        (xlsUrl ? (
                            <a href={xlsUrl} download="">
                                <Icon
                                    id={generateId({
                                        module: ModuleApp.BUTTONS,
                                        submodule: `${moduleId}-${TypeIconDownloadEnum.XLS}`,
                                        action: ActionElementType.DOWNLOAD,
                                        elementType: ElementType.DWN,
                                    })}
                                    name="newXls"
                                    className="bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded"
                                />
                            </a>
                        ) : (
                            <Icon
                                id={generateId({
                                    module: ModuleApp.BUTTONS,
                                    submodule: `${moduleId}-${TypeIconDownloadEnum.XLS}`,
                                    action: ActionElementType.DOWNLOAD,
                                    elementType: ElementType.DWN,
                                })}
                                name="newXls"
                                className="bg-white h-8.2 w-7.5  cursor-pointer shadow-templateDesign rounded"
                                onClick={download?.excel || getExcel}
                            />
                        ))}
                    {pdfUrl ? (
                        // eslint-disable-next-line react/jsx-no-target-blank
                        <a href={pdfUrl} target="_blank">
                            <Icon
                                id={generateId({
                                    module: ModuleApp.BUTTONS,
                                    submodule: `${moduleId}-${TypeIconDownloadEnum.PDF}`,
                                    action: ActionElementType.DOWNLOAD,
                                    elementType: ElementType.DWN,
                                })}
                                name="newPdf"
                                className="bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded"
                            />
                        </a>
                    ) : (
                        <Icon
                            id={generateId({
                                module: ModuleApp.BUTTONS,
                                submodule: `${moduleId}-${TypeIconDownloadEnum.PDF}`,
                                action: ActionElementType.DOWNLOAD,
                                elementType: ElementType.DWN,
                            })}
                            name="newPdf"
                            className="ml-2 bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded"
                            onClick={download?.pdf}
                        />
                    )}
                    {!downloadXml &&
                        notFirstXls &&
                        (xlsUrl ? (
                            <a href={xlsUrl} download="">
                                <Icon
                                    id={generateId({
                                        module: ModuleApp.BUTTONS,
                                        submodule: `${moduleId}-${TypeIconDownloadEnum.XML}`,
                                        action: ActionElementType.DOWNLOAD,
                                        elementType: ElementType.DWN,
                                    })}
                                    name="newXls"
                                    className="bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded ml-2"
                                />
                            </a>
                        ) : (
                            <Icon
                                id={generateId({
                                    module: ModuleApp.BUTTONS,
                                    submodule: `${moduleId}-${TypeIconDownloadEnum.XML}`,
                                    action: ActionElementType.DOWNLOAD,
                                    elementType: ElementType.DWN,
                                })}
                                name="newXls"
                                className="bg-white h-8.2 w-7.5  cursor-pointer shadow-templateDesign rounded ml-2"
                                onClick={download?.excel || getExcel}
                            />
                        ))}
                    {downloadXml && (
                        <Icon
                            id={generateId({
                                module: ModuleApp.BUTTONS,
                                submodule: `${moduleId}-${TypeIconDownloadEnum.XML}`,
                                action: ActionElementType.DOWNLOAD,
                                elementType: ElementType.DWN,
                            })}
                            name="xml"
                            className="bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded ml-2"
                            onClick={downloadXml}
                        />
                    )}
                </div>
                {!withoutText && (
                    <p className="relative text-center h-4.23 cursor-default text-tiny text-blue font-allerbold bottom-1">
                        {translate('button.download')}
                    </p>
                )}
            </div>
        </div>
    );
};

export const DownloadIconsWithPrintPage: React.FC<IGenericRecord> = ({
    moduleId = '',
    componentRef,
    documentTitle,
    onClickXls,
    wrapperClassName = '',
}) => {
    const [pdfIcon, setPdfIcon] = useState<string>(ImgPDF);
    const [xlsIcon, setXlsIcon] = useState<string>(ImgXLS);
    const location = useLocation();

    return (
        <div className={`flex flex-col ${wrapperClassName}`}>
            <div className="relative flex justify-center h-10">
                <img
                    id={generateId({
                        module: ModuleApp.BUTTONS,
                        submodule: `${moduleId}-${TypeIconDownloadEnum.XLS}`,
                        action: ActionElementType.DOWNLOAD,
                        elementType: ElementType.DWN,
                    })}
                    src={xlsIcon}
                    alt="xls"
                    onMouseOver={(): void => setXlsIcon(ImgXLSHover)}
                    onMouseLeave={(): void => setXlsIcon(ImgXLS)}
                    onClick={(): void => onClickXls(XLSX)}
                    className="cursor-pointer w-11"
                />
                <ReactToPrint
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    trigger={(): any => (
                        <img
                            id={generateId({
                                module: ModuleApp.BUTTONS,
                                submodule: `${moduleId}-${TypeIconDownloadEnum.PDF}`,
                                action: ActionElementType.PRINT,
                                elementType: ElementType.DWN,
                            })}
                            src={pdfIcon}
                            alt="pdf"
                            onMouseOver={(): void => setPdfIcon(ImgPDFHover)}
                            onMouseLeave={(): void => setPdfIcon(ImgPDF)}
                            className="cursor-pointer w-11"
                            onClick={(): void => location.reload()}
                        />
                    )}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(): any => componentRef.current}
                    documentTitle={documentTitle}
                />
            </div>
            <p className="-mt-1 text-center text-tiny font-allerbold text-blue">Descargar</p>
        </div>
    );
};

export const DownloadOneIcon: React.FC<IDownloadIconsProps> = ({
    moduleId = '',
    className = '',
    download = {},
    pdfUrl = '',
    typeIconDownload = TypeIconDownloadEnum.PDF,
    fileName,
}) => {
    const handleDownload = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        e.preventDefault;

        fetch(pdfUrl)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${fileName}.pdf`;
                link.click();
                window.URL.revokeObjectURL(link.href);
            });
    };

    return (
        <div className={`${className} flex justify-end`}>
            <div>
                <div className="relative flex h-10">
                    {typeIconDownload === TypeIconDownloadEnum.XLS && (
                        <Icon
                            id={generateId({
                                module: ModuleApp.BUTTONS,
                                submodule: `${moduleId}-${TypeIconDownloadEnum.XLS}`,
                                action: ActionElementType.DOWNLOAD,
                                elementType: ElementType.DWN,
                            })}
                            name="newXls"
                            className="bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded"
                            onClick={download?.excel}
                        />
                    )}
                    {typeIconDownload === TypeIconDownloadEnum.PDF && (
                        <>
                            <Icon
                                id={generateId({
                                    module: ModuleApp.BUTTONS,
                                    submodule: `${moduleId}-${TypeIconDownloadEnum.PDF}`,
                                    action: ActionElementType.DOWNLOAD,
                                    elementType: ElementType.DWN,
                                })}
                                name="newPdf"
                                className="ml-2 bg-white h-8.2 w-7.5 cursor-pointer shadow-templateDesign rounded"
                                onClick={(): void => {
                                    if (!pdfUrl) download?.pdf;
                                }}
                            />
                            {pdfUrl && (
                                <a
                                    id={generateId({
                                        module: ModuleApp.BUTTONS,
                                        submodule: `${moduleId}-${TypeIconDownloadEnum.PDF}`,
                                        action: ActionElementType.DOWNLOAD,
                                        elementType: ElementType.DWN,
                                    })}
                                    target="blank"
                                    className="absolute w-5 h-7 right-5 top-2"
                                    onClick={handleDownload}
                                />
                            )}
                        </>
                    )}
                </div>
                <p className="relative text-center cursor-default text-tiny text-blue font-allerbold bottom-1">Descargar</p>
            </div>
        </div>
    );
};
