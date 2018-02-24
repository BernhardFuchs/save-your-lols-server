"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class ServerApp {
    constructor(tclcontroller) {
        this.tclcontroller = tclcontroller;
        this.app = express();
        this.configureApp();
        this.addListener();
    }
    static getInstance() {
        if (!ServerApp.instance) {
            ServerApp.instance = new ServerApp();
        }
        return ServerApp.instance;
    }
    configureApp() {
        this.app.set('port', 9999);
        this.app.get('/tclrandom', this.tclcontroller.getRandomGif);
    }
    addListener() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`App is running at http://localhost:${this.app.get('port')} 
            in ${this.app.get('env')} mode`);
        });
        console.log("  Press CTRL-C to stop\n");
    }
}
exports.ServerApp = ServerApp;
//# sourceMappingURL=server-app.js.map