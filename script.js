// // Define the custom toolbar options
const toolbarOptions = [
    [{ font: [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Header options
    ['bold', 'italic', 'underline', 'strike'], // Toggle buttons
    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // List types
    [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent
    [{ 'align': [] }], // Text alignment
    [{ 'color': [] }, { 'background': [] }], // Text and background colors
    ['link'], // Media options
    ['clean'] // Remove formatting
  ];


  // Extend Font Whitelist
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'pacifico'];
Quill.register(Font, true);

// Initialize Quill Editors
const quill1 = new Quill('#editor1', {
  theme: 'snow',
  modules:{
    toolbar: toolbarOptions
} ,
  placeholder: 'Write the first paragraph...'
});

const quill2 = new Quill('#editor2', {
  theme: 'snow',
  modules:{
    toolbar: toolbarOptions
} ,
  placeholder: 'Write the second paragraph...'
});

// Handle Quotation Toggle
const quotationCheckbox = document.getElementById('enableQuotation');
const quotationTextarea = document.getElementById('quotation');

quotationCheckbox.addEventListener('change', () => {
  quotationTextarea.style.display = quotationCheckbox.checked ? 'block' : 'none';
});

// Handle Form Submission
document.getElementById('publishBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const coverImage = document.getElementById('coverImage').files[0];
  const paragraph1 = quill1.root.innerHTML;
  const paragraph2 = quill2.root.innerHTML;
  const quotation = quotationCheckbox.checked ? quotationTextarea.value : null;
 
  if (!title || !paragraph1 || !paragraph2) {
    document.getElementById('response').innerText = '⚠️ Title and both paragraphs are required!';
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('paragraph1', paragraph1);
  formData.append('paragraph2', paragraph2);
  if (coverImage) formData.append('coverImage', coverImage);
  if (quotation) formData.append('quotation', quotation);

  try {
    const response = await fetch('http://localhost:3000/api/blog/post', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log("result ...nn", result)
    if (result.success) {
      document.getElementById('response').innerText = '✅ Blog posted successfully!';
      quill1.setContents([]);
      quill2.setContents([]);
      document.getElementById('title').value = '';
      document.getElementById('coverImage').value = '';
      quotationTextarea.value = '';
      quotationCheckbox.checked = false;
      quotationTextarea.style.display = 'none';
    } else {
      document.getElementById('response').innerText = '❌ Failed to post blog: ' + result.error;
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('response').innerText = '❌ An error occurred while posting the blog.';
  }
});


const  editBlog = async (id) => {
    const blog = await getBlogById(id);
    if (blog) {
      document.getElementById("title").value = blog.title;
      document.getElementById("quotation").value = blog.quotation;
    //   document.getElementById("tags").value = blog.tags;
    //   document.getElementById("coverImage").value = blog.cover_image;
      document.getElementById("enableQuotation").checked = blog.quotation !== "";
      quotationTextarea.style.display = blog.quotation !== "" ? 'block' : 'none';
      quill1.root.innerHTML = blog.paragraph1;
      quill2.root.innerHTML = blog.paragraph2;

    }
  }

  const getBlogById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/blog/post/${id}`, {
        method: "GET",
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error: ", error)
    }
  };


window.addEventListener('load', ()=>{

    if(params.id){
        editBlog(params.id)
    }
})




function getSearchParameters() {
    const prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    const params = {};
    const prmarr = prmstr.split("&");
    for (const element of prmarr) {
        const tmparr = element.split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

const params = getSearchParameters();