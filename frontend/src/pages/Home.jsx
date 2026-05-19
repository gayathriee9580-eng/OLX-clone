import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home({ search }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");

  const [wishlist, setWishlist] = useState([]);
  const [sort, setSort] = useState("latest");


const filteredProducts = products
  .filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const fetchProducts = async () => {
    const res = await axios.get("https://olx-clone-vgy9.onrender.com/api/products");
    setProducts(res.data);
  };


 const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      "https://olx-clone-vgy9.onrender.com/api/wishlist",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setWishlist(res.data);
  } catch (err) {
    console.log(err.response?.data || err.message); 
  }
};

useEffect(() => {
  fetchProducts();
  fetchWishlist();
}, []);


const addToWishlist = async (e, productId) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first");
      return;
    }

    await axios.post(
      `https://olx-clone-vgy9.onrender.com/api/wishlist/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchWishlist(); 
  } catch (err) {
    console.log(err);
  }
};


  return (
    <div className="app">
      <h1>Fresh Recommendation</h1>

        <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="search-input"
        >
        <option value="All">All Categories</option>
        <option value="Mobiles">Mobiles</option>
        <option value="Electronics">Electronics</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Furniture">Furniture</option>
        <option value="Home Decor">Home Decor</option>
        <option value="Kitchen Essentials">Kitchen Essentials</option>
        </select>

        <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="search-input"
        >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
        </select>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <Link
            to={`/products/${product._id}`}
            key={product._id}
            style={{ textDecoration: "none", color: "white" }}
          >
            <div
            className="product-card"
            style={{ position: "relative" }}
            >                
              <img
                src={`https://olx-clone-vgy9.onrender.com/uploads/${product.image}`}
                alt=""
              />
                <button
                onClick={(e) => addToWishlist(e, product._id)}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "white",
                    borderRadius: "50%",
                    border: "none",
                    padding: "6px 10px",
                    cursor: "pointer",
                }}
                >
                {wishlist.some(item => item._id === product._id) ? "❤️" : "🤍"}
                </button>

              <div className="product-info">
                <h2>{product.title}</h2>

                <p>{product.description}</p>

                <h3 className="price">₹ {product.price}</h3>

                <p>{product.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;