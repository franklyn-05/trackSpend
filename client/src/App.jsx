import './App.css';
import axios from "axios";
import NavBar from './components/NavBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Profile from './pages/Profile';
import NoPage from "./pages/NoPage";
import Login from './pages/Login';
import Register from "./pages/Register";
import Footer from './components/Footer';
import Transactions from './pages/Transactions';
import Contact from './pages/Contact';
import Budgets from './pages/Budgets';

axios.defaults.baseURL = "http://localhost:8000"



function App() {



  return (
    <div className='flex flex-col min-h-screen'>
      <div className='grow'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<NavBar />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path='transactions' element={<Transactions />} />
              <Route path='budgets' element={<Budgets />} />
              <Route path='about-us' element={<AboutUs />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='*' element={<NoPage />} />
              <Route path='contact' element={<Contact />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>

      <Footer />
    </div>
  );
}

export default App
