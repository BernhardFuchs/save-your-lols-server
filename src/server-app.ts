import * as express from 'express';
import * as http from 'http';
import { Application, Request, Response } from 'express';

import { IncomingMessage } from 'http';

export class ServerApp {
    
    app: Application;
    
    constructor () {
        this.app = express();
        this.configureRoutes();
    }
    
    private configureRoutes() {

        // Root Route
        const rootPath: string | RegExp | (string | RegExp)[] = '/';
        this.app.route(rootPath).get((req, res, next) => {
            console.log(`Root Path: ${rootPath}`);
            res.json({
                message: 'Hello from Server'
            });
            next();
        });
        
        // Random Lol Route
        const randomPath: string | RegExp | (string | RegExp)[] = '/random';
        this.app.route(randomPath).get((req: Request, resToClient: Response) => {
            console.log(`Random Path: ${randomPath}`);

            // Get Call to thecodinglove.com/random which gets redirected
            http.get('http://thecodinglove.com/random/', (incMessage: IncomingMessage) => {
                
                // TODO: check if response code is redirect
                incMessage.on('data', (data) => {
                    console.log(`Received Data: ${data.toString}`);
                });

                incMessage.on('readable', () => {
                    console.log(`Readable Event returned.`);
                });

                incMessage.on('close', () => {
                    console.log(
                        `Closed with Status ${incMessage.statusCode}
                         and Message ${incMessage.statusMessage}
                        `);
                });

                // TODO: Create common on error handler
                incMessage.on('error', (err) => {
                    console.log(
                        `Error with Status ${err.name}
                         and Message ${err.message}
                         and ${err.stack}
                        `);
                });

                incMessage.on('end', () => {

                    const responseData = {
                        resHeaderLocation: '',
                        resBody: ''
                    }
                    responseData.resHeaderLocation = incMessage.headers.location;

                    // redirection call to URL with data
                    http.get(responseData.resHeaderLocation, (incRedMsg: IncomingMessage) => {

                        let body: string = '';
                        incRedMsg.on('data', (data) => {
                            body += data;
                            console.log(`Redirect Data: ${data}`);
                        });

                        incRedMsg.on('end', () => {
                            responseData.resBody = body;
                            resToClient.json(responseData);
                        });

                        incRedMsg.on('error', (err) => {
                            console.log(
                                `Error with Status ${err.name}
                                 and Message ${err.message}
                                 and ${err.stack}
                                `);
                        });

                    });

                });
            });

        });
    }

}
