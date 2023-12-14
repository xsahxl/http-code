# 常见code
- 200: 请求成功
- 301: 永久重定向
- 302: 临时重定向
- 403: 无权限
- 404: 资源不存在
- 500: 服务器内部错误
- 502: 网关错误
- 503: 服务不可用
- 504: 网关超时

# http 缓存

## 历史
其实一开始http并没有缓存一说，只是服务器需要处理太多的请求，吃不消了，就希望http能设计一个缓存类的东西，一是可以使网页打开速度更快，二是可以减少服务器的压力。
这样看起来都不错，http缓存也为服务器抗下了很多请求， 但是有一天发现了问题，就是当服务器资源更新后，客户端无法拿到最新的资源，于是第一员大将`expires`就诞生了。

## expires
`expires`是服务器返回给客户端的一个过期时间，客户端下次请求时，如果请求时间在`expires`之前，则直接使用缓存，否则重新请求服务器。

可是有一天又发现问题了，就是 `expires`时间是 服务端返回的，比对的却是客户端时间，如果客户端时间和服务端时间不一致，就会出现问题。于是第二员大将 `cache-control`诞生了。

## cache-control:max-age=3600

这个单位是秒，表示过期时长，如果客户端请求时，在`max-age`之前，则直接使用缓存，否则重新请求服务器。相比过期时间用过期时长就准确多了。

## cache-control:no-cache

这个是告诉客户端，不使用强缓存，直接请求服务器。

## cache-control:no-store
这个是告诉客户端，不使用强缓存，并且不要使用协商缓存，直接请求服务器。

## cache-control:public
这个是告诉客户端，可以使用缓存，并且可以使用协商缓存。

## cache-control:private
这个是告诉客户端，可以使用缓存，但是只能使用私有缓存，不能使用协商缓存。

可是有一天服务器发现又接收到很多的请求，发现是缓存过期了，但是文件没有还是原来的文件，并没有更新，于是第三员大将 `last-modified` 出现了

## last-modified
这个是服务器返回给客户端的一个文件最后修改时间，客户端下次请求时，会带上 `if-modified-since` (就是 `last-modified` 的值)，服务器拿到这个时间会和服务器当前的最后修改时间做对比，
如果对比的结果没有变化，那就告诉客户端可以使用缓存，返回304状态，否则返回新的资源。

可是有一天客户端又发现新的问题就是服务器明明有新的资源，但是服务器却说没有，还返回304状态，然后服务器发现 是 `last-modified` 的锅，它是以秒级别记录的，如果资源是在1秒内发生改变的话，`last-modified`是无感知的，它认为没有变化，于是就出现问题了，经过一番讨论，第四员大将 `etag` 出现了。

## etag

`etag`是服务器返回给客户端的一个文件唯一标识，客户端下次请求时，会带上 `if-none-match` (就是 `etag` 的值)，服务器拿到这个标识和服务器当前的etag做对比，如果标识相同，那就告诉客户端可以使用缓存，返回304状态，否则返回新的资源。

## 流程图
![image](https://cdn.jsdelivr.net/gh/xsahxl/blog-images/http.png)



