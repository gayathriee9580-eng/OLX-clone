import { useState } from "react";
import axios from "axios";

function AdminAddProduct() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const adminToken =
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("location", product.location);
    formData.append("category", product.category);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/admin/products", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully");

      setProduct({
        title: "",
        description: "",
        price: "",
        location: "",
        category: "",
      });
      setImage(null);
    } catch (error) {
      console.log(error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="app">
      <h1>Add Product</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Product title"
          value={product.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product description"
          value={product.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Electronics">Electronics</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Furniture">Furniture</option>
          <option value="Home Decor">Home Decor</option>
          <option value="Kitchen Essentials">Kitchen Essentials</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={product.location}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AdminAddProduct;