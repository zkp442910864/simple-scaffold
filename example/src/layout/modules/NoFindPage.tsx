import { useLocation } from 'react-router';


export const NoFindPage = () => {
  const local = useLocation();

  return (
    <>
      <div>-404-</div>
    </>
  );
};
