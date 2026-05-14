import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <div className="app">
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "#1f2937",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <img
          src={`http://localhost:5000/uploads/${product?.image}`}
          alt=""
          width="100%"
          style={{
            borderRadius: "20px",
            height: "400px",
            objectFit: "cover",
          }}
        />

        <h1>{product?.title}</h1>

        <p>{product?.description}</p>

        <h2 className="price">₹ {product?.price}</h2>

        <p>{product?.location}</p>

        <hr />

        <h3>Seller Details</h3>

        <p>Name: {product?.seller?.name}</p>
        <p>Email: {product?.seller?.email}</p>

        {/* WhatsApp + Call */}
    {/* WhatsApp + Call */}
{product?.seller?.phone && (
  <>
    {/* 🟢 WhatsApp */}
    <a
      href={`https://wa.me/${product?.seller?.phone}?text=Hi, I'm interested in your product: ${product?.title}`}
      target="_blank"
      rel="noreferrer"
    >
      <button
        style={{
          marginTop: "15px",
          background: "#25D366",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "10px",
          width: "100%",
          fontSize: "16px",
        }}
      >
        🟢 WhatsApp
      </button>
    </a>

    {/* 📞 Call */}
    <a href={`tel:${product?.seller?.phone}`}>
      <button
        style={{
          marginTop: "10px",
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "10px",
          width: "100%",
          fontSize: "16px",
        }}
      >
        📞 Call
      </button>
    </a>
  </>
)}
      </div>
    </div>
  );
}

export default ProductDetails;