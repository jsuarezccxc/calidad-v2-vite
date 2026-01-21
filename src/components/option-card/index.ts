import { IconsNames } from '@components/icon';

export * from './OptionCard';

/**
 * Interface props from option card component
 *
 * @typeParam icon: IconsNames - Icon name
 * @typeParam title: string - Title card
 * @typeParam description: string - Optional description card
 * @typeParam onClick: () => void - Action to click card
 * @typeParam completed: boolean - Optional validation to know if step was completed
 */
export interface IOptionCardProps {
    icon: IconsNames
    title: string
    description?: string
    onClick: () => void
    completed?: boolean
}
