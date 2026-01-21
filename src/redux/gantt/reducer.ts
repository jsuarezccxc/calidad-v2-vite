import { Task } from 'gantt-task-react';
import { ActionKeys, GanttActions } from './types';

interface ICalendar {
    tasks: Task[];
}

const initialState = {
    tasks: [],
};

export const reducer = (state: ICalendar = initialState, action: GanttActions): ICalendar => {
    switch (action.type) {
        case ActionKeys.SET_TASKS:
            return {
                ...state,
                tasks: action.payload,
            };
        default:
            return state;
    }
};
