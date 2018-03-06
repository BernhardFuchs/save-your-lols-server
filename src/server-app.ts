import * as express from 'express';
import * as http from 'http';
import { Application, Request, Response } from 'express';

import { IncomingMessage } from 'http';
import { extractHeadline, extractGifUrl } from './utils';

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
        
        /*
        - Create Data model for response incl namespace and builder
        - add Router middleware
        - Create controller to forward request to
        - integrate RsJs to handle forwarding of the request
        */

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
                        resHeadline: '',
                        resGifUrl:'',
                        resGif: ''
                    }
                    responseData.resHeaderLocation = incMessage.headers.location;

                    // redirection call to URL with data
                    http.get(responseData.resHeaderLocation, (incRedMsg: IncomingMessage) => {

                        let body: string = '';
                        let headline: string ='';
                        let gifUrl: string ='';
                        incRedMsg.on('data', (data) => {
                            body += data;
                            // console.log(`Redirect Data: ${data}`);
                        });

                        incRedMsg.on('end', () => {
                            headline = extractHeadline(body);
                            gifUrl = extractGifUrl(body);
                            responseData.resHeadline = headline;
                            responseData.resGifUrl = gifUrl;

                            http.get(gifUrl, (gifResponse) => {
                                let gifRawData: any;
                                gifResponse.on('data', (data) => {
                                    gifRawData = data;
                                });

                                gifResponse.on('end', () => {
                                    console.log('Gif Data: ', gifRawData);
                                    responseData.resGif = gifRawData;
                                    resToClient.json(responseData);
                                });
                            });

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
