import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;