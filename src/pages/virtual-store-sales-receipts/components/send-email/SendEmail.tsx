import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import SunEditor from 'suneditor-react';
import usePermissions from '@hooks/usePermissions';
import { BreadCrumb } from '@components/bread-crumb';
import { Form } from '@components/form';
import { Information } from '@components/information';
import { TextInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitleCustom } from '@components/page-title';
import { Modal } from '@components/modal';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { DOCUMENT_TYPE_REQUIRE, INVOICE, VOUCHER_PURCHASE } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { IGenericRecord } from '@models/GenericRecord';
import { ModalPreview } from '@pages/edit-email-template/components';
import { routes } from '@pages/virtual-store-sales-receipts';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { validateEmail } from '@utils/Validation';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { postMultiEmail } from '@redux/virtual-store-sales/actions';
import { getFileCompanyAction } from '@redux/website-node/actions';
import { RootState } from '@redux/rootReducer';

export const SendEmail: React.FC<IGenericRecord> = ({ data = {} }) => {
    const { disabledInputs } = usePermissions();
    const history = useHistory();
    const dispatch = useDispatch();
    const [showModalPreview, setShowModalPreview] = useState(false);
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [showModalError, setShowModalError] = useState(false);
    const [bodyContent, setBodyContent] = useState('');
    const [inputsValue, setInputsValue] = useState({
        email: '',
        subject: '',
    });
    const [requiredInformation, setRequiredInformation] = useState({
        email: false,
        subject: false,
        body_content: false,
    });
    const [validateMultiEmail, setValidateMultiEmail] = useState(false);
    const {
        websiteNode: { logo },
    } = useSelector((state: RootState) => state);

    useEffect((): void => {
        !data?.invoice_type && history.push(getRoute(Routes.VIRTUAL_STORE_SALES_RECEIPTS));
        dispatch(getFileCompanyAction());
    }, []);

    const onChange = (value = '', type = ''): void => {
        setInputsValue({ ...inputsValue, [type]: value });
    };

    const verifyEmail = (): void => {
        const emails = inputsValue?.email?.split(';');
        setValidateMultiEmail(inputsValue?.email?.length > 1 && emails?.some(email => !validateEmail(email)));
    };

    useEffect(() => {
        verifyEmail();
    }, [inputsValue.email]);

    const onValidate = (): boolean => {
        setRequiredInformation({ email: !inputsValue.email, subject: !inputsValue.subject, body_content: !bodyContent });
        return !!bodyContent.length && !!inputsValue?.email.length && !!inputsValue?.subject.length;
    };
    const onSendEmail = async (): Promise<void> => {
        if (onValidate() && !validateMultiEmail) {
            const statusCode = await dispatch(
                postMultiEmail({
                    ...inputsValue,
                    body_content: bodyContent,
                    invoice_type: data.invoice_type === DOCUMENT_TYPE_REQUIRE.INVOICE ? INVOICE : VOUCHER_PURCHASE,
                    pdfUrl: data?.urlProofPayment,
                    id: data?.id,
                })
            );
            if (SUCCESS_RESPONSE.includes(Number(statusCode))) {
                setShowModalSuccess(!showModalSuccess);
                return;
            }
            setShowModalError(!showModalError);
            return;
        }
    };
    const customRoutes = [
        { name: data?.invoice_type === DOCUMENT_TYPE_REQUIRE.INVOICE ? 'Estado del documento' : data?.invoice_type, route: '#' },
        { name: 'Editar plantilla de correo.', route: '#' },
    ];

    return (
        <>
            <ModalPreview
                show={showModalPreview}
                showModal={(): void => {
                    setShowModalPreview(!showModalPreview);
                }}
                urlImage={logo?.url}
                contentArticle={bodyContent}
                data={inputsValue}
                handleSendEmail={(): void => {
                    onSendEmail();
                }}
                isNew
            />
            <Modal
                id={generateId({
                    module: ModuleApp.MODALS,
                    submodule: `send-email`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => {
                    history.goBack();
                    setShowModalSuccess(!showModalSuccess);
                }}
                open={showModalSuccess}
            >
                <div className="email-modal">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">Correo enviado</p>
                    <p className="text-base text-center text-gray-dark">¡Su correo ha sido enviado con éxito!</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `send-email`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => {
                                history.goBack();
                                setShowModalSuccess(!showModalSuccess);
                            }}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.MODALS,
                    submodule: `send-email-error`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => {
                    setShowModalError(!showModalError);
                }}
                open={showModalError}
            >
                <div className="email-modal">
                    <Icon name="newWrong" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">Error</p>
                    <p className="text-base text-center text-gray-dark">¡Su correo no ha sido enviado!</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `send-email-error`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => {
                                setShowModalError(!showModalError);
                            }}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <div className="flex flex-col w-full h-full">
                <PageTitleCustom title={getRouteName(Routes.WEBSITE_MENU)} classTitle="text-base" />
                <BreadCrumb routes={routes((): void => {}, customRoutes)} />
                <div className="flex items-center justify-center mb-4.5 -mt-4.5 align-middle">
                    <PageTitleCustom classTitle="text-26lg" title="Consulte los reportes de su sitio web" />
                </div>
                <Information
                    color="blue"
                    title="Editar plantilla de correo"
                    description="Agregue su correo electrónico y los detalles requeridos para el envío del documento. Si desea incluir correos adicionales añádalos separándolos con punto y coma (;).  "
                />
                <Form className="flex flex-col justify-between mt-5">
                    <div className="mb-4.5">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `send-email`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Correo electrónico:"
                            classesWrapper="email-inputs xs:w-full"
                            classesWrapperInput={`${disabledInputs ? 'bg-gray-light' : 'bg-white'}`}
                            value={inputsValue?.email}
                            onChange={(e): void => {
                                onChange(e.target.value.trim().toLowerCase(), 'email');
                            }}
                            disabled={disabledInputs}
                            required={requiredInformation?.email || validateMultiEmail}
                            requiredText={validateMultiEmail ? '*Valide su correo electrónico' : '*Campo obligatorio'}
                            limitCharacters={false}
                        />
                    </div>
                    <div className="mb-4.5">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `send-email-subject`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Asunto:"
                            classesWrapper="email-inputs xs:w-full"
                            classesWrapperInput={`${disabledInputs ? 'bg-gray-light' : 'bg-white'}`}
                            value={inputsValue?.subject}
                            onChange={(e): void => {
                                onChange(e.target.value, 'subject');
                            }}
                            required={requiredInformation.subject}
                            maxLength={90}
                            disabled={disabledInputs}
                        />
                    </div>
                    <div className="w-130 xs:w-full">
                        <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">*Contenido:</label>
                        <div
                            className={`p-1 ${
                                disabledInputs ? 'bg-gray-light' : 'bg-white'
                            } bg-white border border-solid rounded-md xs:w-full border-gray email-inputs h-suneditor`}
                        >
                            <SunEditor
                                disable={disabledInputs}
                                name="contentArticle"
                                onChange={(content: string): void => setBodyContent(content)}
                                setContents={bodyContent}
                                setDefaultStyle="font-size: .8125rem"
                            />
                            {requiredInformation.body_content && (
                                <label className="self-end text-tiny text-purple mr-1.5 text-right">*Campo requerido</label>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
            <PageButtonsFooter
                threeButtons
                className="flex w-full"
                titleButtonCenter="Previsualizar"
                bgColorCenterButton="white"
                onClickButtonCenter={(): void => {
                    setShowModalPreview(!showModalPreview);
                }}
                {...buttonsFooterProps(
                    ModuleApp.WEBSITE,
                    history,
                    (): void => {
                        onSendEmail();
                    },
                    { name: '', moduleName: '' },
                    'Enviar correo'
                )}
                onClickButtonLeft={(): void => {
                    history.goBack();
                }}
                disabledCenter={disabledInputs}
                disabledRight={disabledInputs}
            />
        </>
    );
};
