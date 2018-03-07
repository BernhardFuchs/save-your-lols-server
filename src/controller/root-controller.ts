import {Request, Response} from 'express'

export const index = (req: Request, res: Response) => {
    console.log(`Root Path`);
    res.json({
        message: 'Hello from Server'
    });
}