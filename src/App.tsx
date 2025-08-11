import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientRoutes from './routes/ClientRoutes';
import { lazy, Suspense } from 'react';
import LoadingUi from './components/modals/LoadingModal';
import { LoadingProvider } from './hooks/common/useLoading';
import AdminRoutes from './routes/AdminRoutes';

const TurfOwnerRoutes=lazy(()=> import('./routes/TurfOwnerRoutes'))

function App() {
  return (
    <LoadingProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ClientRoutes />} />
        <Route path='/turfowner/*'
        element={
         <Suspense fallback={<LoadingUi/>}>
          <TurfOwnerRoutes/>
         </Suspense> 
        }/>
        <Route path='/admin/*'
        element={<Suspense fallback={<LoadingUi/>}>
          <AdminRoutes/>
        </Suspense>}
        />
      </Routes>
    </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
