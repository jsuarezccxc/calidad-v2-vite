import React, { useContext, useEffect, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { NumberInput, SelectInput, TextInput } from '@components/input';
import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { INVOICE_TYPE } from '@constants/InvoiceType';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { NumberRangeContext } from '../context';
import { HeaderColumn } from './HeaderColumn';
import { MAXIMUM_LENGTH_FIELDS, OPTIONS_PREFIX } from '..';
import { HEADER_MODAL_COLUMNS } from '.';

export const Modals: React.FC = React.memo(() => {
    const {
        handleModalSync,
        syncModal,
        handleModalSynchronize,
        synchronizeModal,
        unssignedRange,
        handleSetTypeUnssignedPrefix,
        saveTypePrefix,
        getSynchronizeNumberRanges,
    } = useContext(NumberRangeContext);

    const [isValidateTable, setIsValidateTable] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

    const someNeedValidate = useMemo(() => unssignedRange.every(prefix => prefix.type === INVOICE_TYPE.UNASSIGNED), [
        unssignedRange,
    ]);

    useEffect(() => {
        if (!syncModal) setIsValidateTable(false);
    }, [syncModal]);

    const validatePrefixUpdate = (): boolean => {
        if (someNeedValidate) setIsValidateTable(true);
        return someNeedValidate;
    };

    const handleOpenConfirmationModal = (): void => {
        if (!validatePrefixUpdate()) {
            handleModalSync(false, true);
            setOpenConfirmationModal(true);
        }
    };

    const handleConfirmUpdate = async (): Promise<void> => {
        setOpenConfirmationModal(false);
        if (await saveTypePrefix()) getSynchronizeNumberRanges();
    };

    const handleCancelUpdate = async (): Promise<void> => {
        setOpenConfirmationModal(false);
        handleModalSync(false);
    };

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.MODALS}-number-range-synchronize`,
                    action: ActionElementType.SUCCESS,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => handleModalSynchronize(!synchronizeModal)}
                open={synchronizeModal}
            >
                <div className="success-modal">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl text-center leading-xl text-blue font-allerbold w-65">Información sincronizada</p>
                    <p className="text-base text-center text-gray-dark">Su información ha sido sincronizada con éxito!</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.MODALS}-number-range-synchronize-${ActionElementType.SUCCESS}`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handleModalSynchronize(!synchronizeModal)}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.MODALS}-number-range-synchronize`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => handleModalSync(false)}
                open={syncModal}
            >
                <div className="modal-prefix">
                    <Icon name="warning" className="mb-4.5 icon-warning" />
                    <p className="mb-2 text-xl text-center leading-xl text-blue font-allerbold">
                        Sincronizar rangos de numeración
                    </p>
                    <p className="mb-2 text-base text-center text-gray-dark">
                        Asocie el número de resolución y el prefijo al documento electrónico de acuerdo al tipo de facturación
                        seleccionado en la plataforma de DIAN
                    </p>
                    <Table
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.MODALS}-number-range-synchronize`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        isHeaderRowsCustom
                        headerRowsCustom={
                            <tr>
                                {HEADER_MODAL_COLUMNS.map(header => (
                                    <HeaderColumn key={uuid()} {...header} />
                                ))}
                            </tr>
                        }
                        fieldsBody={[]}
                        data={[]}
                        editable={false}
                        customTable
                        className="table-modal-prefix border-b-1 border-gray"
                        isNew
                        wrapperClassName="table-modal-prefix__container"
                    >
                        {unssignedRange.map(row => (
                            <tr
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.MODALS}-number-range-synchronize-${row.id}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={row.id}
                            >
                                <td className="h-10 field-body border-b-1 border-gray">
                                    <SelectInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `${ModuleApp.MODALS}-number-range-synchronize-${row.id}-prefix`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        options={OPTIONS_PREFIX}
                                        value={
                                            row.type === INVOICE_TYPE.UNASSIGNED
                                                ? ''
                                                : OPTIONS_PREFIX.find(option => row.type === option.key)?.value
                                        }
                                        optionSelected={(option): void => handleSetTypeUnssignedPrefix(option, row)}
                                        selectIconType="arrowDownGreen"
                                        placeholder="Seleccionar"
                                        isNew
                                        isTable
                                    />
                                </td>
                                <td className="h-10 field-body--uneditable border-b-1 border-gray">
                                    <TextInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `${ModuleApp.MODALS}-number-range-synchronize-${row.id}-prefix-value`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        disabled
                                        type="text"
                                        classesWrapper=""
                                        value={row?.prefix}
                                        classesWrapperInput="w-fix"
                                        classesInput="text-left text-gray"
                                        maxLength={MAXIMUM_LENGTH_FIELDS.PREFIX}
                                    />
                                </td>
                                <td className="h-10 field-body--uneditable border-b-1 border-gray">
                                    <NumberInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `${ModuleApp.MODALS}-number-range-synchronize-${row.id}-resolution-number`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        maxLength={MAXIMUM_LENGTH_FIELDS.RESOLUTION_NUMBER}
                                        value={row.resolution_number ?? '-'}
                                        classesInput="text-left text-gray"
                                        classesWrapperInput="w-fix"
                                        classesWrapper=""
                                        disabled
                                    />
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {isValidateTable && someNeedValidate && (
                        <span className="w-full text-base text-left text-purple">
                            *Asocie mínimo un tipo de facturación para hacer la sincronización.
                        </span>
                    )}
                    <div className="flex justify-center w-full gap-7 mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.MODALS}-number-range-synchronize`,
                                action: ActionElementType.CANCEL,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handleModalSync(false)}
                            text="Cancelar"
                            classes="shadow-templateDesign"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.MODALS}-number-range-synchronize`,
                                action: ActionElementType.SYNC,
                                elementType: ElementType.BTN,
                            })}
                            onClick={handleOpenConfirmationModal}
                            text="Sincronizar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.MODALS}-assign-prefix`,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => setOpenConfirmationModal(!openConfirmationModal)}
                open={openConfirmationModal}
            >
                <div className="modal-confirmation">
                    <Icon name="warning" className="mb-2.5 icon-warning" />
                    <p className="mb-2.5 text-xl text-center leading-xl text-blue font-allerbold w-65">Confirmación</p>
                    <p className="mb-2.5 text-base text-center text-gray-dark">
                        ¿Está seguro de asignar los Prefijos a los Tipo de facturación seleccionados?
                    </p>
                    <div className="flex flex-row justify-center w-full gap-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.MODALS}-assign-prefix`,
                                action: ActionElementType.CANCEL,
                                elementType: ElementType.BTN,
                            })}
                            onClick={handleCancelUpdate}
                            text="Cancelar"
                            classes="shadow-templateDesign"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.MODALS}-assign-prefix`,
                                action: ActionElementType.CONFIRM,
                                elementType: ElementType.BTN,
                            })}
                            onClick={handleConfirmUpdate}
                            text="Confirmar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
});
