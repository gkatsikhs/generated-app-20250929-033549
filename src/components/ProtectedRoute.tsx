import React from 'react';
import { Outlet } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Layout } from './Layout';
import { Loader2 } from 'lucide-react';
const ProtectedRouteComponent = () => (
  <Layout>
    <Outlet />
  </Layout>
);
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
  </div>
);
export const ProtectedRoute = withAuthenticationRequired(ProtectedRouteComponent, {
  onRedirecting: () => <Loading />,
});