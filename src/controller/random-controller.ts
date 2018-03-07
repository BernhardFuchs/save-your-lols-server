import { Request, Response } from 'express';
import * as http from 'http';
import * as async from 'async';
import { IncomingMessage } from 'http';
import { extractHeadline, extractGifUrl, extractPath, extractHost } from '../utils';
import { RequestOptions } from 'https';

const TCL_HOST: string = 'thecodinglove.com';

export const getRandomTCL = (req: Request, res: Response) => {
    console.log('Random Controller');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    async.waterfall([
        callRandomTCL,
        redirectToTCL,
        fetchGifData
    ], (err, responseData) => {
        if(err){
            console.log(err);
        } else {
            res.json(responseData);
            log(`Request has been processed successful!`);
        }
    });

}

const fetchGifData = (responseData, callback) => {
    log('fetchGifData started');
    log(`Fetching GifUrl: ${responseData.gifUrl}`);
    http.get(responseData.gifUrl, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('fetchGifData', err);
        });
        
        let gifRawData: any;
        incMessage.on('data', (data) => {
            gifRawData = data;
        });

        incMessage.on('end', () => {
            responseData.gifData = gifRawData;
            callback(null, responseData);
        });
    });
}

const redirectToTCL = (responseData, callback) => {
    console.log(`redirectToTCL started: ${responseData.location}`);

    http.get(responseData.location, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('redirectToTCL', err);
        });

        let body: string = '';
        incMessage.on('data', (data) => {
            body += data;
        });

        incMessage.on('end', () => {
            responseData.headline = extractHeadline(body);
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
        path: '/random'
    }
    logOptions(options);
    http.get(options, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('callRandomTCL', err);
        });

        incMessage.on('readable', () => {
            log(`Readable called`);
        });

        incMessage.on('end', () => {
            responseData.location = incMessage.headers.location;
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