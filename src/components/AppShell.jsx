import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ModalHost from './ModalHost';

function AppShell({ navigation }) {
  return (
    <div className="min-h-screen bg-cream bg-dashboard-wash font-body text-ink">
      <div className="flex min-h-screen">
        <Sidebar navigation={navigation} />
        <div className="min-w-0 flex-1 lg:pl-64">
          <Topbar navigation={navigation} />
          <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <ModalHost />
    </div>
  );
}

export default AppShell;
