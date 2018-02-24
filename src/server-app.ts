import * as express from 'express';
import {Application} from 'express';

import {TclController} from './tcl-controller'

class ServerApp {
    
    app: Application;
    
    constructor (private tclcontroller?: TclController) {
        this.app = express();
        this.configureRoutes();
    }
    
    private configureRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello from Server'
            });
        });
        this.app.use('/', router);
    }

}

export default new ServerApp().app;
