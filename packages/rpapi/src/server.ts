import express from "express";

import { RpSuccessResponse, Handler } from "./index";

function registerRpHttpHandler<TRequest, TResponse extends RpSuccessResponse>
(app: express.Express, procedureName: string, handler: Handler<TRequest, TResponse>) {
    app.post(`/rpapi/${procedureName}`, express.json(), async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        
        try {
            res.json(await handler(req.body, req.headers["authorization"]));
        } catch (err) {
            res.status(500);
            console.log(err)
            res.json({ status: 500, message: (<Error>err).message });
        }
    });
}

export function registerRpServer<TRpDictionary>(app: express.Express, handlers: TRpDictionary) {
  Object.keys(handlers).forEach(key => registerRpHttpHandler(app, key, handlers[key as keyof TRpDictionary] as Handler<any, any>));
}
