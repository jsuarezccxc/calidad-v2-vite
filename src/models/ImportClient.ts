/**
 * This interface represents the structure of a client to be imported.
 * 
 * @typeParam document_type: string - The type of document.
 * @typeParam document_number: string - The document number of the client.
 * @typeParam document_type_name: string - The name of the document type.
 * @typeParam document_type_code?: string - Optional code for the document type.
 */
export interface IConsultClient {
    document_type: string;
    document_number: string;
    document_type_name: string;
    document_type_code?: string;
}

/**
 * This interface represents the response structure for a client consultation.
 * 
 * @typeParam name: string - The name of the client.
 * @typeParam document_number: number - The document number of the client.
 * @typeParam document_type: string - The type of document (e.g., ID, passport).
 * @typeParam client_id: string | null - The unique identifier for the client, if available.
 * @typeParam person_id: string | null - The unique identifier for the person, if available.
 * @typeParam email: string - The email address of the client.
 * @typeParam state_person: string - The state of the person (e.g., active, inactive).
 */
export interface IConsultClientResponse {
    name: string;
    document_number: number;
    document_type: string;
    client_id: string | null;
    person_id: string | null;
    email: string;
    state_person: string;
}
