import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../../services/MenuService"
import toast from 'react-hot-toast';
export default function Header() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const fetchMenuData = async () => {
    try {
      const params = { status: 1 }
      const response = await Menu.getAll(params);
      console.log(response.data);
      setMenuData(response.data);
    } catch (error) {
      console.error("Error fetching Menus:", error);
    }
  };
  useEffect(() => {
    fetchMenuData();
  }, [])
  return (
    <header>
      <nav
        className="navbar navbar-expand-lg navbar-dark py-0"
        style={{ background: "rgba(237, 255, 250, 1)" }}
      >
        <div className="container-md px-2">
          <Link
            className="navbar-brand fs-5 d-flex align-items-center text-warning justify-content-start fw-bold"
            to="/"
          >
            <div className="me-1 d-inline" style={{ minWidth: "80px", width: "80px" }}>
              <svg
                viewBox="0 0 166.63 146.21"
                preserveAspectRatio="none"
                width="auto"
                height="auto"
              >
                <path
                  d="M73.11 41.43a31.68 31.68 0 1 0 31.68 31.68 31.68 31.68 0 0 0-31.68-31.68m19.9 38H79.43v13.65H66.78V79.43H53.21V66.78h13.57V53.13h12.65v13.65H93Z"
                  fill="#49bce2"
                />
                <path
                  d="M73.11 125.24A52.13 52.13 0 0 1 21 74.49V21.88a73.09 73.09 0 1 0 107.67 98.74L112.71 107a52 52 0 0 1-39.6 18.24M73.11 0A72.82 72.82 0 0 0 44.3 5.91l-.3.15a3.76 3.76 0 0 0-2.13 3.37v22A52.14 52.14 0 0 1 113.36 40l16.19-13.33A73 73 0 0 0 73.11 0"
                  fill="#49bce2"
                />
              </svg>
            </div>
            Bệnh viện bạch mai
          </Link>

          <div
            className="navbar-toggler border border-0 bg-secondary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </div>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {menuData
                .filter((m) => m.levels === 1)
                .map((item) => {
                  const item2 = menuData.filter(
                    (m) => m.levels === 2 && m.parentid === item.menuid
                  );
                  return item2.length === 0 ? (
                    <li className="nav-item mx-2" key={item.menuid}>
                      <Link
                        className="nav-link text-dark text-nowrap fs-6"
                        aria-current="page"
                        to={item.link}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item dropdown mx-2" key={item.menuid}>
                      <a
                        className="nav-link dropdown-toggle text-dark text-nowrap"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {item.title}
                      </a>
                      <ul className="dropdown-menu">
                        {item2.map((sub) => (
                          <li key={sub.menuid}>
                            <Link
                              className="dropdown-item text-dark text-nowrap"
                              to={sub.link}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
            </ul>

            <form action="/blog" method="get" className="d-flex">
              <input
                className="form-control me-2"
                name="search"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-secondary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>

  );
}