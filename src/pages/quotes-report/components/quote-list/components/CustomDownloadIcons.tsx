import React from 'react';
import newPdfIcon from '@assets/images/new-pdf.svg';
import newXlsIcon from '@assets/images/new-xls.svg';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import type { ICustomDownloadIconsProps } from '..';

export const CustomDownloadIcons: React.FC<ICustomDownloadIconsProps> = ({ onPdfClick, onXlsClick, className = '' }) => {
    return (
        <div className={`flex gap-1 items-center ${className}`}>
            <button
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `xls`,
                    action: ActionElementType.DOWNLOAD,
                    elementType: ElementType.BTN,
                })}
                type="button"
                onClick={onXlsClick}
                className="flex items-center justify-center w-8 h-8 transition-all duration-200 bg-white border-none rounded shadow-md custom-download-icon hover:shadow-lg"
                aria-label="Descargar en formato Excel"
            >
                <img src={newXlsIcon} alt="Excel" className="w-6 h-6" />
            </button>

            <button
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `pdf`,
                    action: ActionElementType.DOWNLOAD,
                    elementType: ElementType.BTN,
                })}
                type="button"
                onClick={onPdfClick}
                className="flex items-center justify-center w-8 h-8 transition-all duration-200 bg-white border-none rounded shadow-md custom-download-icon hover:shadow-lg"
                aria-label="Descargar en formato PDF"
            >
                <img src={newPdfIcon} alt="PDF" className="w-6 h-6" />
            </button>
        </div>
    );
};
