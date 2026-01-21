/**
 * This enum is key event DIAN
 */
export enum TypeEventDian {
    CLAIM_FE = 'CLAIM_FE',
    NO_EVENTS = 'NO_EVENTS',
    ACCUSE_RECEIVE_FE = 'ACCUSE_RECEIVE_FE',
    ACCUSE_RECEIVE_BS = 'ACCUSE_RECEIVE_BS',
    ACCEPTANCE_CLAIM = 'ACCEPTANCE_CLAIM',
    ACCEPTATION_TACITA = 'ACCEPTATION_TACITA',
    ACCEPTATION_EXPRESS = 'ACCEPTATION_EXPRESS',
}

/**
 * Const for type events DIAN Label
 */
export const TYPE_EVENT_DIAN_LABEL: { [key: string]: string } = {
    [TypeEventDian.CLAIM_FE]: 'Reclamo',
    [TypeEventDian.NO_EVENTS]: 'Sin evento',
    [TypeEventDian.ACCUSE_RECEIVE_FE]: 'Recibo documento',
    [TypeEventDian.ACCEPTATION_EXPRESS]: 'Aceptación expresa',
    [TypeEventDian.ACCEPTANCE_CLAIM]: 'Aceptación/Reclamo',
    [TypeEventDian.ACCUSE_RECEIVE_BS]: 'Recibo bienes/servicio',
    [TypeEventDian.ACCEPTATION_TACITA]: 'Aceptación tácita',
}
