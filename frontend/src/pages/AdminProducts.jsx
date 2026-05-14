import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const adminToken =
  localStorage.getItem("adminToken") || localStorage.getItem("token");

  const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/300x200?text=No+Image";

  if (image.startsWith("http")) return image;

  if (image.startsWith("uploads/")) {
    return `http://localhost:5000/${image}`;
  }

  return `http://localhost:5000/uploads/${image}`;
};

  const fetchAdminProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products", {
        headers: {
            Authorization: `Bearer ${adminToken}`,  
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.log(error);
      alert("Admin access only");
    }
  };

const deleteProduct = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/admin/products/${id}`,
      {
        headers: {
            Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    alert("Product Deleted");

    fetchAdminProducts();
  } catch (error) {
    console.log(error);
    alert("Delete failed");
  }
};


  useEffect(() => {
    fetchAdminProducts();
  }, []);

  return (
    <div className="app">
      <h1>Admin Products</h1>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img
            src={getImageUrl(product.image)}
            alt={product.title}
            />

            <div className="product-info">
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <h3 className="price">₹ {product.price}</h3>
              <p>{product.location}</p>
              <p>Seller: {product.seller?.name}</p>
              <Link to={`/admin/edit-product/${product._id}`}>
                <button className="edit-btn">Edit Product</button>
                </Link>
                <button
                    onClick={() => deleteProduct(product._id)}
                    style={{
                    marginTop: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                    }}
                >
                    Delete Product
                </button>
                </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;