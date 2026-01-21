import styled, { CSSObject } from '@emotion/styled';
import { IGenericRecord } from '@models/GenericRecord';
import { createStyle } from '@utils/WebsiteNode';

export * from './Banner';

/**
 * Banner wrapper made with styled components
 */
export const Wrapper = styled.div<{ style: IGenericRecord; hasBackground: boolean }>`
    .title {
        ${({ style: { title } }): CSSObject => createStyle(title)}
    }

    .description {
        ${({ style: { description } }): CSSObject => createStyle(description)}
    }

    .card {
        &__bg {
            ${({ style: { card } }): CSSObject => ({ background: card?.background })}
        }

        &__product {
            &-name {
                ${({ style: { productName } }): CSSObject => createStyle(productName)}
            }

            &-value {
                ${({ style: { productValue, productName }, hasBackground }): CSSObject =>
                    createStyle(hasBackground ? productName : productValue)}
            }
        }
    }
`;
