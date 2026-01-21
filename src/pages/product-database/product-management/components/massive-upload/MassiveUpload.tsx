import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { includesWebsite } from '@utils/AssembleProduct';
import { postMassiveUpload, setDataMassiveUpload, setErrorMassiveUpload } from '@redux/assemble-product/action';
import { MASSIVE_UPLOAD } from '@information-texts/ProductDatabase';
import { Information } from '@components/information';
import { FileInput } from '@components/file-input';
import { FILE_INDEX } from '@constants/File';
import { Button } from '@components/button';
import { urls } from '@api/urls';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { locationErrors } from '.';
import './MassiveUpload.scss';

export const MassiveUpload: React.FC = () => {
    const dispatch = useDispatch();

    const [file, setFile] = useState<File | null>(null);
    const [noFile, setNoFile] = useState(false);

    const { massiveUpload, membership_selected, errorsMassiveUpload } = useSelector(
        ({ assembleProduct, membership }: RootState) => ({
            ...assembleProduct,
            ...membership,
        })
    );

    const includesFile = useMemo(() => !!Object.values(massiveUpload).length, [massiveUpload]);

    const activeWebsite = useMemo(() => includesWebsite(membership_selected), [membership_selected]);

    const urlDownload = useMemo(
        () => (activeWebsite ? urls.products.massiveUploadWithChannels : urls.products.massiveUploadWithoutChannels),
        [activeWebsite]
    );

    const validateIncludesFile =
        includesFile || errorsMassiveUpload.length ? 'massive-upload__file' : 'massive-upload__input-file';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            dispatch(setDataMassiveUpload([]));
            setFile(e.target.files[FILE_INDEX]);
            setNoFile(false);
        }
    };

    const deleteFile = (): void => {
        setFile(null);
        dispatch(setDataMassiveUpload([]));
    };

    const uploadFile = (): void => {
        if (file) {
            dispatch(postMassiveUpload(file));
            setNoFile(false);
            return;
        }
        setNoFile(true);
    };

    useEffect(() => {
        dispatch(setDataMassiveUpload([]));
        dispatch(setErrorMassiveUpload([]));
    }, []);

    return (
        <div className="flex flex-col massive-upload__container">
            <Information
                title={MASSIVE_UPLOAD.TITLE}
                classNameTitle="massive-upload__sub-title"
                description={MASSIVE_UPLOAD.DESCRIPTION(urlDownload)}
                classNameContainer="pr-6"
            />
            <FileInput
                file={file}
                typeFile=".csv, .xlsx,.xls"
                inputClassName="cursor-pointer"
                handleChange={handleChange}
                deleteFile={deleteFile}
                wrapperClassName={validateIncludesFile}
                label="Agregar producto/servicios a través de excel"
            />
            {!!errorsMassiveUpload.length && MASSIVE_UPLOAD.ERROR_MASSIVE_PRODUCTS(locationErrors(errorsMassiveUpload))}
            {noFile && MASSIVE_UPLOAD.NO_FILE}
            {includesFile && !errorsMassiveUpload?.length && MASSIVE_UPLOAD.VALID_FILE}
            <Button
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'massive-upload',
                    action: ActionElementType.VALIDATE,
                    elementType: ElementType.BTN,
                })}
                text="Validar"
                onClick={uploadFile}
                classes="mt-4.5 self-end"
            />
            {MASSIVE_UPLOAD.DESCRIPTION_SAVE}
        </div>
    );
};
