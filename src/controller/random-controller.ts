import { Request, Response } from 'express';
import * as https from 'https';
import * as async from 'async';
import * as utf8 from 'utf8';
import { IncomingMessage } from 'http';
import { extractHeadline, extractGifUrl, extractPath, extractHost, extractLocation } from '../utils';
import { RequestOptions } from 'https';

const TCL_HOST: string = 'thecodinglove.com';

export const getRandomTCL = (req: Request, res: Response) => {
    console.log('Random Controller');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type", "application/json; charset=utf-8");
    
    async.waterfall([
        callRandomTCL,
        redirectToTCL
    ], (err, responseData) => {
        if(err){
            console.log(err);
        } else {
            res.json(responseData);
            log(`Request has been processed successful!`);
        }
    });

}

const redirectToTCL = (responseData, callback) => {
    console.log(`redirectToTCL started: ${responseData.location}`);

    https.get(responseData.location, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('redirectToTCL', err);
        });

        let body: string = '';
        incMessage.on('data', (data) => {
            body += data;
        });

        incMessage.on('end', () => {
            responseData.headline = extractHeadline(body);
            responseData.headline = utf8.encode(responseData.headline);
            responseData.gifUrl = extractGifUrl(body);
            callback(null, responseData);
        });
    });
}

const callRandomTCL = (callback) => {
    console.log('callRandomTCL started');
    const responseData = {
        location: '',
        headline: '',
        gifUrl:'',
        gifData: ''
    }

    const options: RequestOptions = {
        host: TCL_HOST,
        path: '/'
    }
    logOptions(options);
    https.get(options, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('callRandomTCL', err);
        });

        incMessage.on('readable', () => {
          log(`${incMessage.statusCode}`);
          log(`Readable called`);
        });

        let body: string = '';
        incMessage.on('data', (data) => {
          body += data;
        });

        incMessage.on('end', () => {
          log(`End called`);
            responseData.location = extractLocation(body);
            log(`${responseData.location}`);
            callback(null, responseData);
        });
    });
}

const logOptions = (options: RequestOptions) => {
    log(`Calling host ${options.host} and path ${options.path}`);
}

const log = (txt: string) => {
    console.log(txt);
}