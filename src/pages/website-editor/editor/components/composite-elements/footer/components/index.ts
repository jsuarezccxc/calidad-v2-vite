import { IconsNames } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';

export * from './SocialNetworks';
export * from './Link';

/**
 * This interface describes the properties of SocialNetworks component
 *
 * @typeParam icon: IGenericRecord[] - Name of social network icon
 */
export interface ISocialNetworksProps {
    icon: IconsNames[];
}

/**
 * This interface describes the properties of the FooterLink component
 *
 * @typeParam links: IGenericRecord[] - Page links of website
 * @typeParam mobile: boolean - Prop for mobile styles
 */
export interface IFooterLinkProps {
    links: IGenericRecord[];
    mobile?: boolean;
}
