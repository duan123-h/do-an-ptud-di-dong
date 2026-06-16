import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/client/HomePage";
import ClientLayout from "../../layouts/client/ClientLayout";
import BlogDetail from "../../pages/client/blogpage/BlogDetail";
export default function ClientRoute() {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<HomePage />}/>
                <Route path="Home" element={<HomePage />}/>
                <Route path="bai-viet/:alias/:id" element={<BlogDetail />}/>
            </Route>
        </Routes>
    );
}