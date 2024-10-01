export type SuccessStatus = 200;

export type ErrorStatus = 0 | 400 | 401 | 403 | 404 | 500;

export type Status = SuccessStatus | ErrorStatus;

export interface RpSuccessResponse {
    status: SuccessStatus;
}

export interface RpErrorResponse {
    status: ErrorStatus;
    message: string;
}

export type Rp<TRequest, TResponse extends RpSuccessResponse> = 
    (request: TRequest) => Promise<TResponse | RpErrorResponse>;

export type Handler<TRequest, TResponse  extends RpSuccessResponse> =
    (request: TRequest, token?: string) => Promise<TResponse | RpErrorResponse>;
