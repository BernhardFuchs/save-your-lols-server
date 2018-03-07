import app from './app';

const server = app.listen(app.get('port'), () => {
  console.log(`App is running at http://localhost:${app.get('port')} 
  in ${app.get('env')} mode\n` + '  Press CTRL-C to stop\n');
});

export default server;
