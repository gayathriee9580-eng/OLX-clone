import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyProducts() {
  const [products, setProducts] = useState([]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/my-products",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const deleteProduct = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Product Deleted");

    fetchMyProducts();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="app">
      <h1>My Products</h1>

      <div className="products-grid">
        {products.map((product) => (
            <div
            key={product._id}
            className="product-card"
            >
            <div className="product-card">
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt=""
              />

              <div className="product-info">
                    <Link
                    to={`/products/${product._id}`}
                    style={{ textDecoration: "none", color: "white" }}
                    >
                    <h2>{product.title}</h2>
                    </Link>
                <p>{product.description}</p>

                <h3 className="price">₹ {product.price}</h3>

                <p>{product.location}</p>
                <Link
                to={`/edit-product/${product._id}`}>
                <button
                    style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "10px",
                    marginRight: "10px",
                    }}
                >
                    Edit
                </button>
                </Link>

                <button
                    onClick={() => deleteProduct(product._id)}
                    style={{
                        background: "grey",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "10px",
                    }}
                    >
                    Delete
                    </button>
              </div>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default MyProducts;