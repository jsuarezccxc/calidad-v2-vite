export enum ActionKeys {
    SHOW_LOADER = 'SHOW_LOADER',
    HIDE_LOADER = 'HIDE_LOADER',
}

export interface IShowLoader {
    type: ActionKeys.SHOW_LOADER,
}

export interface IHideLoader {
    type: ActionKeys.HIDE_LOADER,
}

export type LoaderActions = IShowLoader | IHideLoader;
