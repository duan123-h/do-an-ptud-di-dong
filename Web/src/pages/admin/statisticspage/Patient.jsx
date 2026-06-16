import { useEffect, useState } from "react";
import Statistic from "../../../services/StatisticService";
import toast from "react-hot-toast";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { useLocation } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Patient() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({ startDate: "", endDate: "" });
    const [data, setData] = useState({
        totalPatients: 0,
        patientByGender: [],
        patientByAge: [],
        patientByProvince: [],
        patientByEthnic: [],
        newPatientByDate: []
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await Statistic.getPatient(filter);
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.message || "Lấy dữ liệu thất bại");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };
     const fetchAllData = async () => {
        try {
            setLoading(true);
            const res = await Statistic.getPatient();
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.message || "Lấy dữ liệu thất bại");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [location]);

    const handleFilterChange = (e) => {
        setFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };
    const handleFilterAll = (e) => {
        setFilter({ startDate: "", endDate: "" });
        e.preventDefault();
        fetchAllData();
    };

    const generateColors = (count) => Array.from({ length: count }, () => `hsl(${Math.random() * 360}, 70%, 60%)`);

    const lineData = {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
        datasets: [{
            label: "Bệnh nhân mới",
            data: (() => {
                const arr = Array(12).fill(0);
                data.newPatientByDate.forEach(x => { arr[x.month - 1] = x.total; });
                return arr;
            })(),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75,192,192,0.2)",
            tension: 0.1
        }]
    };

    const pieOptions = { plugins: { legend: { position: "top" } } };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Thống kê bệnh nhân</h2>

            <form className="mb-4 row g-3" onSubmit={handleFilterSubmit}>
                <div className="col-md-3">
                    <label className="fw-bold">Từ ngày</label>
                    <input type="date" name="startDate" className="form-control" value={filter.startDate} onChange={handleFilterChange} />
                </div>
                <div className="col-md-3">
                    <label className="fw-bold">Đến ngày</label>
                    <input type="date" name="endDate" className="form-control" value={filter.endDate} onChange={handleFilterChange} />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-primary w-100" type="submit">Lọc</button>
                </div>
            </form>
            <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={handleFilterAll}>Tất cả</button>
            </div>

            <div className="text-center text-primary fs-4 fw-bold mb-4">
                Tổng số bệnh nhân: {data.totalPatients}
            </div>

            <div className="card shadow-sm mb-5">
                <div className="card-header bg-primary text-white fw-bold">Số bệnh nhân mới theo tháng</div>
                <div className="card-body">
                    <Line data={lineData} options={{ scales: { y: { beginAtZero: true } } }} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <h5 className="card-title">Thống kê theo giới tính</h5>
                        <div className="card-body" style={{maxHeight:'400px'}}>
                            <Pie
                                data={{
                                    labels: data.patientByGender.map(x => x.gender),
                                    datasets: [{ data: data.patientByGender.map(x => x.total), backgroundColor: ["rgb(255,99,132)", "rgb(54,162,235)"] }]
                                }}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <h5 className="card-title">Thống kê theo nhóm tuổi</h5>
                        <div className="card-body" style={{maxHeight:'400px'}}>
                            <Pie
                                data={{
                                    labels: data.patientByAge.map(x => x.age_group),
                                    datasets: [{ data: data.patientByAge.map(x => x.total), backgroundColor: generateColors(data.patientByAge.length) }]
                                }}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <h5 className="card-title">Thống kê theo tỉnh</h5>
                        <div className="card-body" style={{maxHeight:'400px'}}>
                            <Pie
                                data={{
                                    labels: data.patientByProvince.map(x => x.province || "Không xác định"),
                                    datasets: [{ data: data.patientByProvince.map(x => x.total), backgroundColor: generateColors(data.patientByProvince.length) }]
                                }}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <h5 className="card-title">Thống kê theo dân tộc</h5>
                        <div className="card-body" style={{maxHeight:'400px'}}>
                            <Pie
                                data={{
                                    labels: data.patientByEthnic.map(x => x.ethnic || "Không xác định"),
                                    datasets: [{ data: data.patientByEthnic.map(x => x.total), backgroundColor: generateColors(data.patientByEthnic.length) }]
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
