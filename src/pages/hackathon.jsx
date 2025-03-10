import { useEffect } from "react";
import "/src/Css/general.css";
import axios from "axios";
import Layout from "../layout/layout";
import { useState } from "react";
import imageCompression from 'browser-image-compression';


function HackathonForm() {
  const [Name, setName] = useState("");
  const [image, setImage] = useState("");
  const [smallDescription, setSmallDescription] = useState("");
  const [date , setDate] = useState("")
  const [hackathons , sethackathons] = useState([])
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
      const file = new File([compressedImage], `hackathon_image.${fileType}`, { type: image.type });
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("image", file);
  
      // Upload compressed image
      const response = await axios.post(`${serverIp}/upload-image/Hackathon`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      let imageUrl = response.data.image;
  
      // Ensure filename has an extension
      if (!imageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
        imageUrl += `.${fileType}`;
      }
  
      console.log("Received Image URL:", imageUrl);
  
      // Send hackathon data with the correct image URL
      fetch(`${serverIp}/hackathons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathonName: Name,
          hackathonDate: date,
          hackathonDescription: smallDescription,
          hackathonImage: imageUrl,
        }),
      })
        .then(response => response.json())
        .then(() => {
          alert("Hackathon Added");
          setActive(true);
          window.location.reload();
        })
        .catch(error => {
          console.error("Error adding hackathon:", error);
          setActive(true);
        });
  
    } catch (error) {
      console.error("Error during image compression or upload:", error);
      setActive(true);
    }
  };
  
  

  function fetchJson() {
    fetch(`${serverIp}/hackathons`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //
        sethackathons(data); // Set the state
        console.log(data)
      })
      .catch((error) => {
        console.log(error); // Handle any errors
      });
  }

  useEffect(() => {
    fetchJson();
  }, []);

  function deleteProject(id) {
    fetch(`${serverIp}/hackathons/${id}`, {
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
      <h1>Hackathons Form</h1>
      <form>
        <label>Name:</label>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <label>Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label>Date:</label>
        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <label>Small Description:</label>
        <textarea
          type="text" 
          onChange={(e) => setSmallDescription(e.target.value)}  />
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

      <div style={{ display: deleteOption ? "block" : "none", flexDirection: "column" }} className="Delete">
  {hackathons?.map((project, index) => (
    <div key={index} className="Delete_Div">
      <div className="Delete_Details">
        <label>{project.projectName}</label>
        <p>{project.projectSmallDescription}</p>
      </div>
      <button onClick={() => deleteProject(project._id)}>Delete</button>
    </div>
  ))}
</div>

    </Layout>
  );
}

export default HackathonForm;
