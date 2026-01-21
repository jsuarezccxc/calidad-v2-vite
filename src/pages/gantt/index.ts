import { Task } from 'gantt-task-react';
import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { IGenericRecord } from '@models/GenericRecord';

export { default } from './Gantt';

/**
 * Modal types
 */
export enum MODALS {
    DELETE = 'delete',
    SUCCESS = 'success',
    TASK = 'task',
}

/**
 * Task dates
 */
export enum DATES {
    START = 'start',
    END = 'end',
}

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.PLANNING_AND_ORGANIZATION_MENU),
        route: getRoute(Routes.PLANNING_AND_ORGANIZATION_MENU),
    },
    {
        name: getRouteName(Routes.GANTT),
        route: getRoute(Routes.GANTT),
    },
];

/**
 * Function that returns task with the formatted dates
 *
 * @param tasks: Task[] - Task list
 * @returns Task[]
 */
export const formatTaskDates = (tasks: Task[]): Task[] => {
    return tasks.map(({ end, start, ...item }: Task) => ({ ...item, end: new Date(end), start: new Date(start) }));
};

/**
 * Function that returns a new task
 *
 * @param task: Task - Object used to create a new task
 * @returns IGenericRecord
 */
export const getNewTask = (task: Task): IGenericRecord => {
    const newTask: IGenericRecord = { ...taskModel };
    taskKeys.forEach(key => (newTask[key] = task[key]));
    return newTask;
};

/**
 * Model used to create a new task
 */
export const taskModel: Task = {
    start: new Date(),
    end: new Date(),
    name: '',
    id: '1460',
    type: 'task',
    progress: 0,
    isDisabled: false,
    styles: {
        progressColor: '#0B2C4C',
        backgroundColor: '#CCC',
        backgroundSelectedColor: '#CCC',
        progressSelectedColor: '#0B2C4C',
    },
};

/**
 * Keys used to create a new task
 */
export const taskKeys: (keyof Task)[] = ['start', 'end', 'name', 'id', 'type', 'progress', 'isDisabled', 'styles'];

/**
 * Gantt modals
 */
export const ganttModals = {
    delete: false,
    success: false,
    task: false,
};

/**
 * Static props of the diagram used for configuration
 */
export const staticDiagramProps = {
    arrowColor: 'gray',
    locale: 'es-CO',
};
