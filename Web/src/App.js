
import './App.css';
import AdminRoute from './routes/Admin/AdminRoute';
import ClientRoute from './routes/client/ClientRoute';
import HisRoute from './routes/his/HisRoute';
import MyRoute from './routes/MyRoute';
import WarehouseRoute from './routes/warehouse/WarehouseRoute';
function App() {
  return (
    <>
      {/* <AdminRoute/>
      <HisRoute/>
      <WarehouseRoute/> */}
      <MyRoute/>
      {/* <ClientRoute/> */}
    </>
  );
}

export default App;
