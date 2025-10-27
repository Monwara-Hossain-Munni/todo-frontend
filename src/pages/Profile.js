import { useState, useEffect } from "react";
import API from "../api/axios";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/users/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile.");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await API.put("/users/profile", {
        name: user.name,
        email: user.email,
      });
      setUser(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-container">
        <div className="profile-card">
          <div className="avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=4e73df&color=fff`}
              alt="avatar"
            />
          </div>
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p>
            <strong>Email:</strong> {user.email}
          </p>
          </div>
          
        </div>
      </div>
      <form onSubmit={updateProfile}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            placeholder="Enter your email"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
