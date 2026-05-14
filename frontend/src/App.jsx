import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddProduct from "./pages/AddProduct";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  return (
    <BrowserRouter>
      <Navbar search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>}/>
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/edit-product/:id" element={<EditProduct />}/>
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Home search={search} />} />

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;