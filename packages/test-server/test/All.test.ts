import { ERROR_MESSAGE } from "../src/common";

import { RpErrorResponse } from "@bognikol/rpapi";
import { createRpapiClient, LoopbackRequest,
    LoopbackResponse, NewProcedureResponse } from "../src/api/.ag/client.ag";

const AUTH_TOKEN = "TKN";

const LOOPBACK_REQUEST: LoopbackRequest = {
    f1: "something",
    f2: 2,
    f3: ["1", "bla", "hey!"],
    f4: {
        f5: "bye",
        f6: {
            f7: 8
        }
    }
};

const rpapiClient = createRpapiClient("http://localhost:3000", () => Promise.resolve(AUTH_TOKEN));

it("Payload is properly loopbacked", async () => {
    const result = <LoopbackResponse>(await rpapiClient.Loopback(LOOPBACK_REQUEST));

    expect(result.status).toBe(200);
    expect(result.data).toEqual(LOOPBACK_REQUEST);
});

it("Authorization token is properly extracted on the server", async () => {
    const result = <LoopbackResponse>(await rpapiClient.Loopback(LOOPBACK_REQUEST));
    expect(result.status).toBe(200);
    expect(result.token).toEqual(AUTH_TOKEN);
});

it("Exception in handler makes 500 response with proper message", async () => {
    const result = <RpErrorResponse>(await rpapiClient.Exception({}));
    expect(result.status).toBe(500);
    expect(result.message).toBe(ERROR_MESSAGE);
});

it("New procedure is properly added", async () => {
    const result = <NewProcedureResponse>(await rpapiClient.NewProcedure({}));
    expect(result.status).toBe(200);
});
