import * as express from 'express';
import * as http from 'http';
import {Application, Request, Response} from 'express';

import {TclController} from './tcl-controller'
import { IncomingMessage } from 'http';

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
                originUrl: ''
            }

            http.get('http://thecodinglove.com/random/', (incMessage: IncomingMessage) => {
                
                incMessage.on('data', (data) => {
                    console.log(`Received Data: ${data.toString}`);
                });

                incMessage.on('readable', () => {
                    console.log(`Readable Event returned!!!`);
                });

                incMessage.on('close', () => {
                    console.log(`Closed with Status ${incMessage.statusCode} and Message ${incMessage.statusMessage}`);
                });

                incMessage.on('error', (err) => {
                    console.log(`Error with Status ${err.name} and Message ${err.message} 
                    and ${err.stack}`);
                });

                incMessage.on('end', () => {
                    responseData.originUrl = incMessage.headers.location;
                    resToClient.json(responseData);
                });
                
            });
        });
    }

}

export default new ServerApp().app;
