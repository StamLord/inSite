import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import QueryResult from "./pages/QueryResult";
import AnalyzePage from './pages/AnalyzePage';
import Account from './pages/Account';
import styles from './styles/variables.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/analyze" element={<AnalyzePage/>}/>
        <Route path="/query/:id" element={<QueryResult/>}/>
        <Route path="/account" element={<Account/>}/>
      </Routes>
    </Router>
  )
}

export default App;
