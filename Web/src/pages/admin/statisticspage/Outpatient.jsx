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

export default function Outpatient() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ startDate: "", endDate: "" });
  const [data, setData] = useState({
    totalVisits: 0,
    visitByDepartment: [],
    visitByClinic: [],
    visitByMonth: [],
    visitByStatus: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await Statistic.getOutpatient(filter);
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
      const res = await Statistic.getOutpatient();
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
  const monthData = Array(12).fill(0);
  data.visitByMonth.forEach(x => { monthData[x.month - 1] = x.total; });
  const lineData = {
    labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
    datasets: [{
      label: "Lượt đăng ký khám",
      data: monthData,
      borderColor: "rgb(75,192,192)",
      backgroundColor: "rgba(75,192,192,0.2)",
      tension: 0.1
    }]
  };

  const pieOptions = { plugins: { legend: { position: "top" } } };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Thống kê đăng ký khám bệnh</h2>

      <form className="mb-4 row g-3" onSubmit={handleFilterSubmit}>
        <div className="col-md-3">
          <label className="fw-bold">Từ ngày</label>
          <input type="date" name="startDate" className="form-control"
            value={filter.startDate} onChange={handleFilterChange} />
        </div>
        <div className="col-md-3">
          <label className="fw-bold">Đến ngày</label>
          <input type="date" name="endDate" className="form-control"
            value={filter.endDate} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" type="submit">Lọc</button>
        </div>
      </form>
      <div className="col-md-2 d-flex align-items-end mb-3">
        <button className="btn btn-primary w-100" onClick={handleFilterAll}>Tất cả</button>
      </div>

      <div className="text-center text-primary fs-4 fw-bold mb-4">
        Tổng số lượt đăng ký khám: {data.totalVisits}
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white fw-bold">Lượt đăng ký khám theo tháng</div>
        <div className="card-body">
          <Line data={lineData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <h5 className="card-title">Thống kê theo khoa</h5>
            <div className="card-body" style={{ maxHeight: 400 }}>
              <Pie data={{
                labels: data.visitByDepartment.map(x => x.department || "Không xác định"),
                datasets: [{ data: data.visitByDepartment.map(x => x.total), backgroundColor: generateColors(data.visitByDepartment.length) }]
              }} options={pieOptions} />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <h5 className="card-title">Thống kê theo phòng khám</h5>
            <div className="card-body" style={{ maxHeight: 400 }}>
              <Pie data={{
                labels: data.visitByClinic.map(x => x.clinic || "Không xác định"),
                datasets: [{ data: data.visitByClinic.map(x => x.total), backgroundColor: generateColors(data.visitByClinic.length) }]
              }} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <h5 className="card-title">Theo trạng thái khám</h5>
            <div className="card-body" style={{ maxHeight: 400 }}>
              <Pie data={{
                labels: data.visitByStatus.map(x => x.status || "Không xác định"),
                datasets: [{ data: data.visitByStatus.map(x => x.total), backgroundColor: generateColors(data.visitByStatus.length) }]
              }} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
