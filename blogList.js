let blogs = [];

const getBlogs = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/blog/posts", {
      method: "GET",
    });

    const result = await response.json();
    console.log("result ...nn", result);
    if (result.success) {
      blogs = result?.data;
      renderBlogList();
      document.getElementById("response").innerText =
        "✅ Blog fetched successfully!";
    } else {
      document.getElementById("response").innerText =
        "❌ Failed to fetch blogs: " + result.error;
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("response").innerText =
      "❌ An error occurred while fetching the blogs.";
  }
};

function renderBlogList() {
  const blogList = document.getElementById("blogList");
  blogList.innerHTML = "";
  blogs.forEach((blog) => {
    blogList.innerHTML += `
            <div class="blog-card">
                <img src="${blog.coverImage}" alt="Blog Cover" class="blog-image">
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p>${blog.shortDescription}...</p>
                    <p><strong>Tags:</strong> ${blog.tags}</p>
                    <button ><a href="index.html?id=${blog.id}">✏️ Edit</a></button>
                    <button onclick="deleteBlog(${blog.id})">🗑️ Delete</button>
                </div>
            </div>`;
  });
}


const deleteBlog = async (id) => {
  const response = await fetch(`http://localhost:3000/api/blog/post/${id}`, {
    method: "DELETE",
  });
  if (response.success) {
    document.getElementById("response").innerText =
      "✅ Blog deleted successfully!";
    getBlogs();
  } else {
    document.getElementById("response").innerText = "❌ Something went wrong";
  }
};

function clearFields() {
  document.getElementById("title").value = "";
  document.getElementById("quotation").value = "";
  document.getElementById("tags").value = "";
  document.getElementById("coverImage").value = "";
}

getBlogs();
