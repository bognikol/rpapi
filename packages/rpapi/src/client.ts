import { Rp, RpSuccessResponse } from "./index";

function generateRpUrl(apiBaseUrl: string, endpointName: string): string {
    return new URL(`/rpapi/${endpointName}`, apiBaseUrl).toString();
}

export type GetTokenFunc = () => Promise<string>;

export function createRpClientStub<TRequest, TResponse extends RpSuccessResponse>(apiBaseUrl: string, getToken: GetTokenFunc, rpName: string):
    Rp<TRequest, TResponse> {
    return async (request: TRequest) => {
        try {
            let rpUrl = generateRpUrl(apiBaseUrl, rpName);

            let response = await fetch(rpUrl, {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: await getToken()
                }
            });
        
            let jsonResponse = await response.json();
        
            return jsonResponse;
        } catch (err) {
            return Promise.resolve({
                status: 0,
                message: `There was a client error while handling response. ${err}`            
            });
        }

    };
}
