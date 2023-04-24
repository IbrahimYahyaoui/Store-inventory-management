import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddProduct from "./Pages/AddProduct";
import Products from "./Pages/Products";
import Category from "./Pages/Category";
import EditProduct from "./Pages/EditProduct";
import CouponCode from "./Pages/CouponCode";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />}>
      <Route path="dash" element={<Dashboard />} />
      <Route path="addprod" element={<AddProduct />} />
      <Route path="prod" element={<Products />} />
      <Route path="category" element={<Category />} />
      <Route path="edit/:id" element={<EditProduct />} />
      <Route path="orders" element={<Orders />} />
      <Route path="ordersDetails/:id" element={<OrderDetails />} />
      <Route path="Coupon" element={<CouponCode />} />
    </Route>
  )
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
