import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/features/codex/pages/HomePage'
import { CodexPage } from '@/features/codex/pages/CodexPage'
import { BuildingDetailPage } from '@/features/codex/pages/BuildingDetailPage'
import { DecoderPage } from '@/features/decoder/pages/DecoderPage'
import { CipherPage } from '@/features/cipher/pages/CipherPage'
import { ImmersivePage } from '@/features/immersive/pages/ImmersivePage'
import { DataVizPage } from '@/features/dataviz/pages/DataVizPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'codex',
        element: <CodexPage />,
      },
      {
        path: 'codex/:slug',
        element: <BuildingDetailPage />,
      },
      {
        path: 'decoder',
        element: <DecoderPage />,
      },
      {
        path: 'decoder/:slug',
        element: <DecoderPage />,
      },
      {
        path: 'cipher',
        element: <CipherPage />,
      },
      {
        path: 'immersive',
        element: <ImmersivePage />,
      },
      {
        path: 'immersive/:slug',
        element: <ImmersivePage />,
      },
      {
        path: 'dataviz',
        element: <DataVizPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

export { router }
