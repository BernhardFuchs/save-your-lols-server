import * as express from 'express';
import {Application, Request, Response} from 'express';

import {TclController} from './tcl-controller'

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
        this.app.route(randomPath).get((req: Request, res: Response) => {
            console.log(`Random Path: ${randomPath}`);
            console.log(`Request: ${req}`);
            console.log('No error returned!!!');
            res.sendStatus(200);
        });
    }

}

export default new ServerApp().app;
