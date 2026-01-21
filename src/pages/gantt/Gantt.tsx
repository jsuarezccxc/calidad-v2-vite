import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GanttChart, Task, ViewMode } from './components';
import { TitleButtons } from '@constants/Buttons';
import { Routes } from '@constants/Paths';
import { LANGUAGE_KEY } from '@constants/Translate';
import { BreadCrumb } from '@components/bread-crumb';
import { Button } from '@components/button';
import { Information } from '@components/information';
import { ModalType } from '@components/modal-custom';
import { PageTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { DESCRIPTION } from '@information-texts/Gantt';
import { getRouteName } from '@utils/Paths';
import { getRouteKey } from '@utils/Translation';
import { remToPx } from '@utils/Size';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { getTasks, postTask, deleteTask as deleteGanttItem, updateTasks as updateGanttTasks } from '@redux/gantt/actions';
import { RootState } from '@redux/rootReducer';
import useButtonProps from '@hooks/useButtonProps';
import useModalProps from '@hooks/useModalProps';
import usePermissions from '@hooks/usePermissions';
import useModal from '@hooks/useModal';
import { TaskListHeader, TaskTooltip, TaskForm, TaskListTable, ViewModes } from './components';
import { formatTaskDates, ganttModals, getNewTask, routes, staticDiagramProps, taskModel, DATES, MODALS } from '.';
import './Gantt.scss';

const Gantt: React.FC = () => {
    const dispatch = useDispatch();
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { getButtonProps } = useButtonProps();
    const { tasks: taskList } = useSelector((state: RootState) => state.gantt);
    const { disabledInputs } = usePermissions();

    const [task, setTask] = useState<Task>(taskModel);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [updateTask, setUpdate] = useState<boolean>(false);
    const [validateForm, setValidateForm] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

    const { modals, toggleModal } = useModal(ganttModals);
    const { saveModal } = useModalProps({
        showModal: modals.success,
        toggleModal: (): void => toggleModal(MODALS.SUCCESS),
        moduleId: ModuleApp.GANTT,
    });

    useEffect(() => {
        dispatch(getTasks());
    }, []);

    useEffect(() => setTasks(formatTaskDates(taskList)), [taskList]);

    const addTask = (): void => {
        setUpdate(false);
        toggleModal(MODALS.TASK);
    };

    const deleteTask = (): void => {
        dispatch(deleteGanttItem(task.id));
        toggleModal(MODALS.TASK);
        setTask(taskModel);
    };

    const editTask = (): void => {
        setTasks(tasks.map(item => (item.id === task.id ? task : item)));
        toggleModal(MODALS.TASK);
    };

    const handleChangeDate = (date: Date, name: string): void => {
        if (name === DATES.START) {
            if (date > task.end) return setTask({ ...task, [name]: date, end: date });
        }
        setTask({ ...task, ...(date < task.start && { start: date }), [name]: date });
    };

    const createTask = async (): Promise<void> => {
        if (!task.name) return setValidateForm(true);
        if (updateTask) return editTask();
        const isCorrectResponse = Boolean(await dispatch(postTask(getNewTask(task))));
        toggleModal(isCorrectResponse ? MODALS.SUCCESS : MODALS.TASK);
        setValidateForm(false);
        setTask(taskModel);
    };

    const selectTask = (task: Task): void => {
        setTask(task);
        setUpdate(true);
        toggleModal(MODALS.TASK);
    };

    const toggleTaskForm = (): void => {
        toggleModal(MODALS.TASK);
        setTask(taskModel);
    };

    const updateTasks = async (): Promise<void> => {
        const isCorrectResponse = Boolean(await dispatch(updateGanttTasks(tasks.map(item => getNewTask(item)))));
        if (isCorrectResponse) toggleModal(MODALS.SUCCESS);
    };

    const [yearColumn, otherColumn, rowHeight] = useMemo(() => {
        return [remToPx(21.875), remToPx(12.5), remToPx(3.125)];
    }, [document.body.clientWidth]);

    return (
        <div className="gantt">
            <div className="flex-1">
                <PageTitle title={getRouteName(Routes.PLANNING_AND_ORGANIZATION_MENU)} />
                <BreadCrumb routes={routes()} />
                <Information title={translate(getRouteKey(Routes.GANTT))} description={DESCRIPTION} />
                <div className="flex items-center mb-4 xl:justify-between xl:flex-row mt-7">
                    <Button
                        id={generateId({
                            module: ModuleApp.GANTT,
                            submodule: `task`,
                            action: ActionElementType.ADD,
                            elementType: ElementType.BTN,
                        })}
                        onClick={addTask}
                        disabled={disabledInputs}
                        text="+ Agregar tarea"
                    />
                    <ViewModes setViewMode={setViewMode} viewMode={viewMode} />
                </div>
                {!!tasks.length && (
                    <GanttChart
                        columnWidth={viewMode === ViewMode.Year ? yearColumn : otherColumn}
                        tasks={tasks}
                        {...(!disabledInputs && {
                            onDateChange: (item): void => setTasks(tasks.map(task => (task.id === item.id ? item : task))),
                            onDoubleClick: (task): void => selectTask(task),
                        })}
                        fontSize=".875rem"
                        headerHeight={rowHeight}
                        rowHeight={rowHeight}
                        TooltipContent={TaskTooltip}
                        TaskListHeader={TaskListHeader}
                        TaskListTable={TaskListTable}
                        viewMode={viewMode}
                        {...staticDiagramProps}
                    />
                )}
                {modals.task && (
                    <TaskForm
                        deleteTask={deleteTask}
                        handleChangeDate={handleChangeDate}
                        onSubmit={createTask}
                        setTask={setTask}
                        task={task}
                        toggleModal={toggleTaskForm}
                        showModal={modals.task}
                        updateTask={updateTask}
                        validateForm={validateForm}
                    />
                )}
            </div>
            <PageButtonsFooter
                disabledRight={disabledInputs}
                {...getButtonProps({
                    moduleId: ModuleApp.GANTT,
                    onClickButtonRight: updateTasks,
                    permissions: { name: Routes.GANTT, moduleName: Routes.PLANNING_AND_ORGANIZATION_MENU },
                    rightText: TitleButtons.SAVE,
                })}
            />
            <ModalType {...saveModal} />
        </div>
    );
};

export default Gantt;
