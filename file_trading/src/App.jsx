import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MarketplaceProvider } from './contexts/MarketplaceContext'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Header from './components/Header'



function App() {
  

  return (
    <>
       <Router>
        <MarketplaceProvider>
          <Header/>
          <Routes>
            
            <Route path="/" element={<Home/>} />
            <Route path="/profile" element={<Profile/>} />
          </Routes>
        </MarketplaceProvider>
      </Router>
     
    </>
  )
}

export default App