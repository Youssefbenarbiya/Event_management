import React, { useState, useEffect } from "react";
import "./UserProfileModel.css";

interface UserProfileModelProps {
  onClose: () => void;
  onEdit: () => void;
}

interface User {
  email: string;
  name: string;
}

interface UserProfileModelProps {
  user: User | null;

  onClose: () => void;
}
const UserProfileModel: React.FC<UserProfileModelProps> = ({ onClose }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("username");

    if (storedEmail && storedName) {
      setUser({ email: storedEmail, name: storedName });
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="user-profile-modal">
        <h2>User Profile</h2>
        {user ? (
          <>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </>
        ) : (
          <p>Loading user profile...</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UserProfileModel;