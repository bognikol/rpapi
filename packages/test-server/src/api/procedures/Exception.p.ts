import { Handler, SuccessStatus } from "rpapi";

import { ERROR_MESSAGE } from "../../common";

export interface ExceptionRequest {
}

export interface ExceptionResponse {
    status: SuccessStatus;
}

export const Exception: Handler<ExceptionRequest, ExceptionResponse> = 
async (request: ExceptionRequest, token: string) => {
    throw new Error(ERROR_MESSAGE);
};
