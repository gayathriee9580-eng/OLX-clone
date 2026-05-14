import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const adminToken =
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);

      setProduct({
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        category: res.data.category,
        location: res.data.location,
        image: res.data.image,
      });
    } catch (error) {
      console.log(error);
      alert("Product not found");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
if (!image) {
  setPreview(null);
  return;
}
  const objectUrl = URL.createObjectURL(image);
  setPreview(objectUrl);

  return () => URL.revokeObjectURL(objectUrl);
}, [image]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

 const updateProduct = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("location", product.location);

    if (image) {
      formData.append("image", image);
    }

    await axios.put(
      `http://localhost:5000/api/admin/products/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Product updated successfully");

    setTimeout(() => {
    navigate("/admin/products");
    }, 800);

  } catch (error) {
    console.log(error);
    alert("Update failed");
  } finally {
    setLoading(false); 
  }
};


  return (
    <div className="app">
      <h1>Edit Product</h1>

      <form className="product-form" onSubmit={updateProduct}>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="Product title"
          required
        />

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
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
          value={product.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
       {/* Existing image (before change) */}
{!image && product.image && (
  <img
    src={`http://localhost:5000/uploads/${product.image}`}
    alt="product"
    style={{
      width: "150px",
      marginBottom: "10px",
      borderRadius: "10px",
    }}
  />
)}

{/* New selected image preview */}
{image && (
  <img
    src={preview}
    alt="preview"
    style={{
      width: "150px",
      marginBottom: "10px",
      borderRadius: "10px",
    }}
  />
)}

{/* File input (ONLY ONE) */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>
<button type="submit" disabled={loading}>        
    {loading ? "Updating..." : "Update Product"}
    </button>        
      </form>
    </div>
  );
}

export default AdminEditProduct;