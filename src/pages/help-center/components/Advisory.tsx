//--- Libraries ---//
import React, { FormEvent, useState, useEffect, ChangeEvent, ClipboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//--- Components ---//
import { IOptionSelect, SelectSearchInput, TextInput } from '@components/input';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { getConsultingType, sendMailData } from '@redux/personalized-consulting/actions';
//--- Utils ---//
import { validateFields } from '@utils/Validation';
//--- Root ---//
import { ContactTemplate, REQUIRED_CONTACT_FIELDS, DEFAULT_ADVISORY, FIELD_LENGTH } from '.';
import { NAME_VALIDATION_REGEX, NFD, NFD_VALIDATION_REX } from '..';

export const Advisory: React.FC<{ toggleModal: () => void }> = ({ toggleModal }) => {
    const dispatch = useDispatch();
    const { consultingTypes } = useSelector((state: RootState) => state.personalizedConsulting);

    const [data, setData] = useState<IGenericRecord>(DEFAULT_ADVISORY);
    const [validate, setValidate] = useState<boolean>(false);
    const [clearValues, setClearValues] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getConsultingType());
    }, []);

    const handleDataChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>): void =>
        setData(prevState => ({ ...prevState, [name]: value }));

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
        const pasteData = event.clipboardData.getData('Text');
        if (!NAME_VALIDATION_REGEX.test(pasteData)) event.preventDefault();
    };

    const resetData = (): void => {
        toggleModal();
        setData(DEFAULT_ADVISORY);
        setClearValues(true);
    };

    const handleChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>): void => {
        const normalizedValue = value.normalize(NFD).replace(NFD_VALIDATION_REX, '');

        if (NAME_VALIDATION_REGEX.test(normalizedValue)) setData(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        setClearValues(false);
    }, [toggleModal]);

    const sendForm = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (validateFields(data, REQUIRED_CONTACT_FIELDS)) return setValidate(true);
        setValidate(false);
        const openModal = Boolean(await dispatch(sendMailData(data)));

        if (openModal) resetData();
    };

    const consultingTypesRender = (consultingTypes as IOptionSelect[]).map(item => ({ ...item, name: item.value }));

    return (
        <ContactTemplate sendForm={sendForm}>
            <SelectSearchInput
                clearOption={clearValues}
                labelText="*Tipo de consultoría"
                classesInput="scroll-options-container"
                optionSelect={consultingTypesRender}
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
                labelText="*Correo electrónico"
                name="data[email]"
                onChange={handleDataChange}
                placeholder="..."
                value={data?.['data[email]']}
                required={validate && !data?.['data[email]']}
                classesWrapper="contact__field"
                limitCharacters={false}
            />
            <TextInput
                labelText="*Descripción"
                name="data[description]"
                onChange={handleDataChange}
                placeholder="..."
                value={data?.['data[description]']}
                required={validate && !data?.['data[description]']}
                classesWrapper="contact__field"
                maxLength={FIELD_LENGTH.DESCRIPTION}
            />
        </ContactTemplate>
    );
};
