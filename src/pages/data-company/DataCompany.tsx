import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { Icon } from '@components/icon';
import { IFile } from '@components/input';
import { Button } from '@components/button';
import { PageTitle } from '@components/page-title';
import { TaxDetails } from './components/TaxDetails';
import { ZERO as ZERO_VALUE } from '@constants/Numbers';
import { ModalCustom } from '@components/modal-custom';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { BasicInformation } from './components/BasicInformation';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ContactInformation } from './components/ContactInformation';
import { AdditionalInformation } from './components/AdditionalInformation';
import PhysicalStore from './components/PhysicalStore';
import { IOption } from '@components/select-search';
import { Routes } from '@constants/Paths';
import { Source } from '@constants/Onboarding';
import { YES, NO } from '@constants/RadioButtonOptions';
import { DEFAULT_RESPONSIBILITY, MaxLengthFields, TypeFile } from '@constants/ElectronicInvoice';
import { PHONE } from '@constants/Supplier';
import { RootState } from '@redux/rootReducer';
import { getDynamicRequest } from '@redux/dynamic-data/actions';
import {
    deleteFilesCompanyAction,
    getFilesCompanyAction,
    postFileCompanyAction,
} from '@redux/parameterization-customization-electronic-invoice/actions';
import {
    getCities,
    getCountries,
    getDepartments,
    getDocumentTypes,
    getInformationCompany,
    getPhysicalStores,
    savePhysicalStores,
    updateDataCompany,
} from '@redux/company/actions';
import { getRouteName } from '@utils/Paths';
import { validateEmail } from '@utils/Validation';
import { isCorrectResponse } from '@utils/Response';
import { getUserData } from '@utils/User';
import { ModuleApp } from '@utils/GenerateId';
import useDigitVerification from '@hooks/useDigitVerification';
import usePermissions from '@hooks/usePermissions';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { IGenericRecord } from '@models/GenericRecord';
import {
    FILE,
    INITIAL_STATE,
    IPropsRequired,
    FIELDS_REQUIRED,
    IDataInformation,
    UTILS_DYNAMIC_DATA,
    transformData,
    IDataStore,
    DATA_PHYSICAL_STORE,
    REQUIRED_FIELDS_STORE,
    removeEmptyValues,
} from '.';
import './DataCompany.scss';

const DataCompany: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { disabledInputs } = usePermissions();

    const { information, physicalStores, document_types } = useSelector(({ company }: RootState) => company);
    const { filesRut } = useSelector(({ parameterizationInvoice }: RootState) => parameterizationInvoice);

    const { digitVerification } = useDigitVerification(information?.document_type_name, information?.document_number);

    const validateFile = Object.values(filesRut).every(value => value !== '' && value !== null && value !== undefined);

    const FILE_STATE = validateFile ? filesRut : FILE;

    const [file, setFile] = useState<IFile>(FILE_STATE);
    const [requiredFields, setRequiredFields] = useState<IPropsRequired>(FIELDS_REQUIRED);
    const [dataInformation, setDataInformation] = useState<IDataInformation>(INITIAL_STATE);
    const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);
    const [dataTable, setDataTAble] = useState<IDataStore[]>([]);
    const [validationStore, setValidationStore] = useState(false);
    const [hasPhysicalStore, setHasPhysicalStore] = useState('');

    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        setDataTAble(transformData(physicalStores));
    }, [physicalStores]);

    const addNewPhysicalStore = (): void => {
        const { company_id } = getUserData();
        setDataTAble(dataTable => [...dataTable, { ...DATA_PHYSICAL_STORE, id: uuid(), company_id }]);
    };

    const handleChangeSelect = (value: IOption, file: string, id: string): void => {
        setDataTAble(dataTable =>
            dataTable.map((store: IDataStore) =>
                store.id === id ? { ...store, [`${file}_id`]: value.value, [`${file}_name`]: value.name } : store
            )
        );
    };

    const handleChangeText = ({ value, name }: IGenericRecord, id: string): void => {
        setDataTAble(dataTable =>
            dataTable.map((store: IDataStore) => {
                if (store.id === id) {
                    return name === PHONE && value.length > MaxLengthFields.PHONE ? store : { ...store, [name]: value };
                }
                return store;
            })
        );
    };

    const onChangeText = (textInput: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = textInput.target;
        setRequiredFields({ ...requiredFields, [name]: !value });
        setDataInformation({ ...dataInformation, [name]: value });
    };

    const validateInputs = (): boolean => {
        const fieldStatus = {
            name: !dataInformation.name,
            email: !validateEmail(dataInformation.email || ''),
            document_type: !dataInformation.document_type,
            document_number: !dataInformation.document_number,
            document_type_name: !dataInformation.document_type_name,
        };

        setRequiredFields(fieldStatus);

        return Object.values(fieldStatus).some((value: boolean) => value);
    };

    const onSubmit = async (): Promise<void> => {
        const validateData = validateInputs();
        const hasEmptyFields = dataTable.some((store: IDataStore) => REQUIRED_FIELDS_STORE.some(field => !store[field]));
        if (hasEmptyFields) return setValidationStore(true);
        await dispatch(savePhysicalStores(dataTable));
        if (!validateData) {
            if (!file.length) {
                const status = await dispatch(deleteFilesCompanyAction(TypeFile.LOGO));
                if (isCorrectResponse(Number(status))) {
                    setShowModalSuccess(true);
                    dispatch(getFilesCompanyAction(TypeFile.LOGO));
                }
            }

            const cleanDataInformation = removeEmptyValues(dataInformation);
            const status = await dispatch(updateDataCompany(formatRequestData(cleanDataInformation)));
            dispatch(postFileCompanyAction(file[ZERO_VALUE].files[ZERO_VALUE], TypeFile.LOGO));

            if (SUCCESS_RESPONSE.includes(Number(status))) {
                setShowModalSuccess(true);
                await dispatch(getInformationCompany());
            }
        }
    };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            await Promise.all([
                dispatch(getInformationCompany()),
                dispatch(getDocumentTypes()),
                dispatch(getDynamicRequest(UTILS_DYNAMIC_DATA)),
                dispatch(getPhysicalStores()),
                dispatch(getDepartments()),
                dispatch(getCities()),
                dispatch(getCountries(true)),
            ]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const uploadFile = file.map((filemap: IFile) => ({
            ...filemap,
            files: [
                {
                    ...filesRut,
                    name: filesRut.file_original_name,
                },
            ],
        }));

        setFile(uploadFile);
    }, [filesRut]);

    useEffect(() => {
        if (information) {
            setDataInformation({
                ...information,
                ciius: information.ciius,
                country_id: String(information.country_id),
                document_type_name: document_types.find(item => item.id === information.document_type)?.name || '',
                fiscal_responsibilities: information?.fiscal_responsibilities?.length
                    ? information.fiscal_responsibilities
                    : [DEFAULT_RESPONSIBILITY],
            });
            setHasPhysicalStore(information?.has_a_physical_store ? YES : NO);
        }
    }, [information]);

    useEffect(() => {
        if (validationStore) {
            const hasEmptyFields = dataTable.some((store: IDataStore) => REQUIRED_FIELDS_STORE.some(field => !store[field]));
            if (!hasEmptyFields) setValidationStore(false);
        }
    }, [dataTable]);

    const filterDataDeleted = (list: string[]): void => {
        setDataTAble(dataTable.filter((store: IDataStore) => !list.includes(store.id)));
        setValidationStore(false);
    };

    const validateForm = useMemo(() => validateInputs(), [dataInformation]);

    const toggleModal = (): void => setShowModalSuccess(!showModalSuccess);

    const formatRequestData = (data: IGenericRecord): IGenericRecord => ({
        ...data,
        has_a_physical_store: hasPhysicalStore === YES,
        tax_detail: dataInformation?.params_from_utils?.id,
    });

    return (
        <div className="xs:px-2">
            <PageTitle title={getRouteName(Routes.DATA_COMPANY)} classTitle="text-left text-base" classContainer="w-full" />
            <h2 className="text-26lg text-center my-4.5 text-blue font-allerbold">{getRouteName(Routes.DATA_COMPANY)}</h2>
            <p className="mb-5">
                Agregue los datos de su empresa para la gestión de <span className="font-allerbold">diggi pymes.</span> Una vez
                agregada la información haga click en guardar.
            </p>
            <article className="data-company">
                <BasicInformation
                    title="Información básica"
                    requiredFields={requiredFields}
                    dataInformation={dataInformation}
                    digitVerification={digitVerification}
                    onChangeText={onChangeText}
                />
                <ContactInformation
                    title="Información de contacto"
                    dataInformation={dataInformation}
                    onChangeText={onChangeText}
                    setDataInformation={setDataInformation}
                />
                <TaxDetails
                    title="Detalles tributarios"
                    dataInformation={dataInformation}
                    setDataInformation={setDataInformation}
                    validate={validateForm}
                />
                <PhysicalStore
                    hasPhysicalStore={hasPhysicalStore}
                    setHasPhysicalStore={setHasPhysicalStore}
                    handleChangeText={handleChangeText}
                    handleChangeSelect={handleChangeSelect}
                    addNewPhysicalStore={addNewPhysicalStore}
                    dataTable={dataTable}
                    filterDataDeleted={filterDataDeleted}
                    validationStore={validationStore}
                />
                <AdditionalInformation title="Información adicional" file={file} setFile={setFile} />
            </article>
            <PageButtonsFooter
                moduleId={ModuleApp.COMPANY_DATA}
                titleButtonLeft="Atrás"
                disabledRight={disabledInputs}
                titleButtonRight="Guardar"
                onClickButtonLeft={(): void => history.goBack()}
                onClickButtonRight={(): Promise<void> => onSubmit()}
            />
            <ModalCustom show={showModalSuccess} showModal={toggleModal} removeMinWidth>
                <div className="flex justify-center">
                    <Icon name="checkMulticolor" className="w-22" />
                </div>
                <h4 className="my-2 text-center font-allerbold text-blue">Información guardada</h4>
                <p className="text-center mb-7">¡Su información ha sido guardada con éxito!</p>
                <div className="flex justify-center gap-7">
                    <Button
                        text="Aceptar"
                        onClick={(): void => handlePostConfirmation(toggleModal)}
                        classes="xs:w-22.3 shadow-templateDesign"
                    />
                </div>
            </ModalCustom>
        </div>
    );
};

export default DataCompany;
