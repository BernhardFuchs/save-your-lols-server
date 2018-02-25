import app from './server-app'

const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`App is running at http://localhost:${port} 
  in ${app.get('env')} mode\n` + '  Press CTRL-C to stop\n');
});