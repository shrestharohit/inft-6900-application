import React from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';


function App() {

  return (
<<<<<<< Updated upstream
    <>
      <div>
        <div> Gargi Practice</div>
        <input />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

    </>
  )
=======
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
    </div>

  );

>>>>>>> Stashed changes
}

export default App;

