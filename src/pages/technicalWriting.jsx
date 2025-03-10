import { useState , useEffect } from "react";
import "/src/Css/general.css";
import axios from "axios";
import Layout from "../layout/layout";
import imageCompression from 'browser-image-compression';

function LeadersForm() {
  const [writerName, setwriterName] = useState("");
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState("");
  const [image, setImage] = useState(null);
  const [writerGithub, setwriterGithub] = useState("");
  const [writerLinkedin, setwriterLinkedin] = useState("");
  const [topicImage, setTopicImage] = useState("");
  const [Writings, setWritings] = useState([]);
  const [deleteOption , setdeleteOption ] = useState("none")
  const [showButton , setshowButton] = useState("Click to Delete a Writing");
    const serverIp = 'https://api.dita.co.ke'
    const [active , setActive] = useState(true)

    const handleSubmit = async (e) => {
      e.preventDefault();
      setActive(false);
    
      if (!image || !topicImage) {
        alert("Please select both images.");
        setActive(true);
        return;
      }
    
      try {
        // Image compression options (900KB max)
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
    
        // Compress both images
        const compressedWriterImage = await imageCompression(image, options);
        const compressedTopicImage = await imageCompression(topicImage, options);
    
        // Extract file extensions
        const writerFileType = image.type.split("/")[1];
        const topicFileType = topicImage.type.split("/")[1];
    
        // Convert compressed blobs to proper files
        const writerFile = new File([compressedWriterImage], `writer_image.${writerFileType}`, { type: image.type });
        const topicFile = new File([compressedTopicImage], `topic_image.${topicFileType}`, { type: topicImage.type });
    
        // Prepare FormData for both images
        const writerFormData = new FormData();
        const topicFormData = new FormData();
        writerFormData.append("image", writerFile);
        topicFormData.append("image", topicFile);
    
        // Upload writer image
        const writerResponse = await axios.post(`${serverIp}/upload-image/WriterImage`, writerFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
    
        let writerImageUrl = writerResponse.data.image;
        if (!writerImageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
          writerImageUrl += `.${writerFileType}`;
        }
    
        console.log("Received Writer Image URL:", writerImageUrl);
    
        // Upload topic image
        const topicResponse = await axios.post(`${serverIp}/upload-image/TopicImage`, topicFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
    
        let topicImageUrl = topicResponse.data.image;
        if (!topicImageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
          topicImageUrl += `.${topicFileType}`;
        }
    
        console.log("Received Topic Image URL:", topicImageUrl);
    
        // Send data with the uploaded image URLs
        const blogResponse = await fetch(`${serverIp}/technicalWritings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            writerName,
            topic,
            Blog: blog,
            writerImage: writerImageUrl,
            writerGithub,
            writerLinkedin,
            topicImage: topicImageUrl,
            blogTeaser: blog.slice(0, 300) + " ...",
          }),
        });
    
        if (!blogResponse.ok) {
          throw new Error("Failed to add blog.");
        }
    
        await blogResponse.json();
        alert("Blog Added");
        setActive(true);
        window.location.reload();
    
      } catch (error) {
        console.error("Error during image compression or upload:", error);
        setActive(true);
      }
    };
    
    
  

  function fetchJson() {
    fetch(`${serverIp}/technicalWritings`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //
        setWritings(data); // Set the state
      })
      .catch((error) => {
        console.log(error); // Handle any errors
      });
  }

  useEffect(() => {
    fetchJson();
  }, []);

  function deleteWritings(id) {
    fetch(`${serverIp}/technicalWritings/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Writing Deleted");
        window.location.reload();
        // console.log(data);
      }).catch((error) => {
        console.log(error); // Handle any errors
      });
  }
  return (
    <Layout>
          <div className="Form">
      <h1>Technical Form</h1>
      <form>
        <label>Writer Name:</label>
        <input type="text" onChange={(e) => setwriterName(e.target.value)} />

        <label>Topic:</label>
        <input type="text" onChange={(e) => setTopic(e.target.value)} />

        <label>Blog:</label>
        <textarea type="text" onChange={(e) => setBlog(e.target.value)} />

        <label>Writer Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <label>Topic Image:</label>
        <input type="file" onChange={(e) => setTopicImage(e.target.files[0])} />

        <label>Writer Github:</label>
        <input type="text" onChange={(e) => setwriterGithub(e.target.value)} />

        <label>Writer Linkedin:</label>
        <input
          type="text"
          onChange={(e) => setwriterLinkedin(e.target.value)}
        />

        <button type="submit" onClick={handleSubmit} disabled={active ? false : true}>
          Submit
        </button>
      </form>
    </div>

    <div style={{ display: "flex" , justifyContent: "center", marginTop: "20px"}}>
        <button onClick={() => {
          if(deleteOption === "flex")
            {
              setdeleteOption("none")
              setshowButton("Click to Delete a Writing")
            }
            else
            {
              setdeleteOption("flex")
              setshowButton("Hide")
            }
        }
          }>{showButton}</button>
      </div>

    <div style={{ display: deleteOption, flexDirection: "column" }} className="Delete">
          {Writings.map((writings, index) => (
            <div key={index} className="Delete_Div">
            <div className="Delete_Details" >
            <label>{writings.writerName}</label>
            <label>{writings.topic}</label>
            </div>
            <button onClick={() => deleteWritings(writings._id)}>Delete</button>
          </div>
          ))}
        </div>
    </Layout>
  );
}

export default LeadersForm;
