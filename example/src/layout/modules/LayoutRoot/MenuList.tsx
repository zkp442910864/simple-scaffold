import { useRouter } from '@/router';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router';

export const MenuList = () => {

  const page = useRouter();
  const { current: cache, } = useRef({
    title: document.title,
  });

  useEffect(() => {
    document.title = page?.title ?? cache.title;
  }, [page,]);

  return (
    <>
      <div className="p-4 flex un-justify-evenly m-b-10 un-border-dashed un-border-indigo-500 un-border">
        <Link to={'Home'}>Home</Link>
      </div>
    </>
  );
};
