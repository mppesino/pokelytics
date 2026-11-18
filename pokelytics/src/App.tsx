import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Battle from './pages/Battle'
import Pokedex from './pages/Pokedex'
import Training from './pages/Training'
import Trainers from './pages/Trainers'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/pokedex" element={<Pokedex />}/>
      <Route path="/training" element={<Training />}/>
      <Route path="/battle" element={<Battle />}/>
      <Route path="/trainers" element={<Trainers />}/>

    </Routes>
  )
}

export default App