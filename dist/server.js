"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_app_1 = require("./server-app");
const server = server_app_1.ServerApp.getInstance();
exports.default = server;
/*
export class Server {
    server: any;
    constructor(private serverApp: ServerApp) {}

    startServer() {
        this.server = this.serverApp.app.listen(this.serverApp.app.get('port'), () => {
            console.log(
                `App is running at http://localhost:${this.serverApp.app.get('port')} in ${this.serverApp.app.get('env')} mode`
            );
            console.log('press CTRL-C to stop\n')
        });
    }
}
*/ 
//# sourceMappingURL=server.js.map