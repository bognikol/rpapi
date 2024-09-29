import { Handler, SuccessStatus } from "rpapi";

export interface LoopbackRequest {
    f1: string;
    f2: number;
    f3: Array<string>;
    f4: {
        f5: string;
        f6: {
            f7: number;
        }
    }
}

export interface LoopbackResponse {
    status: SuccessStatus;
    token: string;
    data: any;
}

export const Loopback: Handler<LoopbackRequest, LoopbackResponse> = 
async (request: LoopbackRequest, token) => {
    return Promise.resolve({
        status: 200,
        token,
        data: request
    });
};
