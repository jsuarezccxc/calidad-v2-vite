import React from 'react';
import { useHistory } from 'react-router';
import { IGenericRecord } from '@models/GenericRecord';
import { Information } from '@components/information';
import { lengthGreaterThanZero } from '@utils/Length';
import { ModalType } from '@components/modal-custom';
import { ActionType } from '@constants/ActionType';
import { FileInput } from '@components/input';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export const UploadSupport: React.FC<IGenericRecord> = ({ file, setFile, showModalFile, setShowModalFile }) => {
    const history = useHistory();
    const handleCloseModal = (): void => {
        history.push(getRoute(Routes.SUPPORT_DOCUMENT));
        setShowModalFile(!showModalFile);
    };

    return (
        <>
            <ModalType
                type={ActionType.SAVE}
                title="Información guardada"
                text="¡Su información ha sido guardada con éxito!"
                show={showModalFile}
                showModal={handleCloseModal}
            />
            <Information
                title="Subir documento entregado por el proveedor"
                description="Suba su documento entregado por el proveedor en el recuadro a continuación."
            />
            <FileInput
                classesWrapper={`mt-4.5 ${lengthGreaterThanZero(file[0].files) ? 'w-117 xs:w-full' : 'w-61'}`}
                instructions="Subir archivo .jpg, .jpeg, .png, .pdf"
                fileExtensionAccept=".jpg, .jpeg, .png, .pdf"
                classesWrapperInput="xs:w-full w-61"
                addFileText="nuevo archivo"
                name="certificate"
                setFile={setFile}
                file={file}
            />
        </>
    );
};
