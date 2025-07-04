import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import QueryResult from "./pages/QueryResult";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/query/:id" element={<QueryResult/>}/>
      </Routes>
    </Router>
  )
}

export default App;
