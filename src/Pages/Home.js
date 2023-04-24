import React from "react";
import { Link, Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav className=" bg-blue-400  flex flex-col  items-center text-white capitalize">
        <p className=" font-bold mt-2 ">tunisiatrinkets</p>
        <ul className="flex">
          <Link to="/dash" className="navitems">
            dashboard
          </Link>
          <Link to="/addprod" className="navitems">
            add product
          </Link>
          <Link to="/prod" className="navitems">
            products
          </Link>
          <Link to="category" className="navitems">
            category
          </Link>
          {/* <Link to="Coupon" className="navitems">
            Coupon code
          </Link> */}
          <Link to="/orders" className="navitems">
            orders
          </Link>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Home;
