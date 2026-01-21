import { v4 as uuid } from 'uuid';
import { FontName, FontVariant } from '@constants/WebsiteNode';

/**
 * Catalog filters
 */
export enum Filter {
    DATE = 'Ordenar según la fecha en la que se agregó',
    PRICE_RANGE = 'Rango de precio',
    VALUE = 'Ordenar por valor',
}

/**
 * Default price range  example
 */
export const DEFAULT_PRICE_RANGE = { min: 0, max: 20000, id: uuid() };

/**
 * constant with filling
 */
export const WITH_FILLING = 'Con relleno';

/**
 * constant unfilled
 */
export const UNFILLED = 'Sin relleno';

/**
 * Tool options
 */
export const OPTIONS = {
    FONT_FAMILY: [
        FontName.Aller,
        FontName.Montserrat,
        FontName.Roboto,
        FontName.OpenSans,
        FontName.Lato,
        FontName.Barlow,
        FontName.FiraSans,
        FontName.Epilogue,
        FontName.Archivo,
        FontName.LibreFranklin,
        FontName.Raleway,
        FontName.Poppins,
        FontName.AlegreyaSans,
        FontName.BigShoulder,
        FontName.BodoniModa,
        FontName.Cabin,
        FontName.Cinzel,
        FontName.CormorantGaramond,
        FontName.CourierPrime,
        FontName.CrimsonPro,
        FontName.DancingScript,
        FontName.DynaPuff,
        FontName.Exo,
        FontName.Fredoka,
        FontName.Manrope,
        FontName.Mulish,
        FontName.PlayfairDisplay,
        FontName.Quicksand,
        FontName.Rubik,
        FontName.SpaceMono,
        FontName.SpectralSC,
        FontName.ZillaSlab,
    ],
    FONT_WEIGHT: Object.values(FontVariant),
    FONT_SIZE_TEXT_FIELDS: ['7', '10', '11', '12', '13', '14', '15', '16', '20', '22', '24'],
    FONT_SIZE_TEXT_TOOLS: Array.from({ length: 66 }, (_, i) => String(i + 7)),
    BORDER: ['Sin borde', 'Bordes redondeados', 'Bordes semiredondeados', 'Bordes semicuadrados', 'Bordes cuadrados'],
    TURN: ['Derecha', 'Izquierda', 'Arriba', 'Abajo'],
    PAGES: ['Inicio', 'Quienes somos', 'Catalogo'],
    FILLING: [WITH_FILLING, UNFILLED],
    PAGINATOR_ITEMS: ['3', '6', '9', '12', '15', '18'],
    ORDERING: ['Agregados del más antiguo al más reciente', 'Agregados del más reciente al más antiguo'],
    FILTERS: [Filter.PRICE_RANGE, Filter.VALUE, Filter.DATE],
    FORM_FIELDS: ['Texto corto', 'Párrafo', 'Número', 'Correo electrónico'],
};

/**
 * Maps fonts to the list of unsupported font variants
 */
export const INCOMPLETE_FONTS: Record<string, FontVariant[]> = {
    [FontName.BigShoulder]: [FontVariant.Italic, FontVariant.BoldItalic],
    [FontName.Cinzel]: [FontVariant.Italic, FontVariant.BoldItalic],
    [FontName.DancingScript]: [FontVariant.Italic, FontVariant.BoldItalic],
    [FontName.DynaPuff]: [FontVariant.Italic, FontVariant.BoldItalic],
    [FontName.Fredoka]: [FontVariant.Italic, FontVariant.BoldItalic],
    [FontName.Manrope]: [FontVariant.Italic, FontVariant.BoldItalic],
    [FontName.Quicksand]: [FontVariant.Italic, FontVariant.BoldItalic],
};

/**
 * Represents the identifier for the logo.
 */
export const LOGO = 'logo';

/**
 * Font styles in select bold
 */
export const FONT_STYLES: string[] = ['italic', 'Bold italic'];
