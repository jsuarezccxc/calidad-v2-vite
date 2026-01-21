import { IShowLoader, IHideLoader, ActionKeys } from './types';

export const showLoader = (): IShowLoader => ({
    type: ActionKeys.SHOW_LOADER,
});

export const hideLoader = (): IHideLoader => ({
    type: ActionKeys.HIDE_LOADER,
});
