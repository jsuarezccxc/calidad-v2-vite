import { IconsNames } from '@components/icon';

export * from './CardDatabase';

/**
 * This interface describe the element props
 *
 * @typeParam id: string - Id for recognize the card
 * @typeParam iconName: IconsNames - Require icon name
 * @typeParam title: string - Require title card
 * @typeParam color: string - Require color card
 * @typeParam textColor: string - Require color text card
 * @typeParam cardRoute: string - Require main route
 */
export interface ICardDatabaseProps {
    id: string;
    iconName: IconsNames;
    title: string;
    color: string;
    textColor: string;
    cardRoute: string;
}
