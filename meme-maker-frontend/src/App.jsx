import React, { useState, useEffect } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [memes, setMemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) return;
  
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
  
    try {
      const res = await fetch("http://localhost:5000/api/memes", {
        method: "POST",
        body: formData, // No Content-Type header! Browser will set it automatically
      });
  
      const data = await res.json();
      alert("🎉 Meme uploaded!");
      setCaption("");
      setImage(null);
      fetchMemes(); // Reload memes
    } catch (err) {
      alert("❌ Upload failed!");
      console.error(err);
    }
  };
  

  const fetchMemes = async (query = "") => {
    try {
      setIsLoading(true); // start spinner
      const res = await fetch(`http://localhost:5000/api/memes?search=${query}`);
      const data = await res.json();
      setMemes(data);
    } catch (err) {
      console.error("Failed to load memes", err);
    } finally {
      setIsLoading(false); // stop spinner
    }
  };
  

  useEffect(() => {
    fetchMemes();
  }, []);

  const deleteMeme = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meme?")) return;
  
    try {
      await fetch(`http://localhost:5000/api/memes/${id}`, {
        method: "DELETE",
      });
      alert("🗑️ Meme deleted!");
      fetchMemes(); // reload memes after deleting
    } catch (err) {
      alert("❌ Failed to delete meme!");
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        🤪 Meme Maker
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

      {isLoading && (
  <div className="text-center text-blue-500 font-bold text-xl mb-1">
    ⏳ Loading memes...
  </div>
)}

{/* meme list */}
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
    if (window.confirm("Are you sure you want to delete this meme? ")) {
      deleteMeme(meme._id);
    }
  }}
  className="absolute top-2 right-2 bg-blue-50 hover:bg-red-500 text-white p-2 rounded-full shadow-md text-sm"
>
🗑️ 
</button>



      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default App;
