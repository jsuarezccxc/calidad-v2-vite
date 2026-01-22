import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '@redux/rootReducer';
import { createPolitic } from '@redux/politics/actions';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Tooltip } from '@components/tooltip';
import { Icon } from '@components/icon';
import { Link, LinkColor, SimpleButton } from '@components/button';
import { TextInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import usePermissions from '@hooks/usePermissions';
import usePopper from '@hooks/usePopper';
import { getRoute, getRouteName } from '@utils/Paths';
import { validateEmail } from '@utils/Validation';
import { getCurrentDate } from '@utils/Date';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { EMAIL } from '@constants/UserManagement';
import { LANGUAGE_KEY } from '@constants/Translate';
import { ICreatePolitic, MAX_LENGTH_INPUTS_POLITICS, routesCreatePolitics, COMMISSIONED_EMAIL } from '.';
import './CreatePolitics.scss';

export const CreatePolitics: React.FC = () => {
    const { anchorEl, mouseProps } = usePopper();
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        session: { user },
        company: { information },
    } = useSelector((state: RootState) => state);

    const [translate] = useTranslation(LANGUAGE_KEY);
    const { disabledInputs } = usePermissions();
    const [validateData, setValidateData] = useState<boolean>(false);
    const [useSameDataCompany, setUseSameDataCompany] = useState<boolean>(false);
    const [acceptDocument, setAcceptDocument] = useState<boolean>(false);
    const [data, setData] = useState<ICreatePolitic>({
        name: '',
        type_document: '',
        number_document: '',
        city: '',
        address: '',
        email: '',
        commissioned_address: '',
        commissioned_area_email: '',
        phone: '',
        day: String(getCurrentDate().day),
        month: String(getCurrentDate().month),
        year: String(getCurrentDate().year),
        company_id: user?.company_id || '',
    });
    const [requiredFields, setRequiredFields] = useState({
        name: false,
        address: false,
        email: false,
        commissioned_area_email: false,
        phone: false,
    });

    useEffect(() => {
        if (useSameDataCompany) {
            setData({
                ...data,
                commissioned_area_email: information?.email,
                commissioned_address: information?.address,
            });
        } else {
            setData({
                ...data,
                commissioned_area_email: '',
                commissioned_address: '',
            });
        }
    }, [useSameDataCompany]);

    useEffect(() => {
        validateData && validate();
    }, [data]);

    useEffect(() => {
        if (information) {
            setData({
                ...data,
                name: '',
                type_document: information.document_type,
                number_document: information.document_number,
                address: '',
                email: '',
                city: information.city_name,
                phone: '',
                company_id: user?.company_id || '',
            });
        }
    }, [information]);

    const validate = (): boolean => {
        const fieldStatus = {
            name: !data.name,
            address: !data.address,
            email: !data.email,
            commissioned_area_email: !validateEmail(data.commissioned_area_email || ''),
            phone: !data.phone,
        };

        setRequiredFields(fieldStatus);
        return Object.values(fieldStatus).some((value: boolean) => value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });

        if ((name === EMAIL && !validateEmail(value)) || (name === COMMISSIONED_EMAIL && !validateEmail(value))) {
            setRequiredFields({ ...requiredFields, [name]: true });
        } else {
            setRequiredFields({ ...requiredFields, [name]: !value });
        }
    };

    const sendPolitic = async (isPreview = false): Promise<void> => {
        setValidateData(true);
        if (validate() || !acceptDocument) return;

        const result = await dispatch(createPolitic(data, isPreview));
        if (typeof result === 'boolean' && result) history.push(`${getRoute(Routes.WEBSITE_EDITOR)}?page=add-politics`);
    };

    return (
        <main className="relative flex-1">
            <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} classContainer="create-politics__title" />
            <BreadCrumb routes={routesCreatePolitics()} />
            <h2 className="text-center text-26lg text-blue font-allerbold mb-4.5">Cómo armar el sitio web</h2>
            <div className="flex">
                <span {...mouseProps} className="mr-2">
                    <Icon name="infoGreen" className="cursor-pointer" />
                </span>
                <Tooltip
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics-privacy-treatment',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TOOL,
                    })}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    iconName="infoBlue"
                    title="Política de privacidad y tratamiento de datos:"
                    description="es un documento que establece las pautas y prácticas que una organización sigue en relación con la recopilación, uso, almacenamiento y divulgación de la información personal de individuos. Estas políticas son esenciales para garantizar la protección de la privacidad y cumplir con las regulaciones de privacidad y protección de datos."
                    textStyles="text-blue"
                />
                <h3 className="text-base text-blue font-allerbold mb-4.5">Política de privacidad y tratamiento de datos</h3>
            </div>
            <p className="text-base text-gray-dark mb-4.5">
                Desde esta pantalla, puede generar su política de tratamiento de datos personales. Le recordamos que los datos de
                contacto proporcionados en el canal de atención estarán visibles para cualquier persona que consulte la política.
            </p>
            <div className="mb-7">
                <div className="flex mb-4.5 flex-wrap">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-politics-name-company',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="name"
                        labelText="*Nombre/ razón social:"
                        placeholder="..."
                        classesWrapper="w-73 mr-4.5"
                        disabled={disabledInputs}
                        onChange={handleChange}
                        value={data.name}
                        required={requiredFields.name}
                        maxLength={MAX_LENGTH_INPUTS_POLITICS}
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-politics-address',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="address"
                        labelText="*Dirección:"
                        placeholder="..."
                        classesWrapper="w-73"
                        disabled={disabledInputs}
                        onChange={handleChange}
                        value={data.address}
                        required={requiredFields.address}
                        maxLength={MAX_LENGTH_INPUTS_POLITICS}
                    />
                </div>
                <div className="flex flex-wrap">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-politics-email',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="email"
                        labelText="*Correo electrónico:"
                        placeholder="..."
                        classesWrapper="w-73 mr-4.5"
                        disabled={disabledInputs}
                        onChange={handleChange}
                        value={data.email}
                        required={requiredFields.email}
                        requiredText={translate(
                            `fields.${data.email && !validateEmail(data.email) ? 'invalid-email' : 'required-field'}`
                        )}
                        limitCharacters={false}
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-politics-phone',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="phone"
                        labelText="*Teléfono:"
                        placeholder="..."
                        classesWrapper="w-73"
                        disabled={disabledInputs}
                        onChange={handleChange}
                        value={data.phone}
                        required={requiredFields.phone}
                        integerNumbers
                        min={0}
                        maxLength={10}
                    />
                </div>
            </div>
            <p className="text-base text-blue font-allerbold mb-4.5">Canal dispuesto para la atención PQR</p>
            <p className="text-base text-gray-dark mb-4.5">
                Agregue al menos un canal de atención para que los Titulares de los datos personales puedan remitir peticiones,
                quejas y reclamos relacionados con el tratamiento de estos
            </p>
            <Checkbox
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: 'editor-politics-use-same-data-company',
                    action: ActionElementType.INPUT,
                    elementType: ElementType.CHK,
                })}
                checked={useSameDataCompany}
                onChange={(): void => {
                    setUseSameDataCompany(!useSameDataCompany);
                }}
                label="Utilizar los datos consignados en el formulario de datos de la empresa."
                classLabel="text-gray-dark"
                classContainer="pl-8"
                disabled={disabledInputs}
            />
            <div className="flex flex-wrap my-4.5">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics-commissioned-email',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="commissioned_area_email"
                    labelText="*Correo electrónico:"
                    placeholder="..."
                    classesWrapper="w-73 mr-4.5"
                    disabled={disabledInputs || useSameDataCompany}
                    onChange={handleChange}
                    value={data.commissioned_area_email || ''}
                    required={requiredFields.commissioned_area_email}
                    requiredText={translate(
                        `fields.${
                            data.commissioned_area_email && !validateEmail(data.commissioned_area_email)
                                ? 'invalid-email'
                                : 'required-field'
                        }`
                    )}
                    limitCharacters={false}
                />

                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics-commissioned-address',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="commissioned_address"
                    labelText="Dirección:"
                    placeholder="..."
                    classesWrapper="w-73"
                    disabled={disabledInputs || useSameDataCompany}
                    onChange={handleChange}
                    value={data.commissioned_address || ''}
                    maxLength={MAX_LENGTH_INPUTS_POLITICS}
                />
            </div>
            <p className="font-allerbold text-gray-dark mb-4.5">*Nota aclaratoria política de tratamiento de datos personales</p>
            <div className="mb-7.3 w-auto">
                <div className="flex">
                    <Checkbox
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-politics-accept-document',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.CHK,
                        })}
                        checked={acceptDocument}
                        onChange={(): void => {
                            setAcceptDocument(!acceptDocument);
                        }}
                        disabled={disabledInputs}
                        classLabel="text-gray-dark"
                        classContainer="pl-7 w-5"
                        classCheck={!acceptDocument && validateData ? 'border-purple' : ''}
                    />
                    <p className="text-gray-dark create-politics__text">
                        Acepta que el presente documento es un modelo que busca ofrecer una guía a lectores y empresarios.Y que la
                        empresa CCxC <span className="font-allerbold">no es responsable del uso</span> que se haga del presente
                        documento, ni de los efectos jurídicos que puedan generarse por la firma de este documento.
                    </p>
                </div>
                {!acceptDocument && validateData && (
                    <p className="block mt-1 text-right text-tiny text-purple ml-7 create-politics__text">*Campo obligatorio</p>
                )}
            </div>

            <div className="flex justify-end mb-7">
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics',
                        action: ActionElementType.PREVIEW,
                        elementType: ElementType.BTN,
                    })}
                    onClick={(): void => {
                        sendPolitic(true);
                    }}
                    disabled={disabledInputs}
                    className={`w-32.5 bg-blue ${
                        disabledInputs ? 'text-gray' : 'text-white hover:bg-green'
                    }  shadow-templateDesign rounded-lg text-xs h-8 mr-5.5 font-allerbold`}
                >
                    Previsualizar
                </SimpleButton>
            </div>
            <div className="flex justify-end">
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics',
                        action: ActionElementType.BACK,
                        elementType: ElementType.BTN,
                    })}
                    onClick={(): void => {
                        history.goBack();
                    }}
                    className="add-politics__return-button"
                >
                    <span className="add-politics__link">Atrás</span>
                </SimpleButton>
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics',
                        action: ActionElementType.CREATE,
                        elementType: ElementType.BTN,
                    })}
                    onClick={(): void => {
                        sendPolitic();
                    }}
                    disabled={disabledInputs}
                    className={`w-32.5 bg-blue ${
                        disabledInputs ? 'text-gray' : 'text-white hover:bg-green'
                    } text-white shadow-templateDesign rounded-lg text-xs h-8 mr-5.5 font-allerbold`}
                >
                    Generar
                </SimpleButton>
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-politics',
                        action: ActionElementType.NEXT,
                        elementType: ElementType.BTN,
                    })}
                    className="add-politics__return-button"
                >
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-politics',
                            action: ActionElementType.NEXT,
                            elementType: ElementType.LNK,
                        })}
                        classes="create-politics__link"
                        href={getRoute(Routes.INSTRUCTIONS_PAYU)}
                        text="Siguiente"
                        linkColor={LinkColor.BLUE}
                    />
                </SimpleButton>
            </div>
        </main>
    );
};
