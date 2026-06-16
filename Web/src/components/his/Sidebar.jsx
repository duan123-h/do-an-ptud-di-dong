import { Link } from 'react-router-dom';
export default function sidebar() {
    return (
        <aside id="sidebar" class=" sidebar" >
            <ul class="accordion sidebar-nav" id="accordionExample">
                <li class="nav-item">
                    <button class="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false">
                        <i class="fa-solid fa-bars me-2 fs-5"></i> Ngoại trú
                    </button>
                    <ul id="collapseOne" class="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <li class="nav-item">
                            <Link class="ps-0 nav-link collapsed" to="/His/Reception"><i class="me-2"></i>Tiếp nhận bệnh nhận</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="ps-0 nav-link collapsed" to="/His/Medicalexam"><i class="me-2"></i>Khám bệnh</Link>
                        </li>
                    </ul>
                </li>

                <li class="nav-link">
                    <Link class="ps-0 nav-link collapsed" to="/his/clsrequest/"><i class="fa-solid fa-bars me-2 fs-5"></i>Quản lý cận lâm sàng</Link>
                    {/* <button class="accordion-button collapsed nav-link " type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false">
                        <Link class="ps-0 nav-link collapsed" to="/his/clsrequest/"><i class="me-2"></i>Quản lý cận lâm sàng</Link>
                    </button> */}
                    {/* <ul id="collapseTwo" class="nav-item accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <li class="nav-item">
                            <Link class="ps-0 nav-link collapsed" to="/his/clsrequest/"><i class="me-2"></i>Ngoại trú</Link>
                        </li>

                    </ul> */}
                </li>
            </ul>
        </aside>
    );
}