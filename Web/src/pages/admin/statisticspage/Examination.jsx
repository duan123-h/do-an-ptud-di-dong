import { useEffect, useState } from "react";
import Statistic from "../../../services/StatisticService";
import toast from "react-hot-toast";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, ArcElement, PointElement, Title, Tooltip, Legend);

export default function Examination() {
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({ startDate: "", endDate: "" });
    const [data, setData] = useState({
        examByDisease: [],
        examByTreatment: []
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await Statistic.getExamination(filter);
            if (res.success) setData(res.data);
            else toast.error(res.message || "Lấy dữ liệu thất bại");
        } catch (error) {
            toast.error(error.message || "Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const res = await Statistic.getExamination();
            if (res.success) setData(res.data);
            else toast.error(res.message || "Lấy dữ liệu thất bại");
        } catch (error) {
            toast.error(error.message || "Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleFilterAll = (e) => {
        e.preventDefault();
        setFilter({ startDate: "", endDate: "" });
        fetchAllData();
    };

    const generateColors = (count) =>
        Array.from({ length: count }, () => `hsl(${Math.random() * 360},70%,60%)`);

    const pieOptions = { plugins: { legend: { position: "top" } } };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Thống kê khám bệnh</h2>

            <form className="mb-4 row g-3" onSubmit={handleFilterSubmit}>
                <div className="col-md-3">
                    <label className="fw-bold">Từ ngày</label>
                    <input
                        type="date"
                        name="startDate"
                        className="form-control"
                        value={filter.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="fw-bold">Đến ngày</label>
                    <input
                        type="date"
                        name="endDate"
                        className="form-control"
                        value={filter.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-primary w-100" type="submit">Lọc</button>
                </div>
            </form>

            <div className="col-md-2 d-flex align-items-end mb-3">
                <button className="btn btn-primary w-100" onClick={handleFilterAll}>Tất cả</button>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <h5 className="card-title">Thống kê theo bệnh</h5>
                        <div className="card-body" style={{ maxHeight: 400 }}>
                            <Pie
                                data={{
                                    labels: data.examByDisease.map(x => x.disease || "Không xác định"),
                                    datasets: [{
                                        data: data.examByDisease.map(x => x.total),
                                        backgroundColor: generateColors(data.examByDisease.length)
                                    }]
                                }}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <h5 className="card-title">Thống kê theo loại xử trí</h5>
                        <div className="card-body" style={{ maxHeight: 400 }}>
                            <Pie
                                data={{
                                    labels: data.examByTreatment.map(x => x.treatment || "Không xác định"),
                                    datasets: [{
                                        data: data.examByTreatment.map(x => x.total),
                                        backgroundColor: generateColors(data.examByTreatment.length)
                                    }]
                                }}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
