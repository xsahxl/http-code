import axios from 'axios';
axios.defaults.baseURL = '/api';

function App() {
  const handle = (code: string) => {
    axios.get(code).then(console.log)
  }

  return (
    <>
      <h1>HTTP Status Code</h1>
      <button onClick={() => handle('200')}>200</button>
      <button onClick={() => handle('301')}>301</button>
      <button onClick={() => handle('302')}>302</button>
      <button onClick={() => handle('403')}>403</button>
      <button onClick={() => handle('404')}>404</button>
      <button onClick={() => handle('500')}>500</button>
      <button onClick={() => handle('502')}>502</button>
      <button onClick={() => handle('504')}>504</button>
      <h1>缓存</h1>
      <button onClick={() => handle('expires')}>expires</button>
      <button onClick={() => handle('cache-control:public,max-age=10')}>cache-control:public,max-age=10</button>
      <button onClick={() => handle('last-modified')}>last-modified</button>
      <button onClick={() => handle('etag')}>etag</button>

    </>
  )
}

export default App
