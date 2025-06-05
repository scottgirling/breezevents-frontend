import { Route, Routes } from 'react-router-dom';
import { Header } from '../header/Header';
import { Home } from '../home/Home';
import { EventList } from '../event-list/EventList';
import { SingleEvent } from '../single-event/SingleEvent';
import { Success } from '../success/Success'
import { Cancel } from '../cancel/Cancel';
import { UserSignIn } from '../user-sign-in/UserSignIn';
import { UserProfile } from '../user-profile/UserProfile';
import './App.css'

function App() {
  return (
    <>
      <Header></Header>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events" element={<EventList/>} />
        <Route path="/events/:event_id" element={<SingleEvent/>} />
        <Route path="/success" element={<Success/>} />
        <Route path="/cancel" element={<Cancel/>} />
        <Route path="/account" element={<UserSignIn/>} />
        <Route path="/breezer/:user_id" element={<UserProfile/>} />
      </Routes>
    </>
  )
}

export default App;