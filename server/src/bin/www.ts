import app from "../app"
import http from 'http';

import {config} from "../config";

app.set('port', config.port);

(async () => {
  const server = http.createServer(app);

  server.listen(app.get('port'));
})().catch(err => {
  throw err;
});
