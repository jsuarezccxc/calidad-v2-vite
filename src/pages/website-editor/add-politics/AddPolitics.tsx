//--- Libraries ---//
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
//--- Components ---//
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { FileInput, IFile } from '@components/input';
import { Button, Link, SimpleButton } from '@components/button';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { getPolitics, uploadPolitics } from '@redux/politics/actions';
//--- Hooks ---//
import usePermissions from '@hooks/usePermissions';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { FILE_WITH_SAME_NAME, REQUIRED_FIELD } from '@constants/FieldsValidation';
import { DATA_PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '@constants/website';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Utils ---//
import { isCorrectResponse } from '@utils/Response';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
//--- Root ---//
import { APPLICATION_PDF, FILES, IPolitics, NORMALIZE_TEXT, routesAddPolitics, VALIDATION_TEXT, ZERO } from '.';
//--- Styles ---//
import './AddPolitics.scss';

export const AddPolitics: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { disabledInputs } = usePermissions();
    const {
        politics: { politics: politicsFile = [], isDelete },
    } = useSelector((state: RootState) => state);

    const [politics, setPolitics] = useState<IFile>(FILES);
    const [openModalError, setOpenModalError] = useState<boolean>(false);
    const [openModalPolitics, setOpenModalPolitics] = useState<boolean>(false);
    const [validationFileName, setValidationFileName] = useState<IPolitics>(VALIDATION_TEXT);
    const [politicalValidation, setPoliticalValidation] = useState<boolean>(false);

    const handleModalPolitics = (): void => setOpenModalPolitics(!openModalPolitics);

    const handleModalErrorUpload = (): void => setOpenModalError(!openModalError);

    const validateFile = (item: IGenericRecord): boolean | undefined => {
        if (item?.name === DATA_PRIVACY_POLICY) {
            setPoliticalValidation(lengthEqualToZero(item?.files));
            return lengthGreaterThanZero(item?.files);
        }
    };

    const updatePoliticsFiles = (file: IFile, inputKey: string): void => {
        const [nameTerms, namePrivacy] = file.map((item: IFile) => item?.files?.[ZERO]?.name);

        if (nameTerms && namePrivacy) {
            const normalizeText = namePrivacy.normalize(NORMALIZE_TEXT) === nameTerms.normalize(NORMALIZE_TEXT);

            setValidationFileName(prev => ({
                ...prev,
                [inputKey]: normalizeText,
                [inputKey === DATA_PRIVACY_POLICY ? TERMS_AND_CONDITIONS : DATA_PRIVACY_POLICY]: false,
            }));

            if (normalizeText) {
                setPoliticalValidation(false);
                return;
            }
        }

        setPolitics(file);
    };

    const validateTextError = (): string => {
        const { data_privacy_policy, terms_and_conditions } = validationFileName;

        if (politicalValidation) return REQUIRED_FIELD;
        if (data_privacy_policy || terms_and_conditions) return FILE_WITH_SAME_NAME;
        return '';
    };

    const savePolitics = async (): Promise<void> => {
        if (!politics.some((item: IGenericRecord) => validateFile(item))) return;

        const invalidFormat = politics.some((item: IGenericRecord) => {
            if (
                item?.files[ZERO]?.type === APPLICATION_PDF ||
                item?.files[ZERO]?.type?.toLowerCase() === DATA_PRIVACY_POLICY ||
                item?.files[ZERO]?.type?.toLowerCase() === TERMS_AND_CONDITIONS
            ) {
                return false;
            }

            if (lengthEqualToZero(item.files)) return false;

            return true;
        });

        if (invalidFormat) return;
        if (validateTextError() === FILE_WITH_SAME_NAME) return;

        const fileWithoutId = politics.filter((filterFile: IGenericRecord) =>
            filterFile.files.some((arrayFile: IGenericRecord) => !arrayFile.id)
        );

        const status = await dispatch(uploadPolitics(fileWithoutId));
        if (isCorrectResponse(Number(status))) {
            handleModalPolitics();
            return;
        }
        handleModalErrorUpload();
    };

    useEffect(() => {
        dispatch(getPolitics());
    }, []);

    useEffect(() => {
        const files = politics.flatMap((item: IGenericRecord) => item.files);
        const filesPolitics = files.filter((item: IGenericRecord) => !!item.id);

        if (filesPolitics.length !== files.length || isDelete || (!filesPolitics.length && politicsFile.length)) {
            setPolitics(
                politics.map((item: IGenericRecord) => ({
                    ...item,
                    files: politicsFile.filter(file => file.type.toLowerCase() === item.name),
                }))
            );
        }
    }, [politicsFile, isDelete]);

    useEffect(() => {
        if (politicalValidation && !politics.some((item: IGenericRecord) => validateFile(item))) return;
    }, [politics]);

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-add-politics-error`,
                    action: ActionElementType.UPLOAD,
                    elementType: ElementType.MDL,
                })}
                handleClose={handleModalErrorUpload}
                open={openModalError}
            >
                <div className="add-politics__modal">
                    <Icon name="warning" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">
                        ¡Error al guardar el archivo!
                    </p>
                    <p className="text-base text-center text-gray-dark">
                        No se ha podido guardar el archivo, intente nuevamente.
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-add-politics-error`,
                                action: ActionElementType.CLOSE,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handleModalErrorUpload()}
                            text="Cerrar"
                            classes="shadow-templateDesign px-6"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-add-politics`,
                    action: ActionElementType.SUCCESS,
                    elementType: ElementType.MDL,
                })}
                handleClose={handleModalPolitics}
                open={openModalPolitics}
            >
                <div className="add-politics__modal">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">
                        ¡Su información ha sido guardada con éxito!
                    </p>
                    <p className="text-base text-center text-gray-dark">
                        Se ha guardado la información que agregó para su sitio web.
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-add-politics-website`,
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => {
                                handleModalPolitics();
                                history.push(getRoute(Routes.WEBSITE_EDITOR));
                            }}
                            text="Ir a editor de sitio web"
                            classes="shadow-templateDesign mr-6 px-6"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-add-politics`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={handleModalPolitics}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <main className="relative flex-1">
                <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} classContainer="add-politics__title" />
                <BreadCrumb routes={routesAddPolitics()} />
                <h2 className="text-center text-26lg text-blue font-allerbold mb-4.5">Cómo armar el sitio web</h2>
                <h3 className="text-base text-blue font-allerbold mb-4.5">Agregue y/o edite las políticas de su sitio web</h3>
                <p className="text-base text-gray-dark mb-4.5">
                    <span>
                        Agregue los documentos de las política de términos y condiciones de venta con los que cuente en su sitio
                        web, de click en subir documento y adjunte los archivos en versión pdf. Si no tiene la política de
                        privacidad y tratamiento de datos, &nbsp;
                    </span>
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-add-politics`,
                            action: ActionElementType.CREATE,
                            elementType: ElementType.LNK,
                        })}
                        href="?page=create-politics"
                        classes="underline text-purple hover:text-purple text-base"
                        text="haga click aquí"
                    />
                    <span> para generarla.</span>
                </p>
                <section className="flex flex-col justify-center lg:flex-row gap-7">
                    <FileInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-add-politics-data-privacy-policy`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={DATA_PRIVACY_POLICY}
                        file={politics}
                        required={politicalValidation || validationFileName.data_privacy_policy}
                        labelText="*Política de privacidad y tratamiento de datos:"
                        placeholder="Subir archivo pdf"
                        classesInput="add-politics__content-file-input"
                        classesLabel={politics[0].files.length ? 'add-politics__file-label' : ''}
                        isTransparent
                        showTrashIcon={false}
                        classesWrapper="mt-8.4 mb-4.5 lg:w-72 w-full"
                        classesWrapperInput="add-politics__file-input"
                        fileExtensionAccept=".pdf"
                        setFile={(value): void => updatePoliticsFiles(value, DATA_PRIVACY_POLICY)}
                        requiredText={validateTextError()}
                    />
                    <FileInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-add-politics-terms-and-conditions`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.UPL,
                        })}
                        name={TERMS_AND_CONDITIONS}
                        file={politics}
                        required={validationFileName.terms_and_conditions}
                        labelText="Términos y condiciones:"
                        placeholder="Subir archivo pdf"
                        classesInput="add-politics__content-file-input"
                        classesLabel={politics[1].files.length ? 'add-politics__file-label' : ''}
                        isTransparent
                        showTrashIcon={false}
                        classesWrapper="mt-8.4 mb-4.5 lg:w-72 w-full"
                        classesWrapperInput="add-politics__file-input"
                        fileExtensionAccept=".pdf"
                        setFile={(value): void => updatePoliticsFiles(value, TERMS_AND_CONDITIONS)}
                        requiredText={validateTextError()}
                    />
                </section>
                <div className="absolute bottom-0 right-7">
                    <SimpleButton
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-add-politics`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        onClick={(): void => history.goBack()}
                        className="add-politics__return-button"
                    >
                        <span className="add-politics__link">Atrás</span>
                    </SimpleButton>
                    <SimpleButton
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-add-politics`,
                            action: ActionElementType.SAVE,
                            elementType: ElementType.BTN,
                        })}
                        onClick={(): Promise<void> => savePolitics()}
                        disabled={disabledInputs}
                        className={`w-32.5 bg-blue hover:bg-green ${
                            disabledInputs ? 'text-gray' : 'text-white'
                        } shadow-templateDesign rounded-lg text-xs h-8 font-allerbold`}
                    >
                        Guardar
                    </SimpleButton>
                </div>
            </main>
        </>
    );
};
