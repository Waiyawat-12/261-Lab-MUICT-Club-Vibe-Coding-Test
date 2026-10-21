import { Link, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ClubDetail } from "./pages/ClubDetail";
import { ClubList } from "./pages/ClubList";
import { MyClubs } from "./pages/MyClubs";
import { RegistrationProvider } from "./registration";

export function App() {
  return (
    <RegistrationProvider>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ClubList />} />
            <Route path="/clubs/:clubId" element={<ClubDetail />} />
            <Route path="/my-clubs" element={<MyClubs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>Registrations stay in this browser on this device.</p>
        </footer>
      </div>
    </RegistrationProvider>
  );
}

function NotFound() {
  return (
    <section className="page">
      <div className="panel empty">
        <h1>Page not found</h1>
        <p>That address is not part of club registration.</p>
        <Link className="button primary" to="/">
          Browse clubs
        </Link>
      </div>
    </section>
  );
}
