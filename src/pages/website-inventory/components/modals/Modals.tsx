import React, { useContext } from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { ModalCustom, ModalErrorDeleteInventory } from '@components/modal-custom';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';

const Modals: React.FC = () => {
    const {
        showSaveSuccess,
        showConfirmDeleteModal,
        handleShowModalSuccess,
        handleShowConfirmDeleteModal,
        handleTrash,
        nonRemovableInventory,
        showModalErrorDelete,
        toggleModalErrorDelete,
        closeModalErrorDelete,
        includesBatchesToDelete,
        showPerishableModal,
        togglePerishableModal,
        handleChangeIsPerishable,
    } = useContext(WebsiteInventoryContext);

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    submodule: `${ModuleApp.MODALS}-inventory-success`,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => handleShowModalSuccess()}
                open={showSaveSuccess}
            >
                <div className="success-modal">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">
                        Información Guardada
                    </p>
                    <p className="text-base text-center text-gray-dark">¡Su información ha sido guardada con éxito!</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.INVENTORY_MOVEMENTS,
                                submodule: `${ModuleApp.MODALS}-inventory-success`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handleShowModalSuccess()}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    submodule: `${ModuleApp.MODALS}-inventory`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => handleShowConfirmDeleteModal()}
                open={showConfirmDeleteModal}
            >
                <div className="delete-modal">
                    <Icon name="recycleBin" className="w-22.2 h-22.2 mb-2" />
                    <p className="mb-2 text-xl font-bold text-blue font-allerbold">{`Eliminar ${
                        includesBatchesToDelete ? 'lote' : 'bodega'
                    }`}</p>
                    <p className="text-base text-center text-gray-dark">
                        ¿Está seguro que desea eliminar la información seleccionada?
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.INVENTORY_MOVEMENTS,
                                submodule: `${ModuleApp.MODALS}-inventory-delete`,
                                action: ActionElementType.CANCEL,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handleShowConfirmDeleteModal()}
                            text="Cancelar"
                            classes="mr-6"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.INVENTORY_MOVEMENTS,
                                submodule: `${ModuleApp.MODALS}-inventory`,
                                action: ActionElementType.DELETE,
                                elementType: ElementType.BTN,
                            })}
                            text="Eliminar"
                            onClick={handleTrash}
                        />
                    </div>
                </div>
            </Modal>
            <ModalErrorDeleteInventory
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.MDL,
                })}
                data={nonRemovableInventory}
                showModalError={showModalErrorDelete}
                closeModal={toggleModalErrorDelete}
                accept={closeModalErrorDelete}
            />
            <ModalCustom
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    submodule: `${ModuleApp.MODALS}-inventory-perishable`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={showPerishableModal}
                showModal={(): void => {}}
                removeMinWidth
                classesModal="information-modal"
            >
                <Icon name="alertMulticolor" className="w-20" />
                <h4 className="mt-2 text-xl font-allerbold">Información</h4>
                <p className="mt-2 text-base text-center font-aller">
                    Tenga en cuenta que el cambio en la columna <span className="text-base font-allerbold">‘perecedero’</span> se
                    reflejara en las de mas variantes del producto.
                </p>
                <div className="flex gap-7 mt-7">
                    <Button
                        id={generateId({
                            module: ModuleApp.INVENTORY_MOVEMENTS,
                            submodule: `${ModuleApp.MODALS}-inventory-perishable`,
                            action: ActionElementType.CANCEL,
                            elementType: ElementType.BTN,
                        })}
                        text="Cancelar"
                        onClick={togglePerishableModal}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.INVENTORY_MOVEMENTS,
                            submodule: `${ModuleApp.MODALS}-inventory-perishable`,
                            action: ActionElementType.ACCEPT,
                            elementType: ElementType.BTN,
                        })}
                        text="Aceptar"
                        onClick={handleChangeIsPerishable}
                    />
                </div>
            </ModalCustom>
        </>
    );
};

export default Modals;
