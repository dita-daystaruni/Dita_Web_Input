import { useState , useEffect } from "react";
import "/src/Css/general.css";
import axios from "axios";
import Layout from "../layout/layout";
import imageCompression from 'browser-image-compression';

function LeadersForm() {
  const [Name, setName] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [smallDescription, setSmallDescription] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [Leaders, setLeaders] = useState([]);
  const [deleteOption , setdeleteOption ] = useState("none")
  const [showButton , setshowButton] = useState("Click to Delete a Leader")
  const [active , setActive] = useState(true)
  const serverIp = 'https://api.dita.co.ke'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActive(false);
  
    if (!image) {
      alert("Please select an image.");
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
  
      // Compress the image
      const compressedImage = await imageCompression(image, options);
  
      // Extract file extension (e.g., "png", "jpg")
      const fileType = image.type.split("/")[1];
  
      // Convert to a properly named file
      const file = new File([compressedImage], `leader_image.${fileType}`, { type: image.type });
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("image", file);
  
      // Upload compressed image
      const response = await axios.post(`${serverIp}/upload-image/Ditaleaders`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      let imageUrl = response.data.image;
  
      // Ensure filename has an extension
      if (!imageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
        imageUrl += `.${fileType}`;
      }
  
      console.log("Received Image URL:", imageUrl);
  
      // Send leader data with the correct image URL
      fetch(`${serverIp}/ditaleaders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaderName: Name,
          leaderRole: role,
          leaderImage: imageUrl,
          leaderDescription: smallDescription,
          githubLink: github,
          linkedinLink: linkedin,
        }),
      })
        .then(response => response.json())
        .then(() => {
          alert("Leader Added");
          setActive(true);
          window.location.reload();
        })
        .catch(error => {
          console.error("Error adding leader:", error);
          setActive(true);
        });
  
    } catch (error) {
      console.error("Error during image compression or upload:", error);
      setActive(true);
    }
  };
  
  

  function fetchJson() {
    fetch(`${serverIp}/ditaleaders`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //
        setLeaders(data); // Set the state
        console.log(data)
      })
      .catch((error) => {
        console.log(error); // Handle any errors
      });
  }

  useEffect(() => {
    fetchJson();
  }, []);

  function deleteEvent(id) {
    fetch(`${serverIp}/ditaleaders/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Leader Deleted");
        window.location.reload();
        // console.log(data);
      });
  }

  return (
    <Layout>
          <div className="Form">
      <h1>Leaders Form</h1>
      <form>
        <label>Name:</label>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <label>Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label>Role:</label>
        <input type="text" onChange={(e) => setRole(e.target.value)} />
        <label>Small Description:</label>
        <textarea
          type="text" 
          onChange={(e) => setSmallDescription(e.target.value)}
        maxLength={150}  />
        <label>Github:</label>
        <input type="text" onChange={(e) => setGithub(e.target.value)} />
        <label>LinkedIn:</label>
        <input type="text" onChange={(e) => setLinkedin(e.target.value)} />
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
              setshowButton("Click to Delete a Leader")
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
          {Leaders.map((leaders, index) => (
           <div key={index} className="Delete_Div">
           <div className="Delete_Details" >
           <label>{leaders.leaderName}</label>
           <label>{leaders.leaderRole}</label>
           </div>
           <button onClick={() => deleteEvent(leaders._id)}>Delete</button>
         </div>
          ))}
        </div>
    </Layout>
  );
}

export default LeadersForm;
