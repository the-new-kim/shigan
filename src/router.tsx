import type { RouteObject } from 'react-router';
import { createHashRouter, redirect, RouterProvider } from 'react-router';
import { EisenhowerMatrixRoute } from './routes/eisenhower-matrix.route';
import { BoardRoute } from './routes/board.route';
import { RootRoute } from './routes/root.route';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Columns3, Grid2X2 } from 'lucide-react';

const paths: readonly (RouteObject & { title: string; icon: ReactNode })[] = [
  {
    title: 'Eisenhower Matrix',
    path: '/eisenhower-matrix',
    element: <EisenhowerMatrixRoute />,
    icon: <Grid2X2 />,
  },
  {
    title: 'Board',
    path: '/board',
    element: <BoardRoute />,
    icon: <Columns3 />,
  },
] as const;

const createRouter = () =>
  createHashRouter([
    {
      path: '/',
      element: <RootRoute />,
      children: [
        {
          path: '',
          loader: () => redirect('/eisenhower-matrix'),
        },
        ...paths,
      ],
    },
  ]);

function AppRouter() {
  const router = useMemo(() => createRouter(), []);
  return <RouterProvider router={router} />;
}

export { AppRouter, paths };
