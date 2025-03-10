import { useEffect } from "react";
import "/src/Css/general.css";
import axios from "axios";
import Layout from "../layout/layout";
import { useState } from "react";
import imageCompression from 'browser-image-compression';


function AwardsForm() {
  const [Name, setName] = useState("");
  const [image, setImage] = useState("");
  const [smallDescription, setSmallDescription] = useState("");
  const [date , setDate] = useState("")
  const [Awards , setawards] = useState([])
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
  
      // Compress image
      const compressedImage = await imageCompression(image, options);
  
      // Extract file extension
      const fileType = image.type.split("/")[1];
  
      // Convert compressed blob to proper file
      const finalImageFile = new File([compressedImage], `award_image.${fileType}`, { type: image.type });
  
      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("image", finalImageFile);
  
      // Upload award image
      const imageResponse = await axios.post(`${serverIp}/upload-image/Awards`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      let imageUrl = imageResponse.data.image;
      if (!imageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
        imageUrl += `.${fileType}`;
      }
  
      console.log("Received Image URL:", imageUrl);
  
      // Send data with the uploaded image URL
      const awardResponse = await fetch(`${serverIp}/awards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          awardsName: Name,
          awardsDate: date,
          awardsDescription: smallDescription,
          awardsImage: imageUrl,
        }),
      });
  
      if (!awardResponse.ok) {
        throw new Error("Failed to add award.");
      }
  
      await awardResponse.json();
      alert("Award Added");
      setActive(true);
      window.location.reload();
  
    } catch (error) {
      console.error("Error during image compression or upload:", error);
      setActive(true);
    }
  };
  
  

  function fetchJson() {
    fetch(`${serverIp}/awards`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //
        setawards(data); // Set the state
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
    fetch(`${serverIp}/awards/${id}`, {
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
      <h1>Awards Form</h1>
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

    <div style={{ display: deleteOption, flexDirection: "column" }} className="Delete">
          {Awards.map((leaders, index) => (
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

export default AwardsForm;
