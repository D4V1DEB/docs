const http = require('http')
const WebSocket = require('ws')
const { setupWSConnection } = require('y-websocket/bin/utils')

const port = Number(process.env.PORT || 1234)

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('ok')
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Yjs websocket server running')
})

const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req)
})

server.on('upgrade', (request, socket, head) => {
  console.log('[upgrade]', request.url, request.socket.remoteAddress)
  wss.handleUpgrade(request, socket, head, (ws) => {
    console.log('[connection]', request.url)
    wss.emit('connection', ws, request)
  })
})

server.on('clientError', (err, socket) => {
  console.error('[clientError]', err.message)
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Yjs websocket server listening on ws://0.0.0.0:${port}`)
})
