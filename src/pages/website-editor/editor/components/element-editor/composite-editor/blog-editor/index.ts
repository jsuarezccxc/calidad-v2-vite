import { IGenericRecord } from '@models/GenericRecord';

export * from './BlogEditor';

/**
 * Data of fields
 */
export const ARTICLE_FIELDS: IGenericRecord[] = [
    {
        name: 'name',
        placeholder: 'Agregar nombre o título del artículo',
        labelText: 'Nombre artículo:',
        classesWrapper: 'w-full mt-4',
    },
    {
        name: 'synthesis',
        placeholder: 'Agregar síntesis del artículo',
        labelText: 'Síntesis del artículo:',
        classesWrapper: 'w-full mt-4',
    },
    {
        name: 'author',
        placeholder: 'Agregar autor del artículo',
        labelText: 'Autor del artículo:',
        classesWrapper: 'w-full mt-4',
    },
];

/**
 * Data of reference
 */
export const reference = {
    name: 'reference',
    placeholder: 'Agregar referencia bibliográfica',
    labelText: 'Referencia bibliográfica:',
    classesWrapper: 'w-full mt-4 mb-2',
    classesInput: 'text-gray-dark',
};

/**
 * Image constant
 */
export const IMAGE = 'image';

/**
 * number of article constant
 */
export const NUMBER_OF_ARTICLES = 'numberOfArticles';

/**
 * article to edit constant
 */
export const ARTICLE_TO_EDIT = 'articleToEdit';
