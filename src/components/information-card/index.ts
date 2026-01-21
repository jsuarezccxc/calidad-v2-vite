export * from './InformationCard';

/**
 * Interface props from information card component
 *
 * @typeParam title: string - Optional title card
 * @typeParam description: React.ReactElement - React element to render inside component
 * @typeParam onClick: () => void - Action to redirect screen
 */
export interface IInformationCardProps {
    title?: string
    description: React.ReactElement
    onClick: () => void,
}
