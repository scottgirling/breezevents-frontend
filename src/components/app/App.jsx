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
import { UpdateEvent } from '../update-event/UpdateEvent';
import { Footer } from '../footer/Footer';
import { AuthProvider } from '../../contexts/AuthProvider';
import { AuthRoute } from '../auth-route/AuthRoute';
import { Error } from '../error/Error';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:event_id" element={<SingleEvent />} />
        <Route path="/success" element={<Success />} />
        <Route path="/account" element={<UserSignIn />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/auth-confirm" element={<AuthConfirm /> } />
        <Route path="/error" element={<Error />} />

        <Route element={<AuthRoute/>}>
          <Route path="/breezer/:user_id" element={<UserProfile />} />
          <Route path="/breezer/:user_id/new-event" element={<AddEvent />} />
          <Route path="/breezer/:user_id/:event_id/update" element={<UpdateEvent />} />
        </Route>
      </Routes>

      <Footer />
    </AuthProvider>
  )
}

export default App;