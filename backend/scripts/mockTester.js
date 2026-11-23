import http from 'http';
import { Readable } from 'stream';

export function simulateRequest(app, { method = 'GET', url = '/', body = null, headers = {} }) {
  return new Promise((resolve) => {
    const jsonBody = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'content-type': 'application/json',
      host: 'localhost',
      ...(jsonBody ? { 'content-length': Buffer.byteLength(jsonBody).toString() } : {}),
      ...headers,
    };

    // Construct IncomingMessage
    const socket = {
      encrypted: false,
      remoteAddress: '127.0.0.1',
      address() {
        return { address: '127.0.0.1', port: 5001 };
      },
      on() {},
      once() {},
      emit() {},
      write() {},
      end() {},
      destroy() {},
    };

    const req = new http.IncomingMessage(socket);
    req.method = method;
    req.url = url;
    req.headers = reqHeaders;
    req.socket = socket;
    req.connection = socket;

    // Construct ServerResponse
    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    let chunks = [];

    // Capture response writes
    res.write = function (chunk) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return true;
    };

    res.end = function (chunk) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const fullBodyStr = Buffer.concat(chunks).toString('utf8');
      let parsed = fullBodyStr;
      try {
        parsed = JSON.parse(fullBodyStr);
      } catch (e) {
        // keep string
      }

      resolve({
        status: res.statusCode,
        headers: res.getHeaders ? res.getHeaders() : {},
        body: parsed,
      });
      return this;
    };

    // Feed request body stream and pipe to Express
    app(req, res);

    if (jsonBody) {
      req.push(Buffer.from(jsonBody));
    }
    req.push(null);
  });
}
