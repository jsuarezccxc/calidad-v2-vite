export * from './ActiveDomainModal';

/**
 * Interface props from active domain modal component
 *
 * @typeParam show: boolean - State to show modal
 * @typeParam showModal: () => void - Action to change state
 * @typeParam onClick: () => void - Optional action click
 */
export interface IActiveDomainModalProps {
    show: boolean;
    showModal: () => void;
    onClick?: () => void;
}
