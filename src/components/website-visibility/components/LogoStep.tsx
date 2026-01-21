import React, { Dispatch, SetStateAction } from 'react';
import { RadioButton } from '@components/radiobutton';
import { FileInput, IFile } from '@components/input';
import { LOGO } from '@constants/website';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { RADIO_LOGO_VALUES, radioButtonPropsLogo } from '.';

export const LogoStep: React.FC<{
    logoButton: string;
    setLogoButton: Dispatch<SetStateAction<string>>;
    logo: IFile;
    setLogo: Dispatch<SetStateAction<IFile>>;
    errorEmptyLogo: boolean;
    setErrorEmptyLogo: Dispatch<SetStateAction<boolean>>;
}> = ({ logoButton, setLogoButton, logo, setLogo, errorEmptyLogo, setErrorEmptyLogo }) => {
    const { disabledInputs } = usePermissions();
    const handleDeleteLogo = (id: IGenericRecord): void => {
        if (id) {
            setLogo([{ name: LOGO, files: [], value: 1 }]);
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-y-4.5">
                <p className="text-base font-allerbold text-gray-dark">¿Su negocio cuenta con un logo?</p>
                <RadioButton
                    classesLabel="text-blue"
                    disabled={disabledInputs}
                    {...radioButtonPropsLogo({
                        selected: logoButton,
                        setSelected: setLogoButton,
                    })}
                />

                {logoButton === RADIO_LOGO_VALUES.YES && (
                    <div>
                        <FileInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: 'visibility-logo-step',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.UPL,
                            })}
                            name={LOGO}
                            instructions="Subir en formato .png sin fondo"
                            labelText="Subir logo:"
                            fileExtensionAccept=".jpg , .png, .jpeg"
                            setFile={setLogo}
                            file={logo}
                            onClick={handleDeleteLogo}
                            isValidateSize
                            getFile={(e): void => {
                                setErrorEmptyLogo(!e.target.files?.length);
                            }}
                            classesInput="input-file-visibility"
                            disabled={disabledInputs}
                        />

                        {errorEmptyLogo && (
                            <span className="text-tiny text-purple mr-1.5  leading-xtiny mt-1">*Campo obligatorio</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
