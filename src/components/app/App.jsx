import { Route, Routes } from 'react-router-dom';
import { Header } from '../header/Header';
import { UserSignIn } from '../user-sign-in/UserSignIn';
import './App.css'

function App() {
  return (
    <>
      <Header></Header>

      <Routes>
        <Route path="/account" element={<UserSignIn/>} />
      </Routes>
    </>
  )
}

export default App;