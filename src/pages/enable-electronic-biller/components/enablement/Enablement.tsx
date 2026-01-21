/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';

// Vite dynamic imports for electronic documents images
const electronicDocsImages = import.meta.glob<{ default: string }>('/src/assets/images/electronic-documents/*.svg', { eager: true });
const getElectronicDocsImage = (name: string): string => {
    const path = `/src/assets/images/electronic-documents/${name}.svg`;
    return electronicDocsImages[path]?.default || '';
};
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { IFile } from '@components/input';
import { Button } from '@components/button';
import { CurrentStep, InstructionStep } from '@components/current-step';
import { PaginatorSteps } from '@components/paginator-steps';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { RootState } from '@redux/rootReducer';
import {
    getCertificateCompanyAction as getCertificate,
    postSaveConfigurationAction as postCertificate,
} from '@redux/parameterization-customization-electronic-invoice/actions';
import { getCustomQueryAction } from '@redux/utils/actions';
import { ENABLING_STEPS, STEP_DATA, getText } from '@information-texts/EnableElectronicBiller';
import { FILE_INDEX } from '@constants/File';
import { TypeFile } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';
import {
    TestSetID,
    getCustomQueries,
    formatCertificateRequest,
    ID_STEP,
    Certificate,
    CERTIFICATE,
    CERTIFICATE_STEP,
    SUPPLIER,
    FILE_TYPE,
} from '.';

export const Enablement: React.FC<{
    finalAction: () => void;
    toggleModal: () => void;
    returnStep: (option: boolean) => void;
}> = ({ finalAction, toggleModal, returnStep }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { disabledInputs } = usePermissions();

    const { information, certificateInfo, infoCustomQuery } = useSelector(
        ({ company, parameterizationInvoice, utils }: RootState) => ({
            ...company,
            ...parameterizationInvoice,
            ...utils,
        })
    );

    const [data, setData] = useState<IGenericRecord>({});
    const [file, setFile] = useState<IFile>([{ name: CERTIFICATE, type: TypeFile.CERTIFICATE, files: [] }]);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [validate, setValidate] = useState<boolean>(false);
    const [certificate, setCertificate] = useState<string>('');
    const [includesCertificate, setIncludesCertificate] = useState(false);
    const [invalidFormatFile, setInvalidFormatFile] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        saveInitialData();
    }, [certificateInfo]);

    const saveInitialData = (): void => {
        const isSupplierCertificate = certificateInfo?.signer_role === SUPPLIER;
        setData({ ...data, testSetID: certificateInfo?.test_set_id });
        if (lengthGreaterThanZero(Object.keys(certificateInfo)) && certificateInfo?.signer_role)
            setCertificate(isSupplierCertificate ? Certificate.Own : Certificate.Gratuitous);
        if (isSupplierCertificate) {
            setFile([{ name: CERTIFICATE, type: TypeFile.CERTIFICATE, files: [{ name: 'Certificado de firma digital' }] }]);
            setIncludesCertificate(true);
        }
    };

    const getData = async (): Promise<void> => {
        await Promise.all([dispatch(getCertificate()), dispatch(getCustomQueryAction(getCustomQueries(information)))]);
    };

    const includesFile = useMemo(() => file[FILE_INDEX].files.length, [file]);

    const handleStepChange = (step: number): void => {
        if (step < currentStep) setCurrentStep(step);
        if (currentStep === ID_STEP && !data.testSetID) return setValidate(true);
        if (currentStep === CERTIFICATE_STEP && certificate === Certificate.Own) {
            if (includesCertificate) {
                if (!includesFile) return setValidate(true);
            }
            if (!includesCertificate) {
                if (!data?.password || !includesFile) return setValidate(true);
            }
            if (invalidFormatFile) return;
        }

        setValidate(false);
        setCurrentStep(step);
    };

    const isFreeCertificate = data.certificate === Certificate.Gratuitous;

    const validateCertificate = (): boolean => {
        if (isFreeCertificate) return false;
        return !file[FILE_INDEX].files[FILE_INDEX]?.type && !data.password;
    };

    const saveCertificate = async (): Promise<void> => {
        const certificateFile = file[FILE_INDEX].files[FILE_INDEX];

        const newFile = new Blob([certificateFile], { type: FILE_TYPE });

        const finalFile = new File([newFile], certificateFile?.name, { type: FILE_TYPE });

        if (validateCertificate() && !includesCertificate) return setValidate(true);

        const requestData = formatCertificateRequest({
            certificateInfo,
            information,
            infoCustomQuery,
            data,
            includesCertificate,
        });

        const { isCorrect }: any = await dispatch(
            postCertificate(requestData, isFreeCertificate ? undefined : finalFile, !includesCertificate)
        );
        if (isCorrect) toggleModal();
    };

    const { anchorEl, mouseProps } = usePopper();
    const { anchorEl: anchorElTest, mouseProps: mousePropsTest } = usePopper();
    const { anchorEl: anchorElSign, mouseProps: mousePropsSign } = usePopper();

    const { bottomText, step, indication, image, topText, titleTooltip, descTooltip, styles } = ENABLING_STEPS[currentStep - 1];

    const props: IGenericRecord = {
        mouseProps,
        anchorEl,
        tooltip: {
            title: 'Set de pruebas:',
            description: 'es la validación previa que exige la DIAN antes de empezar a expedir la factura electrónica.',
        },
        anchorElTest,
        mousePropsTest,
        tooltipTest: {
            title: 'TestSetID:',
            description: 'es el código de identificación que permite hacer la alianza de su empresa con la página de la DIAN.',
        },
        anchorElSign,
        mousePropsSign,
        tooltipSign: {
            title: 'Firma digital:',
            description:
                'es el archivo digital con el que se firman todos los documentos electrónicos emitidos para asegurar su autenticidad.',
        },
    };

    const handleValidFormatFile = (validation: boolean): void => {
        setInvalidFormatFile(validation);
    };

    return (
        <div className="enablement">
            <CurrentStep {...STEP_DATA.ENABLEMENT} />
            <div className="enablement__step-content">
                {!!indication && (
                    <InstructionStep
                        step={step}
                        title={typeof indication === 'function' ? indication(props) : indication}
                        titleTooltip={titleTooltip}
                        descTooltip={descTooltip}
                    />
                )}
                <div className="flex-1 mt-4.5 flex flex-col">
                    {topText && getText(topText)}
                    {image ? (
                        <img
                            alt="Step"
                            className="mx-auto"
                            style={styles}
                            src={getElectronicDocsImage(image)}
                        />
                    ) : (
                        <TestSetID
                            data={data}
                            validate={validate}
                            updateData={(data: IGenericRecord): void => setData(data)}
                            currentStep={currentStep}
                            saveCertificate={saveCertificate}
                            file={file}
                            updateFile={(file): void => {
                                setFile(file);
                                setIncludesCertificate(false);
                                setData(data => ({ ...data, password: '' }));
                            }}
                            includesCertificate={includesCertificate}
                            setCertificate={setCertificate}
                            certificate={certificate}
                            handleValidFormatFile={handleValidFormatFile}
                        />
                    )}
                    {currentStep === ENABLING_STEPS.length && (
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.DIAN_ENABLEMENT}-generate`,
                                action: ActionElementType.ACTION,
                                elementType: ElementType.BTN,
                            })}
                            classes="enablement__end-button"
                            onClick={finalAction}
                            text="Generar y transmitir documentos electrónicos"
                            disabled={disabledInputs}
                        />
                    )}
                    {bottomText && getText(bottomText, false)}
                </div>
                <PaginatorSteps
                    data={ENABLING_STEPS}
                    currentPage={currentStep}
                    setCurrentPage={handleStepChange}
                    wrapperClassName="mx-auto"
                />
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.DIAN_ENABLEMENT, history, getRoute(Routes.NUMBER_RANGE), {
                    name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                })}
                classNameBtnLeft="px-2.5"
                className="flex flex-row items-center justify-end"
                titleButtonLeft={STEP_DATA.BUTTON_BACK_EN}
                disabledRight={disabledInputs}
                onClickButtonLeft={(): void => returnStep(false)}
            />
        </div>
    );
};
