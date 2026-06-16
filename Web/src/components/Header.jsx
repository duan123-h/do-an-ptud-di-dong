import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import outpatientclinicService from '../services/OutpatientclinicService';
import departmentService from '../services/DepartmentService';
export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [outpatientclinictData, setOutpatientclinictData] = useState([]);
  const [departmenttData, setDepartmenttData] = useState([]);
  function handleOpenModel() {
    setShowModal(true);
  }
  const handleSave = () => {
    if (!selectedClinic) {
      toast.error("Vui lòng chọn phòng khám!");
      return;
    }
    localStorage.setItem("selectedClinic", selectedClinic);
    localStorage.setItem("selectedDepartment", selectedDepartment);
    toast.success("Thiết lập phòng khám thành công");
    setShowModal(false);
  };
  const fetchOutpatientclinictData = async (departmentid) => {
        try {
          const params={departmentid:departmentid};
          const response = await outpatientclinicService.getAll(params);
          console.log(response.data);
          setOutpatientclinictData(response.data);      
        } catch (error) {
          console.error("Error fetching:", error);
        }
      };
  const onChangeDepartment= async(departmentid)=>{
    setSelectedDepartment(departmentid);
    fetchOutpatientclinictData(departmentid);
  }
  const fetchDepartmentData = async () => {
      try {
        const response = await departmentService.getAll();
        console.log(response.data);
        setDepartmenttData(response.data);      
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({});
  async function getDataAdmin() {
    let user = localStorage.getItem("user");
    if (user) {
      setAdminData(JSON.parse(user));
    }
  };
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  useEffect(() => {
    getDataAdmin();
    if (sidebarOpen) {
      document.body.classList.add('toggle-sidebar');
    } else {
      document.body.classList.remove('toggle-sidebar');
    }
  }, [sidebarOpen]);
  
  useEffect(() => {
    fetchDepartmentData();
  }, []);
  useEffect(() => {
    getDataAdmin();
  }, [location]);
  function logout() {
    localStorage.clear();
    navigate("/login");
  }
  // useEffect(() => {
  //   toast.success("test header");
  // }, [location]);
  return (
    <>
      {showModal && (
        <div
          className="modal fade show"
          id="clinicModal"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content text-white ">
              <div className="modal-header border-0 bg-primary">
                <h5 className="modal-title fw-bold">Thiết lập phòng khám</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label text-white fw-semibold">
                    Chọn khoa
                  </label>
                  <select
                    className="form-select border-1"
                    value={selectedDepartment}
                    onChange={(e) => onChangeDepartment(e.target.value)}
                  >
                    <option value="">-- Chọn khoa --</option>
                    {departmenttData.map((d) => (
                      <option key={d.departmentid} value={d.departmentid}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label text-white fw-semibold">
                    Chọn phòng khám
                  </label>
                  <select
                    className="form-select border-1"
                    value={selectedClinic}
                    onChange={(e) => setSelectedClinic(e.target.value)}
                  >
                    <option value="">-- Chọn phòng khám --</option>
                    {outpatientclinictData.map((clinic) => (
                      <option key={clinic.outpatientclinicid} value={clinic.outpatientclinicid}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
                <button className="btn btn-dark" onClick={handleSave}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="index.html" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt="" />
            <span className="d-none d-lg-block">NiceAdmin</span>
          </Link>
          <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
        </div>

        <div className="search-bar">
          <form className="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i className="bi bi-search"></i></button>
          </form>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">

            <li className="nav-item d-block d-lg-none">
              <Link className="nav-link nav-icon search-bar-toggle " to="#">
                <i className="bi bi-search"></i>
              </Link>
            </li>

            <li className="nav-item dropdown">

              <Link className="nav-link nav-icon" to="#" data-bs-toggle="dropdown">
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <Link to="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Atque rerum nesciunt</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Sit rerum fuga</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Dicta reprehenderit</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-footer">
                  <Link to="#">Show all notifications</Link>
                </li>

              </ul>

            </li>

            <li className="nav-item dropdown">

              <Link className="nav-link nav-icon" to="#" data-bs-toggle="dropdown">
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number">3</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                  You have 3 new messages
                  <Link to="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <Link to="#">
                    <img src="/assets/img/messages-1.jpg" alt="" className="rounded-circle" />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>4 hrs. ago</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <Link to="#">
                    <img src="/assets/img/messages-2.jpg" alt="" className="rounded-circle" />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>6 hrs. ago</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <Link to="#">
                    <img src="/assets/img/messages-3.jpg" alt="" className="rounded-circle" />
                    <div>
                      <h4>David Muldon</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>8 hrs. ago</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                  <Link to="#">Show all messages</Link>
                </li>

              </ul>

            </li>

            <li className="nav-item dropdown pe-3">

              <Link className="nav-link nav-profile d-flex align-items-center pe-0" to="#" data-bs-toggle="dropdown">
                <img src={adminData.avatar} alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">{adminData.name}</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{adminData.name}</h6>
                  <span>Role</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="users-profile.html">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="users-profile.html">
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="pages-faq.html">
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center" onClick={handleOpenModel}>
                    <i class="bi bi-gear"></i>
                    <span>Thiết lập phòng khám</span>
                  </button>
                </li>

                <li>
                  <button className="dropdown-item d-flex align-items-center" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Đăng xuất</span>
                  </button>
                </li>

              </ul>
            </li>
          </ul>
        </nav>

      </header>
    </>

  );
}