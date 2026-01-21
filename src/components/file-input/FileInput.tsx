import React, { useRef } from 'react';
import { v4 } from 'uuid';
import checkIcon from '@assets/images/check-white.svg';
import { Icon } from '@components/icon';
import uploadIcon from '@assets/images/upload-blue.svg';
import { IFileInputProps, cutName } from '.';
import './FileInput.scss';

export const FileInput: React.FC<IFileInputProps> = React.memo(
    ({
        deleteFile,
        handleChange,
        file,
        wrapperClassName,
        label,
        typeFile,
        textPlaceholder = 'Subir archivo',
        inputClassName = '',
    }) => {
        const id = v4();
        const ref = useRef<HTMLInputElement>(null);

        const handleDeleteFile = (): void => {
            deleteFile();

            if (ref.current) {
                ref.current.value = '';
            }
        };

        return (
            <div className={`file-input ${wrapperClassName}`}>
                {label && <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">{label}</label>}
                {file?.name ? (
                    <div className="flex items-center">
                        <div className="file-input__uploaded-file">
                            <span>{cutName(file.name)}</span>
                            <img alt="success" src={checkIcon} className="w-5.5 h-5.5" />
                        </div>
                        <Icon
                            name="editBlue"
                            onClick={(): void => ref.current?.click()}
                            className="ml-2 mr-1 cursor-pointer file-input__icon"
                            hoverIcon="editGreen"
                        />
                        <Icon
                            name="trashBlue"
                            onClick={handleDeleteFile}
                            className="cursor-pointer file-input__icon"
                            hoverIcon="trashGreen"
                        />
                    </div>
                ) : (
                    <label className={`file-input__box ${inputClassName}`} htmlFor={id}>
                        <span className="file-input__instruction">{textPlaceholder}</span>
                        <img alt="upload" src={uploadIcon} className="w-5.5 h-5.5" />
                    </label>
                )}
                <input className="hidden" id={id} onChange={handleChange} ref={ref} type="file" accept={typeFile} />
            </div>
        );
    }
);
