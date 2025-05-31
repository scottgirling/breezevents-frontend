import { Route, Routes } from 'react-router-dom';
import { Header } from '../header/Header';
import { Home } from '../home/Home';
import { UserSignIn } from '../user-sign-in/UserSignIn';
import { SingleEvent } from '../single-event/SingleEvent';
import './App.css'

function App() {
  return (
    <>
      <Header></Header>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events/:event_id" element={<SingleEvent/>} />
        <Route path="/account" element={<UserSignIn/>} />
      </Routes>
    </>
  )
}

export default App;