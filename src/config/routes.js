import FileManager from '@/components/pages/FileManager';

export const routes = {
  fileManager: {
    id: 'fileManager',
    label: 'File Manager',
    path: '/',
    icon: 'Folder',
    component: FileManager
  }
};

export const routeArray = Object.values(routes);
export default routes;