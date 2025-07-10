import { useEffect } from 'react'
import './App.css'
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"

function App() {
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("/hello", {name: "franklyn"})
      console.log("response ", response.data)
      
    }
    fetch()
  }, []);

  return (
    <span>hello world</span>
  )
}

export default App
