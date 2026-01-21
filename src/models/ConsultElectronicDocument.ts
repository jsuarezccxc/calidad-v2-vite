import { IconsNames } from '@components/icon';

/**
 * This interface is structure document traceability
 *
 * @typeParam iconName: IconsNames - Icon to traceability
 * @typeParam label: JSX.Element - Label to traceability
 * @typeParam buttonLabel?: string - Optional name label to button
 * @typeParam tooltip?: { title: string; description: string | JSX.Element | undefined; } - Optional info to tooltip
 */
export interface IDocumentTraceabilityInformation {
    iconName: IconsNames;
    label: JSX.Element;
    buttonLabel?: string;
    tooltip?: {
        title: string;
        description: string | JSX.Element | undefined;
    };
}
