import { Task } from '@pages/gantt/components/GanttTypes';

export enum ActionKeys {
    SET_TASKS = 'SET_TASKS',
}

export interface ISetTasks {
    type: ActionKeys.SET_TASKS;
    payload: Task[];
}

export type GanttActions = ISetTasks;
