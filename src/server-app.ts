import * as express from 'express';
import {Application, Request, Response} from 'express';
import * as http from 'http';

import {TclController} from './tcl-controller'
import { IncomingMessage } from 'http';

// use internal http.get to fetch data

class ServerApp {
    
    app: Application;
    
    constructor (private tclcontroller?: TclController) {
        this.app = express();
        this.configureRoutes();
    }
    
    private configureRoutes() {
        const rootPath: string | RegExp | (string | RegExp)[] = '/';

        this.app.route(rootPath).get((req, res, next) => {
            console.log(`Root Path: ${rootPath}`);
            res.json({
                message: 'Hello from Server'
            });
            next();
        });
        
        const randomPath: string | RegExp | (string | RegExp)[] = '/random';
        this.app.route(randomPath).get((req: Request, resToClient: Response) => {
            console.log(`Random Path: ${randomPath}`);

            const responseData = {
                originUrl: '',
                headline: '',
                gifUrl: ''
            }

            http.get('http://thecodinglove.com/random/', (incMessage: IncomingMessage) => {
                
                const statusCode: number = incMessage.statusCode;
                console.log('Status code incMessage: ', statusCode);
                
                if(statusCode >= 300 && statusCode < 400) {
                    const location = incMessage.headers.location;
                    console.log(`Redirecting to ${location}`);
                    
                    http.get(location, (incBody) => {
                        console.log(`Redirection call with Status ${incBody.statusCode}`);
                        console.log(`Headers of redirection Response ${incBody.headers.location}`);
                        incBody.setEncoding('UTF-8');
                        let body = '';

                        incMessage.on('data', data => {
                            console.log('Data is: ', typeof data);
                            body += data;
                        });

                        incBody.on('end', () => {
                            responseData.originUrl = location;
                            responseData.headline = body;
                            responseData.gifUrl = 'http://url.com';
                            resToClient.json(responseData);
                        });

                    });
                }

                incMessage.on('end', () => {
                    resToClient.status(500);
                });
            });
        });
    }

}

export default new ServerApp().app;
