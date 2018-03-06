import * as express from 'express';
import * as http from 'http';
import { Application, Request, Response } from 'express';

import { IncomingMessage } from 'http';
// import * as cors from 'cors';

export class ServerApp {
    
    app: Application;
    
    constructor () {
        this.app = express();
        // this.app.use(cors());
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

        const randomPath: string | RegExp | (string | RegExp)[] = '/random';
        // Random Lol Route
        this.app.route(randomPath).get((req: Request, resToClient: Response, next) => {
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
                            headline = this.extractHeadline(body);
                            gifUrl = this.extractGifUrl(body);
                            responseData.resHeadline = headline;
                            responseData.resGifUrl = gifUrl;

                            // fetch gif
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
                        console.log('FOURTH callback');
                    });
                    console.log('THIRD callback');
                });
                console.log('SECOND callback');
            });
            console.log('FIRST callback');
            next();
        });
    }

    private extractHeadline(body: string): string  {
        const foundHeadlines = body.match(/(<h3>(.*?)<\/h3>)/g);
        console.log('found headlines', foundHeadlines);
        const headline = foundHeadlines[0].replace(/<[^>]*>/g, '');
        console.log('refined headline: ', headline);
        return headline;
    }

    private extractGifUrl(body: string): string {
        const foundGifUrls = body.match(/(<p class="e"><img src="(.*?)\.gif")/);
        console.log('rawGifUrls: ', foundGifUrls[0]);
        const gifUrl = foundGifUrls[0].match(/(http(.*?)\.gif)/);
        console.log('found gifurls: ', gifUrl[0]);
        return gifUrl[0];
    }

}
