import { useRouter } from '@/router';
import { useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import { DocumentTitle } from './DocumentTitle';
import { MenuList } from './MenuList';

export const LayoutRoot = () => {

  return (
    <>
      <DocumentTitle/>
      <MenuList/>
      <Outlet />
    </>
  );
};
