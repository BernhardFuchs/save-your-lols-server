import { Request, Response } from 'express';
import * as async from 'async';
import * as http from 'http';
import { IncomingMessage } from 'http';
import { extractHeadline, extractGifUrl } from '../utils';

export const getRandomTCL = (req: Request, res: Response) => {
    console.log('Random Controller');
    
    async.waterfall([
        callRandomTCL,
        redirectToTCL,
        fetchGifData
    ], (err, responseData) => {
        if(err){
            console.log(err);
        } else {
            res.json(responseData);
        }
    });

}

const fetchGifData = (responseData, callback) => {
    http.get(responseData.gifUrl, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('fetchGifData', err);
        });
        
        let gifRawData: any;
        incMessage.on('data', (data) => {
            gifRawData += data;
        });

        incMessage.on('end', () => {
            responseData.gifData = gifRawData;
        });

        callback(null, responseData);
    });
}

const redirectToTCL = (responseData, callback) => {
    http.get(responseData.resHeaderLocation, (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('redirectToTCL', err);
        });
        
        let body: string;
        incMessage.on('data', (data) => {
            body += data;
            // console.log(`Redirect Data: ${data}`);
        });

        incMessage.on('end', () => {
            responseData.headline = extractHeadline(body);
            responseData.gifUrl = extractGifUrl(body);
        });

        callback(null, responseData);
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

    http.get('http://thecodinglove.com/random/', (incMessage: IncomingMessage) => {
        incMessage.on('error', (err) => {
            console.log('callRandomTCL', err);
        });
    
        incMessage.on('end', () => {
            responseData.location = incMessage.headers.location;
        })
    });

    callback(null, responseData);
}