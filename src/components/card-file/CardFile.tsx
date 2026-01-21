import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import usePermissions from '@hooks/usePermissions';
import { Icon } from '@components/icon';
import { TYPE_IMAGES } from '@constants/File';
import { TypeFile } from '@constants/ElectronicInvoice';
import { createImage } from '@utils/File';
import { deleteFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { ICardFileProps } from '.';
import './CardFile.scss';

export const CardFile: React.FC<ICardFileProps> = ({
    file,
    className,
    updateFile,
    url = '',
    typeLogo = TypeFile.LOGO_INVOICE,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();
    const id = uuid();
    const { disabledInputs } = usePermissions();

    const deleteImage = (): void => {
        if (inputRef.current?.value) {
            inputRef.current.value = '';
            updateFile({});
        } else dispatch(deleteFilesCompanyAction(typeLogo));
    };

    const editFile = (): void => document.getElementById(id)?.click();

    const imageUrl = file?.name ? createImage(file) : url;

    const isLogoSupport = typeLogo === TypeFile.LOGO_SUPPORT;
    const cardFileClass = `card-file ${isLogoSupport ? 'card-file--logo-container' : ''} ${className}`;

    return (
        <div className={cardFileClass}>
            {imageUrl ? (
                <>
                    <img className="max-h-full" src={imageUrl} alt="File" />
                    {!disabledInputs && (
                        <div className="card-file__shadow">
                            <Icon className="cursor-pointer" name="editWhite" onClick={editFile} />
                            <Icon className="cursor-pointer" name="trashWhite" onClick={deleteImage} />
                        </div>
                    )}
                </>
            ) : (
                <label htmlFor={id} className="card-file__text">
                    <span className={`underline ${disabledInputs ? 'text-gray' : ''}`}>+Agregar logo</span>&nbsp;
                    <span className={`block ${disabledInputs ? 'text-gray' : ''}`}>(jpg,png,jpeg)</span>
                </label>
            )}
            <input
                className="hidden"
                id={id}
                type="file"
                ref={inputRef}
                accept="image/png, image/jpeg, image/jpg"
                onChange={({ target }): void => {
                    const [file] = target.files || [null];
                    if (file && TYPE_IMAGES.includes(file.type)) {
                        updateFile(file ?? {});
                    }
                }}
                disabled={disabledInputs}
            />
        </div>
    );
};
