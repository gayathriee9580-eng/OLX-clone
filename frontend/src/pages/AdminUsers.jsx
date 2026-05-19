import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);

const adminToken = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://olx-clone-vgy9.onrender.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.log(error);
      alert("Admin access only");
    }
  };
  const toggleBlockUser = async (userId) => {
    try {
      await axios.patch(
        `https://olx-clone-vgy9.onrender.com/api/admin/users/${userId}/block`,
        {},
        {
      headers: {
             Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <h1>Admin Users</h1>

      <div className="user-table">
        {users.map((user) => (
            <div
            className={`user-row ${user.isBlocked ? "blocked" : ""}`}
            key={user._id}
            >            
            <p>
              <b>Name:</b> {user.name}
            </p>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Role:</b> {user.role}
            </p>

            <p>
                <b>Status:</b>{" "}
                {user.isBlocked ? "Blocked" : "Active"}
                </p>

                {user.role !== "admin" && (
                <button onClick={() => toggleBlockUser(user._id)}>
                    {user.isBlocked ? "Unblock" : "Block"}
                </button>
                )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;