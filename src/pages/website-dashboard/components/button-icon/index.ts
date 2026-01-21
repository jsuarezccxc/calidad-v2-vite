import { ISimpleButtonProps } from '@components/button';
import { IconsNames } from '@components/icon';

export * from './ButtonIcon';

/**
 * Interface props from button icon props component
 *
 * @typeParam iconName: IconsNames - Icon name
 * @typeParam classIcon: string - Icon class names
 * @typeParam children: React.ReactNode - Content button
 */
export interface IButtonIconProps extends ISimpleButtonProps {
    iconName: IconsNames
    classIcon?: string
    children: React.ReactNode
}
