
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { CustomRouter } from './router';
import 'virtual:uno.css';

const render = () => {
  createRoot(document.getElementById('main-root')!).render(
    <StrictMode>
      <RouterProvider router={CustomRouter.getInstance().router!} />
    </StrictMode>
  );
};


render();
