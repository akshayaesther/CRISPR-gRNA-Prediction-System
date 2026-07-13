import { useEffect, useState } from "react";
import "../styles/ManageAccount.css";
import Navbar from "../components/Navbar";


function ManageAccount(){

  const [user,setUser] = useState(null);
  const [editMode,setEditMode] = useState(false);

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  },[]);

  function handleChange(e){
    setUser({...user,[e.target.name]:e.target.value});
  }

  function updateProfile(){

    localStorage.setItem("user",JSON.stringify(user));

    alert("Profile Updated Successfully");

    setEditMode(false);
  }

  if(!user){
    return <h2>No User Data Found</h2>
  }

  return(
    <div>

      <Navbar />
    <div className="account-container fade-in">

      <div className="account-card">
  
        <h2>Manage Your Account</h2>

        {!editMode ? (

          <>
            <p>👤<strong>Name:</strong> {user.name}</p>
            <p>📧<strong>Email:</strong> {user.email}</p>
            <p>🧪<strong>Role:</strong> {user.role}</p>
            <p>🏢<strong>Organization:</strong> {user.organization}</p>
            <p>🌍<strong>Country:</strong> {user.country}</p>

            <button
              className="edit-btn"
              onClick={()=>setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
          
        ) : (

          <>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              className="account-input"
            />

            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              className="account-input"
            />

            <input
              name="role"
              value={user.role}
              onChange={handleChange}
              className="account-input"
            />

            <input
              name="organization"
              value={user.organization}
              onChange={handleChange}
              className="account-input"
            />

            <input
              name="country"
              value={user.country}
              onChange={handleChange}
              className="account-input"
            />

            <button
              className="save-btn"
              onClick={updateProfile}
            >
              Save Changes
            </button>

            <button
              className="cancel-btn"
              onClick={()=>setEditMode(false)}
            >
              Cancel
            </button>
          </>

        )}

      </div>

    </div>
    </div>
  );
}

export default ManageAccount;