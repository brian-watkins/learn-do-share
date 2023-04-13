import handler from "serve-handler"
import http from "http"

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./azure/build/display"
  })
})

server.listen(7778, () => {
  console.log("Serving static files at http://localhost:7778")
})