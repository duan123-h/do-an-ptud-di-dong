import { Outlet } from "react-router-dom";
import WarehouseHeader from "../../components/warehouse/Header";
import Warehousesidebar from "../../components/warehouse/Sidebar";
import { Toaster } from 'react-hot-toast';
import { Helmet } from "react-helmet";
import "../../store/admin/assets/vendor/bootstrap/css/bootstrap.min.css";
import "../../store/admin/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../store/admin/assets/vendor/boxicons/css/boxicons.min.css";
import "../../store/admin/assets/vendor/remixicon/remixicon.css";
import "../../store/admin/assets/fontawesome-free-6.6.0-web/fontawesome-free-6.6.0-web/css/all.min.css";
import "../../store/admin/assets/vendor/simple-datatables/style.css";
import "../../store/admin/assets/css/style.css";

export default function WarehouseLayout() {
    return (
        <>
            <Helmet>
                <link
                    href={`${process.env.PUBLIC_URL}/admin/assets/img/apple-touch-icon.png`}
                    rel="apple-touch-icon"
                />

                <link
                    href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
                    rel="stylesheet"
                />

                <link
                    href={`${process.env.PUBLIC_URL}`}
                    rel="stylesheet"
                />

                <link
                    href={`${process.env.PUBLIC_URL}/admin/assets/img/favicon.png`}
                    rel="icon"
                />
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/tinymce/tinymce.min.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/apexcharts/apexcharts.min.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/chart.js/chart.min.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/echarts/echarts.min.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/bootstrap/js/bootstrap.bundle.min.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/simple-datatables/simple-datatables.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/vendor/php-email-form/validate.js`} defer></script>
                <script src={`${process.env.PUBLIC_URL}/admin/assets/js/main.js`} defer></script>
            </Helmet>
            <main id="main" className="main">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                    }}
                />
                <WarehouseHeader />
                <Warehousesidebar />
                <Outlet />
            </main>
        </>
    );
}