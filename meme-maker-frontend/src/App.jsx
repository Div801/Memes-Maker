import React, { useState, useEffect } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [memes, setMemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMemeId, setEditingMemeId] = useState(null);
  const [newCaption, setNewCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      const res = await fetch("http://localhost:5000/api/memes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert("🎉 Meme uploaded!");
      setCaption("");
      setImage(null);
      fetchMemes();
    } catch (err) {
      alert("❌ Upload failed!");
      console.error(err);
    }
  };

  const fetchMemes = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/memes?search=${query}`);
      const data = await res.json();
      setMemes(data);
    } catch (err) {
      console.error("Failed to load memes", err);
    }
    setIsLoading(false);
  };

  const deleteMeme = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/memes/${id}`, {
        method: "DELETE",
      });
      fetchMemes();
    } catch (err) {
      console.error("Failed to delete meme", err);
    }
  };

  const handleLike = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/memes/${id}/like`, {
        method: "PATCH",
      });
      fetchMemes();
    } catch (err) {
      console.error("Failed to like meme", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/memes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption: newCaption }),
      });
      setEditingMemeId(null);
      fetchMemes();
    } catch (err) {
      console.error("Failed to update meme", err);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Meme Maker🌈
      </h1>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchMemes(e.target.value);
          }}
          placeholder="🔍 Search your memes"
          className="w-full p-3 rounded-full border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        />
      </div>

      {/* Meme Upload Form */}
      <form
        className="max-w-md mx-auto bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-6 border border-white/50"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-blue-400">
          Make Your Meme Magic ✨
        </h2>

        {/* Image Upload */}
        <div
          className="border-2 border-dashed border-blue-400 p-4 rounded-lg text-center cursor-pointer bg-white hover:bg-blue-50 transition"
          onClick={() => document.getElementById("upload").click()}
        >
          {image ? (
            <p className="text-green-600 font-semibold">
              ✅ Image Selected: {image.name}
            </p>
          ) : (
            <p className="text-gray-600">📷 Click here or drag an image</p>
          )}
          <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Caption Input */}
        <div className="relative">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="peer w-full border-b-2 border-blue-400 bg-transparent py-2 px-1 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600"
            placeholder="Enter something funny"
          />
          <label
            htmlFor="caption"
            className="absolute left-1 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
          >
            ✍️ Caption
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-yellow-400 hover:to-blue-500 text-white font-bold py-2 rounded-full shadow-md transition"
        >
          Upload My Meme 🚀
        </button>
      </form>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="text-center text-blue-500 font-bold text-xl mb-1">
          ⏳ Loading memes...
        </div>
      )}

      {/* Meme List */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div
            key={meme._id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition relative"
          >
            <img
              src={meme.imageUrl}
              alt="meme"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-700">
                {meme.topText}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(meme.createdAt).toLocaleString()}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this meme?")) {
                    deleteMeme(meme._id);
                  }
                }}
                className="absolute top-2 right-2 bg-blue-50 hover:bg-gray-600 text-white p-2 rounded-full shadow-md text-sm"
              >
                🗑️
              </button>

              {/* Edit Button */}
              <button
                onClick={() => {
                  setEditingMemeId(meme._id);
                  setNewCaption(meme.topText);
                }}
                className="absolute top-2 left-2 bg-green-800 hover:bg-green-700 text-white text-xs px-2 py-1 rounded-full shadow-md transition"
              >
                ✏️ Edit
              </button>

              {/* Like Button */}
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleLike(meme._id)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white text-xs px-3 py-1 rounded-full transition"
                >
                  ❤️ Like
                </button>
                <span className="text-gray-600">{meme.likes || 0}</span>
              </div>

              {/* Edit Input Form */}
              {editingMemeId === meme._id && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded mb-2"
                    placeholder="Edit caption"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(meme._id)}
                      className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={() => setEditingMemeId(null)}
                      className="bg-gray-600 hover:bg-gray-400 text-white text-xs px-3 py-1 rounded-full transition"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
