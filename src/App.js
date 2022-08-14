import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login';
// import Signup from './pages/auth/Signup';
import Messenger from './pages/messenger/Messenger';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/signup' element={<Signup />} /> */}
        <Route path='/messenger' element={<Messenger />} />
      </Routes>
    </Router>
  );
}

export default App;
