import app from './app';

const server = app.listen(app.get('port'), () => {
  console.log(`App is running at http://localhost:${app.get('port')} 
  in ${app.get('env')} mode\n` + '  Press CTRL-C to stop\n');
});

export default server;


/* Class based solution
import {ServerApp} from './server-app'

const port = process.env.PORT || 3000

const app = new ServerApp().app;
app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`App is running at http://localhost:${port} 
  in ${app.get('env')} mode\n` + '  Press CTRL-C to stop\n');
});*/