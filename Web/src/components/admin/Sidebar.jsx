import { Link } from 'react-router-dom';
export default function sidebar() {
  return (
    <aside id="sidebar" className=" sidebar">
      <ul className="accordion sidebar-nav" id="accordionExample">
        <li class="nav-item">
          <button class="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse1" aria-expanded="false">
            <i class="fa-solid fa-swatchbook me-2"></i> Thống kê
          </button>
          <ul id="collapse1" class="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li class="nav-item">
              <Link class="ps-0 nav-link collapsed" to="/Admin/Statistics/Patient"><i class="me-2"></i>Bệnh
                nhân</Link>
            </li>
            <li class="nav-item">
              <Link class="ps-0 nav-link collapsed" to="/Admin/Statistics/Outpatient"><i class="me-2"></i>Đăng
                ký khám</Link>
            </li>
            <li class="nav-item">
              <Link class="ps-0 nav-link collapsed" to="/Admin/Statistics/Examination"><i class="me-2"></i>Khám
                bệnh</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false">
            <i className="fa-solid fa-bars me-2 fs-5"></i> Quản lý menu
          </button>
          <ul id="collapseOne" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Menu"><i className="me-2"></i>Danh sách</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/menu/create"><i className="me-2"></i>Thêm mới</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false">
            <i className="fa-solid fa-sliders me-2 fs-5"></i>Quản lý slider
          </button>
          <ul id="collapseTwo" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Slider"><i className="me-2"></i>Danh sách</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Slider/Create"><i className="me-2"></i>Thêm mới</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false">
            <i className="fa-solid fa-book-bookmark me-2 fs-5"></i> Quản lý bệnh
          </button>
          <ul id="collapseThree" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Diseasegroup"><i className="me-2"></i>Nhóm bệnh</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Disease"><i className="me-2"></i>Bệnh</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false">
            <i className="fa-solid fa-feather fs-5 me-2"></i> Quản lý khoa
          </button>
          <ul id="collapseFour" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Department"><i className="me-2"></i>Danh sách</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Department/Create"><i className="me-2"></i>Thêm mới</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false">
            <i className="fa-solid fa-pen me-2 fs-6"></i> Quản lý phòng
          </button>
          <ul id="collapseFive" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Outpatientclinic"><i className="me-2"></i>Phòng khám</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Room"><i className="me-2"></i>Phòng điều trị</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/Roomtype"><i className="me-2"></i>Loại phòng điều trị</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false">
            <i className="fa-solid fa-user me-2 fs-6"></i> Quản lý người dùng
          </button>
          <ul id="collapseSix" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/user"><i className="me-2"></i>Danh sách</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/user/create"><i className="me-2"></i>Thêm mới</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false">
            <i className="fa-brands fa-blogger fs-5 me-2 fw-blod"></i> Quản lý Blog
          </button>
          <ul id="collapseSeven" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/blog"><i className="me-2"></i>Danh sách</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/blog/Create"><i className="me-2"></i>Thêm mới</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false">
            <i className="fa-solid fa-swatchbook me-2"></i> Quản lý dịch vụ
          </button>
          <ul id="collapseEight" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/servicecategory"><i className="me-2"></i>Loại dịch vụ</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/service"><i className="me-2"></i>dịch vụ</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false">
            <i className="fa-solid fa-swatchbook me-2"></i> Quản lý thuốc
          </button>
          <ul id="collapseNine" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/dosageform"><i className="me-2"></i>Dạng điều chế</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/medicine/"><i className="me-2"></i>Thuốc</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/admin/warehouse"><i className="fa-solid fa-bars me-2 fs-5"></i>Quản lý kho dược</Link>
        </li>
        <li className="nav-item">
          <button className="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseElleven" aria-expanded="false">
            <i className="fa-solid fa-swatchbook me-2"></i> Quản lý bác sĩ
          </button>
          <ul id="collapseElleven" className="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/doctor"><i className="me-2"></i>Danh sách</Link>
            </li>
            <li className="nav-item">
              <Link className="ps-0 nav-link collapsed" to="/admin/doctor/create"><i className="me-2"></i>Thêm mới</Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/admin/contact"><i className="fa-solid fa-bars me-2 fs-5"></i>Quản lý liên hệ</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/Admin/Ai/UpdateData"><i className="fa-solid fa-bars me-2 fs-5"></i>Cập nhật dữ liệu chatbot</Link>
        </li>
      </ul>
    </aside>
  );
}