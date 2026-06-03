import { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("location", form.location);
      data.append("image", image);

      await axios.post(
        "https://olx-clone-vgy9.onrender.com/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Product Added");
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  return (
    <div className="app">
      <form onSubmit={addProduct} className="product-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Enter detailed product description..."
          value={form.description}
          onChange={handleChange}
          rows="5"
          maxLength="1000"
          required
        />
        <p className="char-count">
        {form.description.length}/1000 characters
      </p>

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;