import styled, { CSSObject } from '@emotion/styled';
import { createStyle } from '@utils/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';

export * from './Blog';

/**
 * Header wrapper made with styled components
 */
export const BlogWrapper = styled.article<{ style: IGenericRecord }>`
    .blog {
        &__action-button {
            ${({ style: { action } }): CSSObject => createStyle(action)};
        }
        &__content-title {
            ${({ style: { articles } }): CSSObject => createStyle(articles)};
        }

        &__content-author {
            ${({ style: { author } }): CSSObject => createStyle(author)};
        }
    }
`;

/**
 * Not found constant
 */
export const NOT_FOUND = 'Not found';
