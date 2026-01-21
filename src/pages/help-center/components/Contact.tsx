//--- Libraries ---//
import React, { FormEvent, useState, useEffect, ChangeEvent, ClipboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//--- Components ---//
import { FileInput, IFile, SelectSearchInput, TextInput } from '@components/input';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { getPqrTypes, sendMailData } from '@redux/personalized-consulting/actions';
//--- Utils ---//
import { buildOptions } from '@utils/Company';
import { validateFields } from '@utils/Validation';
//--- Root ---//
import { getRequestData, ContactTemplate, DEFAULT_CONTACT, DEFAULT_FILE, REQUIRED_CONTACT_FIELDS, FIELD_LENGTH } from '.';
import { NAME_VALIDATION_REGEX, NFD, NFD_VALIDATION_REX } from '..';

export const Contact: React.FC<{ toggleModal: () => void }> = ({ toggleModal }) => {
    const dispatch = useDispatch();
    const { pqrTypes } = useSelector((state: RootState) => state.personalizedConsulting);

    const [data, setData] = useState<IGenericRecord>(DEFAULT_CONTACT);
    const [file, setFile] = useState<IFile>(DEFAULT_FILE);
    const [validate, setValidate] = useState<boolean>(false);
    const [clearValues, setClearValues] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getPqrTypes());
    }, []);

    useEffect(() => {
        setClearValues(false);
    }, [toggleModal]);

    const handleDataChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>): void =>
        setData(prevState => ({ ...prevState, [name]: value }));

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
        const pasteData = event.clipboardData.getData('Text');
        if (!NAME_VALIDATION_REGEX.test(pasteData)) event.preventDefault();
    };

    const handleChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>): void => {
        const normalizedValue = value.normalize(NFD).replace(NFD_VALIDATION_REX, '');

        if (NAME_VALIDATION_REGEX.test(normalizedValue)) setData(prevState => ({ ...prevState, [name]: value }));
    };

    const resetData = (): void => {
        toggleModal();
        setData(DEFAULT_CONTACT);
        setFile(DEFAULT_FILE);
        setClearValues(true);
    };

    const sendForm = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (validateFields(data, REQUIRED_CONTACT_FIELDS)) return setValidate(true);
        setValidate(false);
        const openModal = Boolean(await dispatch(sendMailData(getRequestData(data, file))));
        if (openModal) resetData();
    };

    const pqrTypesRender = buildOptions(pqrTypes).map(item => ({ ...item, name: item.value }));

    return (
        <ContactTemplate sendForm={sendForm}>
            <SelectSearchInput
                clearOption={clearValues}
                labelText="*Tipo de solicitud"
                classesInput="scroll-options-container"
                optionSelect={pqrTypesRender}
                onChangeSelect={(_, { id, value }): void => setData({ ...data, ['data[type_name]']: value, ['data[type]']: id })}
                required={validate && !data?.['data[type_name]']}
                classesWrapperInput="contact__field"
            />
            <TextInput
                labelText="*Nombre completo"
                name="data[full_name]"
                placeholder="..."
                value={data?.['data[full_name]']}
                required={validate && !data?.['data[full_name]']}
                classesWrapper="contact__field"
                maxLength={FIELD_LENGTH.NAME}
                onPaste={handlePaste}
                onChange={handleChange}
            />
            <TextInput
                labelText="Número de contacto:"
                name="data[phone]"
                onChange={handleDataChange}
                value={data?.['data[phone]']}
                onlyNumbers
                placeholder="..."
                classesWrapper="contact__field"
                maxLength={FIELD_LENGTH.PHONE}
            />
            <TextInput
                labelText="*Correo electrónico"
                name="data[email]"
                onChange={handleDataChange}
                value={data?.['data[email]']}
                required={validate && !data?.['data[email]']}
                classesWrapper="contact__field"
                placeholder="..."
                limitCharacters={false}
            />
            <TextInput
                labelText="*Descripción"
                name="data[description]"
                placeholder="..."
                onChange={handleDataChange}
                value={data?.['data[description]']}
                required={validate && !data?.['data[description]']}
                classesWrapper="contact__field"
                maxLength={FIELD_LENGTH.DESCRIPTION}
            />
            <FileInput
                name="file"
                labelText="Adjuntar archivo"
                instructions="Subir archivo PDF, jpg, png"
                fileExtensionAccept=".pdf,.png,.jpg,.jpeg"
                file={file}
                setFile={(file): void => setFile(file)}
                classesWrapper="input-form__file w-auto"
            />
        </ContactTemplate>
    );
};
