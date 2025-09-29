import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Pages and Components
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { EventFormPage } from '@/pages/EventFormPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfilePage } from "./pages/ProfilePage";
import { AuthWrapper } from "./components/AuthWrapper";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "event/:id",
        element: <EventDetailPage />,
      },
      {
        path: "create-event",
        element: <EventFormPage />,
      },
      {
        path: "event/:id/edit",
        element: <EventFormPage />,
      },
    ],
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
    >
      <ErrorBoundary>
        <AuthWrapper>
          <RouterProvider router={router} />
        </AuthWrapper>
      </ErrorBoundary>
    </Auth0Provider>
  </StrictMode>,
)