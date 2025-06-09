import { Route, Routes } from 'react-router-dom';
import { Header } from '../header/Header';
import { Home } from '../home/Home';
import { EventList } from '../event-list/EventList';
import { SingleEvent } from '../single-event/SingleEvent';
import { Success } from '../success/Success'
import { UserSignIn } from '../user-sign-in/UserSignIn';
import { CheckEmail } from '../check-email/CheckEmail';
import { AuthConfirm } from '../auth-confirm/AuthConfirm';
import { UserProfile } from '../user-profile/UserProfile';
import { AddEvent } from '../add-event/AddEvent';
import { Footer } from '../footer/Footer';
import { AuthProvider } from '../../contexts/AuthProvider';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events" element={<EventList/>} />
        <Route path="/events/:event_id" element={<SingleEvent/>} />
        <Route path="/success" element={<Success/>} />
        <Route path="/account" element={<UserSignIn/>} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/auth-confirm" element={<AuthConfirm /> } />
        <Route path="/breezer/:user_id" element={<UserProfile />} />
        <Route path="/breezer/:user_id/new-event" element={<AddEvent />} />
      </Routes>

      <Footer />
    </AuthProvider>
  )
}

export default App;