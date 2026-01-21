import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ADD_INVENTORY } from '@information-texts/ProductDatabase';
import { MODAL_WARNING_CLIENT, MODAL_WARNING_SUPPLIER, USAGE_MESSAGE } from '@information-texts/Modal';
import { IGenericRecord } from '@models/GenericRecord';
import { LANGUAGE_KEY } from '@constants/Translate';
import { ActionType } from '@constants/ActionType';
import { TitleButtons } from '@constants/Buttons';
import { EDIT } from '@constants/UserManagement';
import { MODAL_BAD_REQUEST } from '@constants/StatusCodes';
import usePermissions from '@hooks/usePermissions';
import { TextInput } from '@components/input';
import { Button } from '@components/button';
import { Table } from '@components/table';
import { Icon } from '@components/icon/';
import { isEven } from '@utils/Number';
import { setModalRedirectPlans } from '@redux/menu/actions';
import {
    FIRST_POSITION_INDEX,
    IModalBadRequest,
    IModalCustomProps,
    IModalInformationProps,
    IModalTypeProps,
    IModalWarningClientOrSupplierProps,
    ITypeModal,
    IUnauthorizedModalProps,
    scrollUp,
    TypePageDownload,
} from '.';
import './ModalCustom.scss';

/**
 * Custom modal is a container that allows you to add content to the modal
 *
 * @param props
 * @returns Element container modal
 */
export const ModalCustom: React.FC<IModalCustomProps> = props => {
    const {
        show = false,
        children,
        classesWrapper = '',
        classesModal = 'p-11',
        isLoader = false,
        isTableModal = false,
        additional,
        classAdditional,
        id = '',
        removeMinWidth = false,
        closeIcon = false,
        classIconClose,
        showModal,
    } = props;
    const [showLeaveAnimation, setShowLeaveAnimation] = useState(false);

    setTimeout(() => {
        setShowLeaveAnimation(false);
    }, 600);

    useEffect(() => {
        if (classesModal.includes(scrollUp)) {
            const elements = document.getElementsByClassName(classesModal);
            for (let index = 0, maxLength = elements.length; index < maxLength; index++) {
                elements[index].scrollTop = 0;
            }
        }
    }, [show]);

    return (
        <div
            className={`${classAdditional} ${
                isLoader ? 'custom-isLoader-modal' : 'z-20'
            } fixed inset-0 flex items-center justify-center overflow-y-scroll xs:overflow-x-hidden scroll-modal ${
                show ? 'block' : ''
            } ${!show && !showLeaveAnimation ? 'hidden' : ''} ${showLeaveAnimation ? 'animate-leave-modal' : ''} background`}
        >
            <div
                className={`${classesWrapper} relative flex justify-center m-auto min-w-min-mi max-w-max-mi ${
                    show && 'animate-show-modal'
                }`}
            >
                <div
                    className={`${classesModal} flex flex-col ${
                        isTableModal ? 'bg-white max-w-max-mi' : 'bg-gray-light max-w-max-mi'
                    } ${removeMinWidth ? '' : 'min-w-min-mi'}  shadow-modal rounded-2xl p-11 xs:overflow-y-scroll`}
                    id={id}
                >
                    {closeIcon && (
                        <Icon
                            id={`${id}-modal-custom-close-ico`}
                            name="closeGray"
                            onClick={(): void => {
                                setShowLeaveAnimation(true);
                                showModal();
                            }}
                            className={`absolute cursor-pointer w-8.5 h-8.5 -right-9 -top-8 ${classIconClose}`}
                            alt="close-modal"
                        />
                    )}
                    {children}
                </div>
            </div>
            {additional}
        </div>
    );
};

/**
 * Modal Type is an information modal used to show different content
 *
 * @param props
 * @returns Element modal type with information
 */
export const ModalType: React.FC<IModalTypeProps> = props => {
    const {
        closeIcon,
        type = ActionType.INFO,
        show = false,
        isHiddenButton = true,
        showModal,
        title,
        text,
        mainAction = showModal,
        otherAction = showModal,
        textButton = '',
        classesWrapper = '',
        classesModal = '',
        addButton = '',
        withUpdateMessage = true,
        classesContentButton = '',
        id = '',
        classModalType = '',
        backBtnText = TitleButtons.BACK,
    } = props;

    const [translate] = useTranslation(LANGUAGE_KEY);

    const handleTexts = (): {
        textAddButton: string;
        textDeleteButton: string;
        textMainAction: string;
        textOtherAction: string;
    } => {
        const textAddButton = addButton === ActionType.ADD ? translate('button.add') : translate('button.add-another');
        const textNextButton = textButton ?? translate('button.next');
        const textInfoButton = type === ActionType.INFO_OC ? translate('button.save') : textNextButton;
        const textDeleteButton = type === ActionType.DELETE ? translate('button.delete') : textInfoButton;
        const textMainAction =
            type === ActionType.SAVE || type === ActionType.WARNING || type === ActionType.UPDATE || type === ActionType.SUCCESS
                ? translate('button.accept')
                : textDeleteButton;
        const textOtherAction =
            type === ActionType.DELETE || type === ActionType.CANT_DELETE ? translate('button.back') : textAddButton;

        return {
            textAddButton,
            textDeleteButton,
            textMainAction,
            textOtherAction,
        };
    };

    const getIcon = (type: ITypeModal): React.ReactElement | null => {
        if (type === ActionType.WARNING)
            return (
                <Icon
                    id={`${id}-modal-type-warning-ico`}
                    name="warningBlue"
                    onClick={(): void => {}}
                    className="header__icon"
                    alt="info-modal"
                />
            );
        if (type === ActionType.DELETE || type === ActionType.CANT_DELETE)
            return (
                <Icon
                    id={`${id}-modal-type-delete-ico`}
                    name="trashBlue"
                    onClick={(): void => {}}
                    className="header__icon"
                    alt="trash-modal"
                />
            );
        if (
            type === ActionType.ADD ||
            type === ActionType.SAVE ||
            type === ActionType.UPDATE ||
            type === ActionType.SUCCESS ||
            type === ActionType.INFO_OC
        )
            return (
                <Icon
                    id={`${id}-modal-type-accept-ico`}
                    name="checkBlue"
                    onClick={(): void => {}}
                    className="header__icon"
                    alt="check-modal"
                />
            );
        if (type === ActionType.SUCCESS_CORRECTION_INVOICE)
            return (
                <Icon
                    id={`${id}-modal-type-accept-correction-invoice-ico`}
                    name="checkBlue"
                    onClick={(): void => {}}
                    className="header__icon"
                    alt="check-correction-modal"
                />
            );
        return (
            <Icon
                id={`${id}-modal-type-info-ico`}
                name="infoBlue"
                onClick={(): void => {}}
                className="header__icon"
                alt="info-modal"
            />
        );
    };

    const showActions = (): boolean =>
        !!(type !== ActionType.INFO || textButton) &&
        type !== ActionType.SUCCESS_CORRECTION_INVOICE &&
        type !== ActionType.CANCEL_MODULE_OR_GROUP;
    const showOtherAction = (): boolean =>
        type === ActionType.ADD || type === ActionType.DELETE || type === ActionType.CANT_DELETE;

    const classInfo = (): string => {
        const hiddenClasses = isHiddenButton ? 'hidden' : '';
        return `flex justify-center mt-7 info-button md:${hiddenClasses}`;
    };

    return (
        <ModalCustom
            show={show}
            showModal={showModal}
            closeIcon={closeIcon}
            classesWrapper={`${classesWrapper} modal--full`}
            classesModal={`${classesModal} modal--full`}
            id={id}
        >
            <div className={`modal--response ${classModalType} `}>
                <div className="flex flex-row items-center mb-2">
                    {getIcon(type)}
                    <h3 className="text-xl font-allerbold leading-xl text-blue">{title}</h3>
                </div>
                <div className="text-base font-normal leading-base text-gray-dark">{text}</div>
                {type === ActionType.SAVE && withUpdateMessage && (
                    <div className="mt-4 font-normal leading-4 text-tiny text-purple">{translate('modal.save-message')}.</div>
                )}
                {type === ActionType.SUCCESS_CORRECTION_INVOICE && (
                    <div className={`flex flex-row justify-center mt-3 gap-7 ${classesContentButton}`}>
                        <Button
                            id={`${id}-modal-type-main-action-btn`}
                            text={translate(textButton || 'button.save')}
                            onClick={mainAction}
                        />
                        <Button id={`${id}-modal-type-next-action-btn`} text={translate('button.next')} onClick={otherAction} />
                    </div>
                )}
                {showActions() && (
                    <div className="flex flex-row justify-center mt-7">
                        {showOtherAction() && (
                            <div className="flex justify-center mr-3">
                                <button className="footer__button--blue" onClick={otherAction}>
                                    {handleTexts().textOtherAction}
                                </button>
                            </div>
                        )}
                        {type !== ActionType.ADD_BOTH &&
                            type !== ActionType.ADD_PRODUCT &&
                            type !== ActionType.ADD_SERVICE &&
                            type !== ActionType.CANT_DELETE && (
                                <div id="content-save-button" className="flex justify-center ml-3">
                                    <button
                                        id={`${id}-modal-type-main-action-info-btn`}
                                        className="footer__button--blue"
                                        onClick={mainAction}
                                    >
                                        {handleTexts().textMainAction}
                                    </button>
                                </div>
                            )}
                    </div>
                )}

                {type === ActionType.INFO && (
                    <div id="content-button-back" className={classInfo()}>
                        <Button id={`${id}-modal-type-back-action-info-btn`} text={backBtnText} onClick={otherAction} />
                    </div>
                )}

                {type === ActionType.CANCEL_MODULE_OR_GROUP && (
                    <div className="flex justify-center gap-x-5.5 mt-7" id="content-button-back">
                        <Button id={`${id}-modal-type-show-modal-back-btn`} text={translate('button.back')} onClick={showModal} />
                        <Button
                            id={`${id}-modal-type-show-modal-confirm-btn`}
                            background={'gray-light'}
                            classes="text-blue"
                            text={translate('button.confirm')}
                            onClick={showModal}
                        />
                    </div>
                )}
                {type === ActionType.CANCEL_MODULE_OR_GROUP && (
                    <div className="flex justify-center gap-x-5.5 mt-7" id="content-button-back">
                        <Button
                            id={`${id}-modal-type-show-modal-module-group-back-btn`}
                            text={translate('button.back')}
                            onClick={showModal}
                        />
                        <Button
                            id={`${id}-modal-type-show-modal-module-group-confirm-btn`}
                            background={'gray-light'}
                            classes="text-blue"
                            text={translate('button.confirm')}
                            onClick={showModal}
                        />
                    </div>
                )}
                {type === ActionType.ADD_BOTH && (
                    <div className="flex justify-center mr-3 row">
                        <Button
                            id={`${id}-modal-type-add-product-both-btn`}
                            text={'Añadir producto'}
                            classes={'mr-3'}
                            onClick={otherAction}
                        />
                        <Button
                            id={`${id}-modal-type-add-services-both-btn`}
                            text={'Añadir servicio'}
                            classes={'mr-3'}
                            onClick={otherAction}
                        />
                        <Button id={`${id}-modal-type-next-both-btn`} text={'Siguiente'} classes={'mr-3'} onClick={mainAction} />
                    </div>
                )}
                {type === ActionType.ADD_PRODUCT && (
                    <div className="flex justify-center mr-3 row">
                        <Button
                            id={`${id}-modal-type-add-product-btn`}
                            text={'Añadir producto'}
                            classes={'mr-3'}
                            onClick={otherAction}
                        />

                        <Button
                            id={`${id}-modal-type-next-product-btn`}
                            text={'Siguiente'}
                            classes={'mr-3'}
                            onClick={mainAction}
                        />
                    </div>
                )}
                {type === ActionType.ADD_SERVICE && (
                    <div className="flex justify-center mr-3 row">
                        <Button
                            id={`${id}-modal-type-modal-add-service-btn`}
                            text={'Añadir servicio'}
                            classes={'mr-3'}
                            onClick={otherAction}
                        />
                        <Button
                            id={`${id}-modal-type-next-service-btn`}
                            text={'Siguiente'}
                            classes={'mr-3'}
                            onClick={mainAction}
                        />
                    </div>
                )}
            </div>
        </ModalCustom>
    );
};

export const UnauthorizedModal: React.FC<IUnauthorizedModalProps> = props => {
    const dispatch = useDispatch();
    const { getRole } = usePermissions();
    const [translate] = useTranslation(LANGUAGE_KEY);

    const id = props.id;

    const textMessageWithoutInformation = props.withoutInformation
        ? USAGE_MESSAGE(translate('modal.start-message'), translate('modal.register-company'))
        : `${translate('modal.excluded-module')}.`;

    return (
        <ModalCustom {...props} classesWrapper="modal--full" closeIcon>
            <div className="flex h-full xs:items-center xs:justify-center">
                <div className="xs:px-16">
                    <div className="flex">
                        <Icon id={`${id}-modal-unauthorized-info-ico`} name="infoBlue" className="w-5.5 h-5.5 mr-2.2" />
                        <h3 className="text-xl font-allerbold leading-xl text-blue xs:text-center">
                            {translate('modal.information')}
                        </h3>
                    </div>
                    <div>
                        <p className="mt-2 w-89 text-gray-dark font-aller">
                            {getRole() === EDIT ? translate('modal.without-permissions') : textMessageWithoutInformation}
                        </p>
                        <Button
                            id={`${id}-modal-unauthorized-next-btn`}
                            text={
                                getRole() !== EDIT && !props.withoutInformation
                                    ? translate('button.membership-plans')
                                    : translate('button.back')
                            }
                            onClick={(): void => {
                                props.showModal();
                                getRole() !== EDIT && !props.withoutInformation && dispatch(setModalRedirectPlans());
                            }}
                            classes="mx-auto mt-7 block"
                        />
                    </div>
                </div>
            </div>
        </ModalCustom>
    );
};

export const ModalInfoDownloadIcons: React.FC<IModalInformationProps> = ({
    show = false,
    showModal = (): void => {},
    downloadFile = (): void => {},
    typePageDownload,
    id,
}) => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const validateText = (): string => {
        const textKey: { [key: string]: string } = {
            [TypePageDownload.MINIMUM_LEVEL]: 'download-minimum-items',
            [TypePageDownload.MAXIMUM_LEVEL]: 'download-maximum-items',
        };
        const modalKey = `modal.${textKey[typePageDownload] || 'download-less-items'}`;
        return `${translate(modalKey)}`;
    };

    return (
        <ModalCustom id={id} show={show} showModal={showModal} classesWrapper="modal--full information-modal">
            <div className="xs:h-full xs:flex xs:justify-center xs:flex-col">
                <div className="flex items-center mb-2 xs:justify-center">
                    <div className="flex gap-2">
                        <Icon
                            id={`${id}-modal-download-icons-info-ico`}
                            name="infoBlue"
                            onClick={(): void => {}}
                            className="w-5.5 h-5.5 relative top-0.5"
                        />
                        <h3 className="w-full text-xl font-allerbold leading-xl text-blue xs:text-center">
                            {translate('modal.information')}
                        </h3>
                    </div>
                </div>
                <div className="text-base xs:text-center xs:px-8 w-89.2 leading-base text-gray-dark ">
                    <p>{validateText()}</p>
                </div>
                <div className="flex justify-center mt-7 gap-5.5">
                    <Button id={`${id}-modal-download-icons-back-btn`} text={translate('button.back')} onClick={showModal} />
                    <Button
                        id={`${id}-modal-download-icons-download-btn`}
                        text={translate('button.download')}
                        onClick={downloadFile}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};

export const ModalFreeTrialTermination: React.FC<IGenericRecord> = ({
    show = false,
    showModal = (): void => {},
    module = '',
    id,
}) => {
    const [translate] = useTranslation(LANGUAGE_KEY);
    return (
        <ModalCustom id={id} show={show} showModal={showModal} classesWrapper="modal--full information-modal">
            <div className="xs:h-full xs:flex xs:justify-center xs:flex-col">
                <div className="flex items-center mb-2 xs:justify-center">
                    <div className="flex gap-2">
                        <Icon
                            id={`${id}-modal-free-termination-info-ico`}
                            name="infoBlue"
                            onClick={(): void => {}}
                            className="w-5.5 h-5.5 relative top-0.5"
                        />
                        <h3 className="w-full text-xl font-allerbold leading-xl text-blue xs:text-center">
                            {translate('modal.information')}
                        </h3>
                    </div>
                </div>
                <div className="text-base xs:text-center xs:px-8 w-89.2 leading-base text-gray-dark ">
                    <p>
                        El periodo de prueba gratis del módulo <strong>{module}</strong> ha finalizado
                    </p>
                </div>
                <div className="flex justify-center mt-7 gap-5.5">
                    <Button id={`${id}-modal-free-termination-close-btn`} text={translate('button.back')} onClick={showModal} />
                </div>
            </div>
        </ModalCustom>
    );
};

export const ModalErrorDeleteInventory: React.FC<IGenericRecord> = ({ showModalError, closeModal, data, accept, id = '' }) => {
    const invoicesFirstProduct = data[FIRST_POSITION_INDEX]?.invoices?.[FIRST_POSITION_INDEX];

    const allInvoices = data
        .filter((item: IGenericRecord) => item.invoices.length)
        .map((product: IGenericRecord) => product.invoices)
        .flat();

    const includesBatches = allInvoices.some((invoice: IGenericRecord) => invoice.batch_name);

    const allSameWarehouseId = allInvoices.every(
        (invoice: IGenericRecord) => invoice.warehouse_id === invoicesFirstProduct?.warehouse_id
    );

    const modalContent = allSameWarehouseId ? (
        ADD_INVENTORY.notDeletedInventory(
            invoicesFirstProduct?.product_name,
            invoicesFirstProduct?.warehouse_name,
            allInvoices,
            includesBatches
        )
    ) : (
        <TableModal data={allInvoices} includesBatches={includesBatches} />
    );

    return (
        <ModalCustom
            id={id}
            show={showModalError}
            showModal={closeModal}
            classesModal={allSameWarehouseId ? 'modal-custom__error-invoice-delete' : 'modal-custom__error-table-invoice'}
            classAdditional="z-40"
            removeMinWidth
            closeIcon={false}
        >
            {modalContent}
            <div className="flex gap-5.5 justify-center">
                <Button
                    id={`${id}-modal-error-delete-inventory-accept-btn`}
                    text="Aceptar"
                    onClick={accept}
                    classes="mt-7 xs:block bg-blue"
                />
            </div>
        </ModalCustom>
    );
};

export const TableModal: React.FC<IGenericRecord> = ({ data, includesBatches, id = '' }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full xs:p-11 xs:pb-0">
            <Icon id={`${id}-modal-table-info-ico`} name="triangleInfoMulticolor" className="w-22.2" />
            <h4 className="px-10 mt-2 ml-2 text-xl text-center text-blue font-allerbold leading-xl w-68">
                La {includesBatches ? 'bodega/lote' : 'bodega'} no se ha eliminado
            </h4>

            <p className="mt-2 mb-2 text-center text-gray-dark">
                La <span className="font-allerbold ">{`${includesBatches ? 'bodega/lote' : 'bodega'}`}</span> no se ha eliminado
                porque los productos/servicios se encuentran en un proceso pendiente de transmisión. Una vez se finalice este
                proceso pueden eliminar los productos/servicios.
            </p>
            <Table
                id={`${id}-modal-table-info-tbl`}
                wrapperClassName="max-h-52"
                isHeaderRowsCustom
                headerRowsCustom={
                    <tr className="bg-green-extraLight">
                        <th className="modal-custom__error-warehouse text-blue xs:h-8.75 h-10">
                            <p className="text-sm leading-tight font-allerbold">Bodega</p>
                        </th>
                        <th className="modal-delete__product text-blue xs:h-8.75 h-10">
                            <p className="text-sm leading-tight font-allerbold">Nombre del producto/servicio</p>
                        </th>
                        <th className="modal-custom__error-type-document text-blue xs:h-8.75 h-10">
                            <p className="text-sm leading-snug font-allerbold">Documento electrónico</p>
                        </th>
                    </tr>
                }
                customTable
                data={[]}
            >
                {data?.map((product: IGenericRecord, index: number) => (
                    <tr
                        key={`${product.id}-${index}`}
                        className={`${isEven(index) ? '' : 'bg-gray-smooth'} border-b border-gray`}
                    >
                        <td className="modal-custom__cell">
                            <p className="pl-2 text-sm">{product.warehouse_name}</p>
                        </td>
                        <td className="modal-custom__cell">
                            <p className="pl-2 text-sm">{product.product_name}</p>
                        </td>
                        <td className="modal-custom__cell">
                            <p className="pl-2 text-sm">{product.invoice_name}</p>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};

export const ModalWarningClientOrSupplier: React.FC<IModalWarningClientOrSupplierProps> = ({
    show,
    closeModal,
    editClient,
    isSupplier,
    documentTypes,
    keyDocumentType = 'name',
    dataClientOrSupplier: { name, person },
    id = '',
}) => {
    const { document_type, document_number, type_taxpayer_name, email } = person || {};
    const { TITLE, DESCRIPTION, TITLE_BUTTON } = isSupplier ? MODAL_WARNING_SUPPLIER : MODAL_WARNING_CLIENT;
    const documentTypeName = documentTypes?.find((item: IGenericRecord) => item.id === document_type) || {};

    const fields = [
        { label: '*Nombre del cliente', value: name },
        { label: '*Tipo de documento', value: documentTypeName[keyDocumentType] },
        { label: '*Número de documento', value: document_number },
        { label: '*Tipo de contribuyente', value: type_taxpayer_name },
        { label: '*Correo electrónico', value: email },
    ];

    return (
        <ModalCustom
            id={id}
            show={show}
            isTableModal
            removeMinWidth
            closeIcon={false}
            showModal={closeModal}
            classesModal="modal-duplicate"
        >
            <Icon id={`${id}-modal-warning-client-supplier-alert-ico`} name="alertMulticolor" classIcon="w-22.2" />
            <h4 className="modal-duplicate__title">{TITLE}</h4>
            <p className="modal-duplicate__description">{DESCRIPTION}</p>
            <fieldset className="modal-duplicate__group-input">
                {fields.map((field, index) => (
                    <TextInput
                        id={`${id}-modal-warning-client-supplier-input-txt`}
                        disabled
                        key={index}
                        labelText={field.label}
                        value={field.value || ''}
                        classesWrapper="w-73 xs:w-full"
                        classesWrapperInput="border_none"
                    />
                ))}
            </fieldset>
            <section className="flex mx-auto gap-7">
                <Button
                    id={`${id}-modal-warning-client-supplier-cancel-btn`}
                    onClick={closeModal}
                    text="Cancelar"
                    classes="shadow-card"
                />
                <Button
                    id={`${id}-modal-warning-client-supplier-custom-btn`}
                    onClick={editClient}
                    text={TITLE_BUTTON}
                    classes="shadow-card"
                />
            </section>
        </ModalCustom>
    );
};

export const ModalCodesBadRequest: React.FC<IModalBadRequest> = ({ show = false, showModal = (): void => {}, id = '' }) => {
    return (
        <ModalCustom
            closeIcon={false}
            show={show}
            showModal={showModal}
            classesModal="modal-code-bad-request "
            classesWrapper="modal-code-bad-request "
            id={id}
        >
            <div className="items-center -mt-6 text-center">
                <Icon id={`${id}-modal-code-bad-request-alert-ico`} name="alertMulticolor" className="w-22.2 h-22.2 m-auto" />
                <h1 className="w-full m-auto mt-2 mb-2 text-xl text-center text-blue">Ha ocurrido un error</h1>
                <div className="items-center text-center">
                    <p className="text-base text-gray-dark mb-7">
                        Comuníquese al correo <span className="font-bold text-purple">ventas@ccxc.co</span>
                    </p>
                </div>
                <div className="flex justify-center w-full xs:flex-col gap-y-2 gap-x-7">
                    <Button
                        id={`${id}-modal-code-bad-request-accept-btn`}
                        onClick={(): void => {
                            localStorage.removeItem(MODAL_BAD_REQUEST);
                            showModal();
                        }}
                        text={'Aceptar'}
                        classes="m-auto w-38 h-8.5"
                    />
                </div>
            </div>
        </ModalCustom>
    );
};
