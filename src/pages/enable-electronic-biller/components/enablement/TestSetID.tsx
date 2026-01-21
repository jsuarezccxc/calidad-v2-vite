import React, { useEffect, useState } from 'react';
import { FileInput, PasswordInput, TextInput } from '@components/input';
import { ChangeEvent, RadioButton } from '@components/radiobutton';
import { Button, ButtonType } from '@components/button';
import { Form } from '@components/form';
import { FILE_INDEX } from '@constants/File';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { getCertificateOptions } from '@information-texts/EnableElectronicBiller';
import { Certificate, ITestSetID, ID_STEP } from '.';

export const TestSetID: React.FC<ITestSetID> = ({
    data,
    validate,
    file,
    updateFile,
    currentStep,
    updateData,
    saveCertificate,
    includesCertificate,
    certificate,
    setCertificate,
    handleValidFormatFile,
}) => {
    const { anchorEl, mouseProps } = usePopper();
    const { anchorEl: anchorElSecond, mouseProps: mousePropsSecond } = usePopper();

    const { disabledInputs } = usePermissions();

    const [activeTooltip, setActiveTooltip] = useState<Certificate>(Certificate.Gratuitous);

    useEffect(() => {
        updateData({ ...data, certificate });
    }, [certificate]);

    const activateTooltip = (tooltip: Certificate): void => setActiveTooltip(tooltip);

    const handleCertificateChange = (certificate: string): void => setCertificate(certificate);

    const handleDataChange = ({ target: { name, value } }: ChangeEvent): void => updateData({ ...data, [name]: value });

    const isOwnCertificate = certificate == Certificate.Own;

    const fileType = file[FILE_INDEX].files[FILE_INDEX]?.type;

    return (
        <Form className="flex flex-col items-center flex-1 mb-4.5">
            {currentStep === ID_STEP ? (
                <TextInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.DIAN_ENABLEMENT}-test-set-id`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="testSetID"
                    labelText="*TestSetID:"
                    placeholder="..."
                    required={validate && !data?.testSetID}
                    onChange={handleDataChange}
                    value={data?.testSetID}
                    classesWrapper="electronic-biller__input-test"
                    disabled={disabledInputs}
                />
            ) : (
                <>
                    <RadioButton
                        moduleId={ModuleApp.DIAN_ENABLEMENT}
                        sizeLabel="md"
                        entities={getCertificateOptions({
                            anchorEl,
                            mouseProps,
                            anchorElSecond,
                            mousePropsSecond,
                            activeTooltip,
                            activateTooltip,
                        })}
                        selected={certificate}
                        setSelected={handleCertificateChange}
                        classesLabel="w-45 h-8 p-2"
                        bgCircle="white"
                        classesRadioInput="border border-gray"
                        disabled={disabledInputs}
                    />
                    {isOwnCertificate && (
                        <div className="flex items-start mt-6 gap-7 mb-7">
                            <FileInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.DIAN_ENABLEMENT}-own-certificate`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.UPL,
                                })}
                                name="certificate"
                                labelText="*Certificado de firma digital:"
                                instructions="Subir archivo P12, PFX"
                                classesWrapper="md:w-73 w-full"
                                classesWrapperInput="lg:h-28.3"
                                classesLabel="md:mt-0"
                                fileExtensionAccept=".pfx, .p12"
                                file={file}
                                setFile={updateFile}
                                required={validate && !fileType}
                                cancelValidations={includesCertificate}
                                updateRequiredField={(validation): void => handleValidFormatFile(validation)}
                                disabled={disabledInputs}
                            />
                            {!includesCertificate && (
                                <PasswordInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.DIAN_ENABLEMENT}-password`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name="password"
                                    value={data.password}
                                    labelText="Contraseña:"
                                    placeholder="..."
                                    onChange={handleDataChange}
                                    required={validate && !data?.password}
                                    disabled={disabledInputs}
                                />
                            )}
                        </div>
                    )}
                    <Button
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.DIAN_ENABLEMENT}-test-set`,
                            action: ActionElementType.START,
                            elementType: ElementType.BTN,
                        })}
                        classes={`shadow-card ${isOwnCertificate ? '' : 'enablement__testing-button'}`}
                        text="Iniciar set de pruebas"
                        type={ButtonType.Button}
                        onClick={saveCertificate}
                        disabled={disabledInputs}
                    />
                </>
            )}
        </Form>
    );
};
