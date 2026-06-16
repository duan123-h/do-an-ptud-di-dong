import { useState, useEffect } from "react";
import { Link, useNavigate , useLocation, data } from "react-router-dom";
import toast from 'react-hot-toast';
import outpatientclinicService from '../../services/OutpatientclinicService';
import departmentService from '../../services/DepartmentService';
export default function Header() {
  const [doctorData,setDoctorData]=useState({});
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [outpatientclinictData, setOutpatientclinictData] = useState([]);
  const [departmenttData, setDepartmenttData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function getDoctorData() {
    let user = localStorage.getItem("user");
    if (user) {
      setDoctorData(JSON.parse(user));
    } 
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
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('toggle-sidebar');
    } else {
      document.body.classList.remove('toggle-sidebar');
    }
  }, [sidebarOpen]);
  function handleOpenModel(){
    setShowModal(true);
  }
  useEffect(() => {
    getDoctorData();
    fetchDepartmentData();
  }, []);
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
useEffect(() => {
  const savedClinic = localStorage.getItem("selectedClinic");
  if (savedClinic) {
    setSelectedClinic(savedClinic);
  } else {
    handleOpenModel(); 
  }
}, [doctorData]);
  // useEffect(() => {
  //   toast.success("test header");
  // }, [location]);
  function logout(){
    localStorage.clear();
    navigate("/his/login");
  }
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
      <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <a href="index.html" class="logo d-flex align-items-center">
        <img src="~/assets/img/logo.png" alt=""/>
        <span class="d-none d-lg-block">NiceAdmin</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
    </div>

    <div class="search-bar">
      <form class="search-form d-flex align-items-center" method="POST" action="#">
        <input type="text" name="query" placeholder="Search" title="Enter search keyword"/>
        <button type="submit" title="Search"><i class="bi bi-search"></i></button>
      </form>
    </div>

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">

        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li>

        <li class="nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span class="badge bg-primary badge-number">4</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have 4 new notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="notification-item">
              <i class="bi bi-exclamation-circle text-warning"></i>
              <div>
                <h4>Lorem Ipsum</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>30 min. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="notification-item">
              <i class="bi bi-x-circle text-danger"></i>
              <div>
                <h4>Atque rerum nesciunt</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>1 hr. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="notification-item">
              <i class="bi bi-check-circle text-success"></i>
              <div>
                <h4>Sit rerum fuga</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>2 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="notification-item">
              <i class="bi bi-info-circle text-primary"></i>
              <div>
                <h4>Dicta reprehenderit</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>4 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider"/>
            </li>
            <li class="dropdown-footer">
              <a href="#">Show all notifications</a>
            </li>

          </ul>

        </li>

        <li class="nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-chat-left-text"></i>
            <span class="badge bg-success badge-number">3</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li class="dropdown-header">
              You have 3 new messages
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="message-item">
              <a href="#">
                <img src="~/assets/img/messages-1.jpg" alt="" class="rounded-circle"/>
                <div>
                  <h4>Maria Hudson</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>4 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="message-item">
              <a href="#">
                <img src="~/assets/img/messages-2.jpg" alt="" class="rounded-circle"/>
                <div>
                  <h4>Anna Nelson</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>6 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="message-item">
              <a href="#">
                <img src="~/assets/img/messages-3.jpg" alt="" class="rounded-circle"/>
                <div>
                  <h4>David Muldon</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>8 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li class="dropdown-footer">
              <a href="#">Show all messages</a>
            </li>

          </ul>

        </li>

        <li class="nav-item dropdown pe-3">

          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img src={doctorData.avartar} alt="Profile" class="rounded-circle"/>
            <span class="d-none d-md-block dropdown-toggle ps-2">{doctorData.fullname}</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li class="dropdown-header">
              <h6>{doctorData.fullname}</h6>
              <span>RoleName</span>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                <i class="bi bi-person"></i>
                <span>My Profile</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                <i class="bi bi-gear"></i>
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="pages-faq.html">
                <i class="bi bi-question-circle"></i>
                <span>Need Help?</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"/>
            </li>
            <li>
              <button class="dropdown-item d-flex align-items-center" onClick={handleOpenModel}>
                <i class="bi bi-gear"></i>
                <span>Thiết lập phòng khám</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item d-flex align-items-center" onClick={logout}>
                <i class="bi bi-box-arrow-right"></i>
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