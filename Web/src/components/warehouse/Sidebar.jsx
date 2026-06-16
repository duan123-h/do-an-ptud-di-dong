import { Link } from 'react-router-dom';
export default function sidebar() {
  return (
    <aside id="sidebar" className=" sidebar">
      <ul className="accordion sidebar-nav" id="accordionExample">
        <li class="p-3 py-1">
          <Link class="ps-0 nav-link collapsed" to="/warehouse/inventory/"><i class="fa-solid fa-bars me-2 fs-5"></i>Quản lý tồn kho</Link>
        </li>
        <li class="p-3 py-1">
          <Link class="ps-0 nav-link collapsed" to="/warehouse/importreceipt/"><i class="fa-solid fa-bars me-2 fs-5"></i>Quản lý nhập kho</Link>
        </li>
        <li class="nav-item">
          <button class="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseduoc" aria-expanded="false">
            <i class="fa-solid fa-bars me-2 fs-5"></i> Quản lý xuất kho dược
          </button>
          <ul id="collapseduoc" class="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
            <li class="nav-item">
              <Link class="ps-0 nav-link collapsed" to="/warehouse/exportprescription"><i class="me-2"></i>Xuất theo đơn thuốc</Link>
            </li>
            {/* <li class="nav-item">
              <Link class="ps-0 nav-link collapsed" to="/His/Medicalexam"><i class="me-2"></i>Khám bệnh</Link>
            </li> */}
          </ul>
        </li>
      </ul>
    </aside>
  );
}