import { IGenericRecord } from '@models/GenericRecord';

export { DetailButton, ToggleSwitch } from './buttons';
export { ElectronicDocuments } from './electronic-documents';
export { Website } from './website';
export { Soon } from './soon';

/**
 * This returns the index of the active submodule
 *
 * @param submodules: IGenericRecord[] - List of submodules
 * @returns number
 */
export const getActiveIndex = (submodules: IGenericRecord[]): number => submodules.findIndex(submodules => submodules?.isActive);
