import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthProvider';
import { Header } from '../header/Header';
import { Home } from '../home/Home';
import { EventList } from '../event-list/EventList';
import { SingleEvent } from '../single-event/SingleEvent';
import { Success } from '../success/Success'
import { UserSignIn } from '../user-sign-in/UserSignIn';
import { CheckEmail } from '../check-email/CheckEmail';
import { AuthConfirm } from '../auth-confirm/AuthConfirm';
import { Error } from '../error/Error';
import { AuthRoute } from '../auth-route/AuthRoute';
import { UserProfile } from '../user-profile/UserProfile';
import { AddEvent } from '../add-event/AddEvent';
import { UpdateEvent } from '../update-event/UpdateEvent';
import { NotFound } from '../not-found/NotFound';
import { Footer } from '../footer/Footer';
import "./App.css";

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

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </AuthProvider>
  )
}

export default App;