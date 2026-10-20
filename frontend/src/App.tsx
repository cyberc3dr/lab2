import { Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LinksPage from './pages/LinksPage';
import ManagePage from './pages/ManagePage';
import LoginPage from './pages/LoginPage';
import ContactsPage from './pages/ContactsPage';

function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer container muted small">Links — сервис хранения ссылок.</footer>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LinksPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<LinksPage />} />
      </Route>
    </Routes>
  );
}
