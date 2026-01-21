//--- Libraries ---//
import React, { FC } from 'react';
//--- Hooks ---//
import usePermissions from '@hooks/usePermissions';
//--- Components ---//
import { FileInput } from '@components/input';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Root ---//
import { FILE, IAdditionalInformationProps } from '..';

export const AdditionalInformation: FC<IAdditionalInformationProps> = ({ file, title, setFile }) => {
    const { disabledInputs } = usePermissions();

    const validateName = (): boolean =>
        file.some((item: IGenericRecord) => item.files.some((index: IGenericRecord) => index.name === undefined));

    const removeFileCompanyFromType = async (): Promise<void> => setFile([]);

    return (
        <section className="p-4 mb-4 bg-white rounded-md shadow-lg">
            <h2 className="mb-3 text-green font-allerbold">{title}</h2>
            <div className="flex flex-wrap gap-x-7 gap-y-1">
                <FileInput
                    file={validateName() ? FILE : file}
                    name="logo"
                    labelText="Logo:"
                    instructions="Subir archivo .jpg, .jpeg, .png"
                    classesWrapper="lg:w-73 w-full my-4.5"
                    classesWrapperInput="lg:h-28.3"
                    fileExtensionAccept=".jpg, .png"
                    setFile={setFile}
                    onClick={removeFileCompanyFromType}
                    disabled={disabledInputs}
                />
            </div>
        </section>
    );
};
