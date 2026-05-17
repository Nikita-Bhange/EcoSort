import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import moment from "moment";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
       try {
      //   const response = await axios.get("http://localhost:3300/api/post/");
      //   setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      // await axios.delete(`http://localhost:3300/api/post/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="m-5 mt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Items Posted</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => {
            let parsedImage;
            try {
              parsedImage = typeof post.image === "string" ? JSON.parse(post.image) : post.image;
            } catch (error) {
              console.error("Error parsing image JSON:", error);
              parsedImage = [];
            }
            return (
              <div
                key={post.id}
                className="bg-gray-100 p-4 rounded shadow flex items-center space-x-4 transition hover:scale-105 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-400"
              >
                {/* <img
                  src={
                    parsedImage && parsedImage.length > 0
                      ? `http://localhost:3300/uploads/${parsedImage[0]}`
                      : "https://placehold.co/400"
                  }
                  alt="Post"
                  className="w-16 h-16 rounded cursor-pointer"
                  onClick={() => navigate(`/product/${post.id}`)}
                /> */}
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/product/${post.id}`)}>
                  <h2 className="text-lg font-bold text-gray-800">{post.p_name}</h2>
                 
                  <p className="text-sm text-gray-600">{moment(post.posting_date).fromNow()}</p>
                </div>
                <div className="flex space-x-2">
                  <EditIcon
                    className="cursor-pointer text-yellow-500"
                    aria-label="Edit"
                    onClick={() => navigate("/sell", { state: { PostId: post.id } })}
                  />
                  <DeleteIcon
                    className="cursor-pointer text-red-500"
                    aria-label="Delete"
                    onClick={() => handleDelete(post.id)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
