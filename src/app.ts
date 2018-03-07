import * as express from 'express';
import * as rootController from './controller/root-controller';
import * as randomController from './controller/random-controller'

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', rootController.index);
app.get('/random', randomController.getRandomTCL);

export default app;