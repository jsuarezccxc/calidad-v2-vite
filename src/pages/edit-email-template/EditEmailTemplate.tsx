import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SunEditor from 'suneditor-react';
import { useHistory } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { sendEmailTemplate } from '@redux/quotes/actions';
import { sendMailAttachment } from '@redux/electronic-invoice/actions';
import { ZERO } from '@pages/website-editor';
import { ChangeEvent } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { buttonsFooterProps } from '@utils/Button';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { Routes } from '@constants/Paths';
import { INVOICE_TYPE } from '@constants/InvoiceType';
import { REQUIRED_FIELD } from '@constants/FieldsValidation';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Form } from '@components/form';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { FileInput, IFile, TextInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ModalType } from '@components/modal';
import { ModalPreview } from './components';
import { DESCRIPTION_INFORMATION, REJECTED, TITLE_INFORMATION, routes } from '.';
import './EditEmailTemplate.scss';

const EditEmailTemplate: React.FC<IGenericRecord> = ({
    pageTitle,
    invoiceCorrection = {},
    setInvoiceCorrection = (): void => {},
    routesComponent = [],
    setGenerateRejection,
    goBack = true,
    sendEmailCustom = false,
    methodSendEmail = sendEmailTemplate,
    preview = true,
    titleInformation = TITLE_INFORMATION,
    descriptionInformation = DESCRIPTION_INFORMATION,
    route = Routes.CONSULT_ELECTRONIC_DOCUMENT,
    classImage = '',
    classIssue = classImage,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { disabledInputs } = usePermissions();
    const { detail, electronicDocument } = useSelector((state: RootState) => ({
        electronicDocument: state.electronicInvoice.document,
        detail: state.company.information,
    }));
    const [information, setInformation] = useState({
        subject: '',
        client_email: '',
        name_user: '',
        invoice_id: '',
        invoice_pdf_url: '',
        company_name: detail?.name || '',
    });
    const [requiredInformation, setRequiredInformation] = useState({
        subject: false,
        contentArticle: false,
        image: false,
    });
    const [contentArticle, setContentArticle] = useState('');
    const [areEmails, setAreEmails] = useState(false);
    const [file, setFile] = useState<IFile>([{ name: 'email', files: [] }]);
    const [showModal, setShowModal] = useState({
        preview: false,
        success: false,
        warning: false,
    });

    const rejections = useMemo(() => Object.keys(electronicDocument).includes('reason_rejections'), [electronicDocument]);

    useEffect(() => {
        electronicDocument &&
            setInformation({
                ...information,
                invoice_id: electronicDocument.id,
                name_user: electronicDocument.client_name,
                client_email: electronicDocument.client_email,
                invoice_pdf_url: electronicDocument.invoice_pdf_url,
            });
    }, []);

    useEffect(() => {
        validateEmails(information.client_email);
    }, [information.client_email]);

    const handleChange = (e: ChangeEvent): void => {
        const { value } = e.target;
        setInformation({ ...information, subject: value });
    };

    const handleChangeEmail = (e: ChangeEvent): void => {
        const { value } = e.target;
        setInformation({ ...information, client_email: value });
    };

    const contentEditor = (content: string): void => {
        setContentArticle(content);
    };

    const validate = (): boolean => {
        const required = {
            subject: false,
            contentArticle: false,
            image: false,
        };
        required.subject = !information.subject;
        required.contentArticle = !contentArticle;
        setRequiredInformation(required);
        return Object.values(required).some(item => item);
    };

    const validateRejection = (): string => {
        if (rejections) return REJECTED;
        return electronicDocument?.invoice_type || INVOICE_TYPE.INVOICE;
    };

    const handleSendEmail = async (): Promise<void> => {
        if (validate() && !areEmails) return;
        const imageFile = file[ZERO].files;
        let statusCode;
        if (!sendEmailCustom && !(history.location.pathname === getRoute(Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT))) {
            statusCode = await dispatch(
                sendMailAttachment(
                    { ...information, type: INVOICE_TYPE.INVOICE },
                    lengthGreaterThanZero(file) ? imageFile : [],
                    contentArticle
                )
            );
        } else {
            statusCode = await dispatch(
                methodSendEmail(
                    electronicDocument.id,
                    information.subject,
                    contentArticle,
                    validateRejection(),
                    lengthGreaterThanZero(imageFile) ? imageFile[ZERO] : '',
                    information.client_email
                )
            );
        }
        if (isCorrectResponse(Number(statusCode))) {
            setShowModal({ ...showModal, success: true });
            setInformation({
                ...information,
                subject: '',
            });
            setInvoiceCorrection({
                ...invoiceCorrection,
                is_send_email: true,
            });
            setContentArticle('');
            setFile([{ name: 'email', files: [] }]);
        } else {
            setShowModal({ ...showModal, warning: !showModal.warning });
        }
    };

    const validateEmails = (inputValue = ''): void => {
        const emails = inputValue?.split(';');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (let email of emails) {
            email = email.trim();

            if (email.length > 0 && !emailRegex.test(email)) {
                return setAreEmails(false);
            }
        }

        return setAreEmails(true);
    };

    return (
        <>
            <ModalPreview
                show={showModal.preview}
                showModal={(): void => setShowModal({ ...showModal, preview: !showModal.preview })}
                urlImage={file.length && file[0]}
                contentArticle={contentArticle}
                data={information}
                handleSendEmail={(): Promise<void> => handleSendEmail()}
            />
            <ModalType
                open={showModal.success}
                handleClosed={(): void => setShowModal({ ...showModal, success: !showModal.success })}
                iconName="checkMulticolor"
                text={{
                    title: 'Correo enviado',
                    description: '¡El correo se ha enviado con éxito al destinatario!',
                }}
                finalAction={(): void => {
                    if (!sendEmailCustom) history.push(getRoute(route));
                    if (sendEmailCustom)
                        history.push(getRoute(route)) || setGenerateRejection((e: boolean) => setGenerateRejection(!e));
                }}
            />
            <ModalType
                open={showModal.warning}
                handleClosed={(): void => setShowModal({ ...showModal, warning: !showModal.warning })}
                iconName="warning"
                text={{
                    title: 'Error',
                    description: '¡Su correo no ha sido enviado!',
                }}
                finalAction={(): void => {
                    if (!sendEmailCustom) history.push(getRoute(route));
                    if (sendEmailCustom) history.push(getRoute(route)) || (setGenerateRejection && setGenerateRejection(false));
                }}
            />
            <div className="flex flex-col w-full h-full">
                <PageTitle
                    title={pageTitle || getRouteName(Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT)}
                    pageContent={!pageTitle ? SUPPORT_DOCUMENTS_SUBTITLE : ''}
                />
                <BreadCrumb routes={lengthGreaterThanZero(routesComponent) ? routesComponent : routes()} />
                <h3 className="font-bold text-center text-26lg text-blue font-allerbold mb-7">
                    Consulte los documentos electrónicos generados
                </h3>
                <Information classNameTitle="text-blue" title={titleInformation} description={descriptionInformation} />
                <Form className="flex flex-col justify-between mt-4.5">
                    <div className="mb-4.5">
                        <FileInput
                            name="email"
                            labelText="Agregar imagen:"
                            instructions="Agregar imagen"
                            classesWrapperInput="edit-email-template--image"
                            classesWrapper={classImage}
                            file={file}
                            fileExtensionAccept=".jpg, .jpeg, .png"
                            setFile={setFile}
                            required={false}
                            disabled={disabledInputs}
                        />
                    </div>
                    <div className="mb-4.5">
                        <TextInput
                            name="client_email"
                            labelText="Correo electrónico:"
                            value={information.client_email}
                            classesWrapper={`edit-email-template--input ${classIssue}`}
                            onChange={handleChangeEmail}
                            tooltipInfo
                            disabled={disabledInputs}
                            titleTooltip="Correo electrónico:"
                            descTooltip={
                                <span>
                                    es la dirección electrónica para el intercambio de información en una plataforma de
                                    mensajería.
                                    <span className="block text-blue font-allerbold">
                                        Nota: para agregar más de un correo ingrese el punto y coma (;)
                                    </span>
                                </span>
                            }
                            limitCharacters={false}
                        />
                        {!areEmails && <p className="text-purple text-tiny">Ingrese un email valido</p>}
                    </div>
                    <div className="mb-4.5">
                        <TextInput
                            labelText="*Asunto:"
                            onChange={handleChange}
                            value={information.subject}
                            required={requiredInformation.subject}
                            classesWrapper={`edit-email-template--input ${classIssue}`}
                            disabled={disabledInputs}
                        />
                    </div>
                    <div className={`edit-email-template--input ${classIssue}`}>
                        <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">*Contenido:</label>
                        <div className="w-full h-auto p-1 bg-white border border-solid rounded-md border-gray">
                            <SunEditor
                                name="contentArticle"
                                disable={disabledInputs}
                                setContents={contentArticle}
                                setDefaultStyle="font-size: 1rem"
                                onChange={(content: string): void => contentEditor(content)}
                            />
                            {requiredInformation.contentArticle && (
                                <label className="self-end text-tiny text-purple mr-1.5 text-right">{REQUIRED_FIELD}</label>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
            <PageButtonsFooter
                threeButtons={preview}
                className="flex w-full"
                titleButtonCenter="Previsualizar"
                bgColorCenterButton="gray-light"
                onClickButtonCenter={(): void => setShowModal({ ...showModal, preview: !showModal.preview })}
                {...buttonsFooterProps(
                    ModuleApp.ELECTRONIC_DOCUMENTS,
                    history,
                    (): Promise<void> => handleSendEmail(),
                    { name: '', moduleName: '' },
                    'Enviar correo'
                )}
                disabledCenter={disabledInputs}
                disabledRight={disabledInputs}
                onClickButtonLeft={
                    lengthGreaterThanZero(routesComponent) && !goBack
                        ? (): void => setGenerateRejection(false)
                        : (): void => history.goBack()
                }
            />
        </>
    );
};

export default EditEmailTemplate;
