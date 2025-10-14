import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MarketplaceProvider } from './contexts/MarketplaceContext'
import Home from './pages/Home'



function App() {
  

  return (
    <>
       <Router>
        <MarketplaceProvider>
          <Routes>
            
            <Route path="/" element={<Home/>} />
          </Routes>
        </MarketplaceProvider>
      </Router>
     
    </>
  )
}

export default App