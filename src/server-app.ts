import * as express from 'express';
import {Application} from 'express';

import {TclController} from './tcl-controller'

export class ServerApp {
    
    private static instance: ServerApp;
    private app: Application;

    static getInstance() {
        if (!ServerApp.instance) {
            ServerApp.instance = new ServerApp();
        }
        return ServerApp.instance;
    }

    private constructor (private tclcontroller?: TclController) {
        this.app = express();
        this.configureApp();
        this.addListener();
    }
    
    private configureApp () {
        this.app.set('port', 9999);
        this.app.get('/tclrandom', this.tclcontroller.getRandomGif);
    }

    private addListener () {
        this.app.listen(this.app.get('port'), () => {
            console.log(`App is running at http://localhost:${this.app.get('port')} 
            in ${this.app.get('env')} mode`);
        });
        console.log("  Press CTRL-C to stop\n");
    }

}
