import { CSSObject } from '@emotion/react';
import styled from '@emotion/styled';
import { IGenericRecord } from '@models/GenericRecord';

export * from './Text';

/**
 * Carousel wrapper used to change styles dynamically
 */
export const Wrapper = styled.textarea<{ style: IGenericRecord }>`
    ${({ style }): CSSObject => style};
`;
