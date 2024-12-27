let blogs = [];

const getBlogs = async () => {
  try {
    const response = await fetchWithAuth("https://blogbee.vercel.app/api/blog/posts", {
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

    const maxLength = 50;
    let  description = '';
    if (blog.paragraph1.length > maxLength) {
        description = blog.paragraph1.slice(0, maxLength) + "...";
    }
    else description = blog.paragraph1;

    blogList.innerHTML += `
            <div class="blog-card">
                <img src="${blog.coverImage || "./assets/img/elementor-placeholder-image.webp"}" alt="Blog Cover" class="blog-image">
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p>${description}...</p>
                    <p><strong>Tags:</strong> ${blog.tags}</p>
                    <button ><a href="index.html?id=${blog.id}">✏️ Edit</a></button>
                    <button onclick="deleteBlog(${blog.id})">🗑️ Delete</button>
                </div>
            </div>`;
  });
}


const deleteBlog = async (id) => {
  const response = await fetchWithAuth(`https://blogbee.vercel.app/api/blog/post/${id}`, {
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


function fetchWithAuth(input, options = {}) {
    // Get the token from localStorage
    const token = localStorage.getItem('jwt');
  
    // Clone the headers if they exist or create a new headers object
    const headers = new Headers(options.headers || {});
  
    // If the token exists, add the Authorization header
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  
    // Include headers in the fetch options
    const fetchOptions = {
      ...options,
      headers,
    };
  
    // Call the native fetch with the updated options
    return fetch(input, fetchOptions);
  }