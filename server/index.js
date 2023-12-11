const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const server = http.createServer((req, res) => {
  console.log(req.url);
  // /api/200 => 200
  const url = req.url.replace("/api/", "");
  const filePath = path.join(__dirname, "file.txt");
  switch (url) {
    // 200
    case '200':
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("hello world");
      break;
    // 301:永久跳转
    case '301':
      res.writeHead(301, { "Content-Type": "text/plain", "Location": "/api/200" });
      res.end("redirect");
      break;
    // 302:临时跳转
    case '302':
      res.writeHead(302, { "Content-Type": "text/plain", "Location": "/api/200" });
      res.end("redirect");
      break;
    // 403:权限不足
    case '403':
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("forbidden");
    // 404: Not Found
    case '404':
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      break;
    // 500: 服务端内部发生错误
    case '500':
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      break;
    // 502: Bad Gateway
    case '502':
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Bad Gateway");
      break;
    // 504:
    case '504':
      res.writeHead(504, { "Content-Type": "text/plain" });
      res.end("Gateway Timeout");
      break;
    // expires
    case 'expires':
      res.writeHead(200, { "Content-Type": "text/plain", "Expires": "Thu, 26 May 2030 10:00:00 GMT" });
      res.end("expires");
      break;

    // cache-control:public,max-age=10
    case 'cache-control:public,max-age=10':
      res.writeHead(200, { "Content-Type": "text/plain", "Cache-Control": "public,max-age=10" });
      res.end("cache-control:public,max-age=10");
      break;
    // last-modified
    case 'last-modified':
      fs.stat(filePath, (err, stats) => {
        if (err) {
          res.statusCode = 500;
          res.end("Internal Server Error");
          return;
        }
        const lastModified = stats.mtime.toGMTString();
        console.log(lastModified, 'lastModified')
        res.setHeader("Content-Type", "text/plain;charset=utf-8");
        // 对于验证 last-modified, 可先设置 cache-control:no-cache,使客户端不走强缓存
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Last-Modified", lastModified);

        // 获取客户端发送的 If-Modified-Since 请求头
        const ifModifiedSince = req.headers["if-modified-since"];
        // 如果客户端发送了 If-Modified-Since 请求头并且与当前资源的 Last-Modified 值相同，则返回 304 Not Modified
        if (ifModifiedSince && ifModifiedSince === lastModified) {
          res.statusCode = 304;
          res.end();
        } else {
          res.statusCode = 200;
          fs.createReadStream(filePath).pipe(res);
        }
      });
      break;
    // etag
    case 'etag':
      const fileContent = fs.readFileSync(filePath);
      const etagValue = crypto.createHash("md5").update(fileContent).digest("hex");
      res.setHeader("Content-Type", "text/plain");
      // 对于验证 etag, 可先设置 cache-control:no-cache,使客户端不走强缓存
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("ETag", etagValue);
      // 获取客户端发送的 If-None-Match 请求头
      const ifNoneMatch = req.headers["if-none-match"];
      // 如果客户端发送了 If-None-Match 请求头并且与当前资源的 ETag 值匹配，则返回 304 Not Modified
      if (ifNoneMatch && ifNoneMatch === etagValue) {
        res.statusCode = 304;
        res.end();
      } else {
        res.statusCode = 200;
        res.end(fileContent);
      }
      break;

    default:
      break;
  }


});

server.listen(7001, () => {
  console.log("server is running");
});
