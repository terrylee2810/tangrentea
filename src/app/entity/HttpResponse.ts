export interface Response {
    Errors: Message[];
    Warnings: Message[];
    Confirmations: Message[];
    Informations: Message[];
    Exception: any;
    Data: any;
    ProcessingStatus: boolean;
}

export interface PageResponse {
    totalCount: number;
    dataSet: [];
}

export interface PageErrorResponse {
    Message: string;
    ExceptionMessage: string;
    ExceptionType: string;
    StackTrace: string;
}

export interface Message {
    Type: Type;
    Code: string;
    Description: string;
    Field: string;
}

export enum Type {
    Error,
    Warning,
    Information,
    Confirmation
}

export enum MESSAGETYPE {
    Success,
    Error,
    Warning,
    Exception
}
