import React from 'react';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { DatePickerDayInput, TextInput } from '@components/input';
import { getUnix } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { DATES } from '..';
import { Slider, ITaskFormProps } from '.';

export const TaskForm: React.FC<ITaskFormProps> = ({
    deleteTask,
    handleChangeDate,
    onSubmit,
    showModal,
    setTask,
    task,
    toggleModal,
    updateTask,
    validateForm,
}) => {
    const { disabledInputs } = usePermissions();
    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.GANTT,
                submodule: `task-form`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={showModal}
            showModal={toggleModal}
            classesWrapper="modal--full"
            classesModal="modal--full"
        >
            <form className="gantt__task-form" onSubmit={onSubmit}>
                <h3 className="w-10/12 w-full text-xl text-center text-blue font-allerbold">
                    {updateTask ? 'Editar' : 'Agregar'} tarea
                </h3>
                <section className="my-4.5 flex flex-col gap-2.5">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.GANTT,
                            submodule: `task-form-name`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Nombre:"
                        classesWrapper="w-full"
                        placeholder="Agregar nombre o título de la tarea"
                        name="name"
                        onChange={({ target }): void => setTask({ ...task, [target.name]: target.value })}
                        value={task.name}
                        required={validateForm && !task.name}
                        disabled={disabledInputs}
                    />
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.GANTT,
                            submodule: `task-form-initial-date`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Fecha inicial:"
                        classesWrapper="w-full"
                        classesWrapperInput="gantt__date-picker"
                        onChangeDate={(date): void => handleChangeDate(date, DATES.START)}
                        selected={getUnix(task.start)}
                        disabled={disabledInputs}
                    />
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.GANTT,
                            submodule: `task-form-end-date`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Fecha final:"
                        classesWrapper="w-full"
                        classesWrapperInput="gantt__date-picker"
                        onChangeDate={(date): void => handleChangeDate(date, DATES.END)}
                        selected={getUnix(task.end)}
                        disabled={disabledInputs}
                    />
                    <Slider task={task} setTask={setTask} disabled={disabledInputs} />
                </section>
                <div className="flex justify-center gap-4.5">
                    <Button
                        id={generateId({
                            module: ModuleApp.GANTT,
                            submodule: `task-form`,
                            action: updateTask ? ActionElementType.UPDATE : ActionElementType.SAVE,
                            elementType: ElementType.BTN,
                        })}
                        text={updateTask ? 'Actualizar' : 'Guardar'}
                        onClick={onSubmit}
                        disabled={disabledInputs}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.GANTT,
                            submodule: `task-form`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text="Atrás"
                        onClick={toggleModal}
                        classes="block lg:hidden"
                    />
                    {updateTask && (
                        <Button
                            id={generateId({
                                module: ModuleApp.GANTT,
                                submodule: `task-form`,
                                action: ActionElementType.DELETE,
                                elementType: ElementType.BTN,
                            })}
                            text="Eliminar"
                            onClick={deleteTask}
                            disabled={disabledInputs}
                        />
                    )}
                </div>
            </form>
        </ModalCustom>
    );
};
