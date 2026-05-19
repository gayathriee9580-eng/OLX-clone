import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://olx-clone-vgy9.onrender.com/api/products/${id}`
      );

      setForm({
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        category: res.data.category,
        location: res.data.location,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://olx-clone-vgy9.onrender.com/api/products/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Product Updated");

      navigate("/my-products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">
      <form
        onSubmit={updateProduct}
        className="product-form"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
        />

        <button type="submit">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;