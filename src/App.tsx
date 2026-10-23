import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Navbar } from './components/common/Navbar';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const SimulatorPage = lazy(() => import('./pages/SimulatorPage'));
const WorldExplorerPage = lazy(() => import('./pages/WorldExplorerPage'));

function Shell() {
  const { pathname } = useLocation();
  const immersive = pathname.startsWith('/simulator');
  return (
    <>
      {!immersive && <Navbar />}
      <Suspense fallback={<LoadingScreen label="Preparing the launch pad" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/worlds" element={<WorldExplorerPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
