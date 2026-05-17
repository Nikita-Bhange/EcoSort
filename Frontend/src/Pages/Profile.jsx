import React, { useState, useContext } from "react";
import UserInfo from "../Components/UserInfo.jsx";
import Posts from "../Components/Posts.jsx";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/User";

function Profile() {
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { user, logout, uploadProfilePhoto } = useContext(UserContext);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const fileInputRef = React.useRef(null);

  const handleClick = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setErr(err?.message || "An error occurred");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      handleUploadPhoto(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUploadPhoto = async (selectedFile) => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const res = await uploadProfilePhoto(selectedFile);
    if (!res?.success) alert("Failed to upload profile photo");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-40" />
          
          <div className="px-6 pb-6">
            <div className="relative -mt-16 flex flex-col items-center">
              <img 
                src={previewUrl || user?.profile_photo || "/default-avatar.png"}
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
              <button 
                onClick={triggerFileInput} 
                className="mt-2 bg-white text-cyan-600 border border-cyan-500 px-4 py-1 rounded-full text-sm font-semibold hover:bg-cyan-50 transition"
              >
                {user?.profile_photo ? "Edit Photo" : "Upload Photo"}
              </button>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>

            <div className="text-center mt-4">
              <h1 className="text-2xl font-bold text-gray-800">{user?.username || "User Name"}</h1>
              <p className="text-gray-600">{user?.email || "user@example.com"}</p>
            </div>

            <div className="mt-6 border-t pt-6">
                <UserInfo />
                <Posts />
            </div>

            <div className="text-center mt-8 space-x-4">
              <NavLink to="/history">
                <button className="text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2 transition">
                  View History
                </button>
              </NavLink>
              <button className="text-white font-bold bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2 transition" onClick={handleClick}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
