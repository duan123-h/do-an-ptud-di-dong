import { Route ,Routes} from "react-router-dom";
import WarehouseLogin from "../../pages/warehouse/authpage/WarehouseLogin";
import ProtectedRoute from "./ProtectedRoute";
import WarehouseLayout from "../../layouts/warehouse/WarehouseLayout";
import InventoryIndex from "../../pages/warehouse/inventory/InventoryIndex";
import ImportReceiptIndex from "../../pages/warehouse/importreceipt/ImportReceiptIndex";
import ExportPrescription from "../../pages/warehouse/export/ExportPrescription";
export default function WarehouseRoute(){
    return (
        <Routes>
            <Route path="/warehouse/login" element={<WarehouseLogin/>}>
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/warehouse" element={<WarehouseLayout/>}>
                    <Route index element={<InventoryIndex />} />
                    <Route path="inventory" element={<InventoryIndex />} />
                    <Route path="importreceipt" element={<ImportReceiptIndex />} />
                    <Route path="exportprescription" element={<ExportPrescription />} />
                </Route>
            </Route>
        </Routes>
    );
}