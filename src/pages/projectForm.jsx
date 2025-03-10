import { useState, useEffect } from "react";
import "/src/Css/general.css";
import Layout from "../layout/layout";
import axios from "axios";
import imageCompression from 'browser-image-compression';

function MembersForm() {
  const [projectName, setprojectName] = useState("");
  const [projectSmallDescription, setprojectSmallDescription] = useState("");
  const [projectDetailedDescription, setprojectDetailedDescription] =
    useState("");
  const [image, setImage] = useState(null);
  const [projectLink, setprojectLink] = useState("");
  const [projectGithub, setprojectGithub] = useState("");
  const [Projects, setProjects] = useState([]);
  const [deleteOption, setdeleteOption] = useState("none")
  const [showButton, setshowButton] = useState("Click to Delete a Project")
    const serverIp = 'https://api.dita.co.ke'
    const [active , setActive] = useState(true)

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
        const file = new File([compressedImage], `project_image.${fileType}`, { type: image.type });
    
        // Prepare FormData
        const formData = new FormData();
        formData.append("image", file);
    
        // Upload compressed image
        const response = await axios.post(`${serverIp}/upload-image/Projects`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
    
        let imageUrl = response.data.image;
    
        // Ensure filename has an extension
        if (!imageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
          imageUrl += `.${fileType}`;
        }
    
        console.log("Received Image URL:", imageUrl);
    
        // Send project data with the correct image URL
        const projectResponse = await fetch(`${serverIp}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName,
            projectSmallDescription,
            projectDetailedDescription,
            projectImage: imageUrl,
            projectLink,
            projectGithubLink: projectGithub,
          }),
        });
    
        if (!projectResponse.ok) {
          throw new Error("Failed to add project.");
        }
    
        await projectResponse.json();
        alert("Project Added");
        setActive(true);
        // window.location.reload();  // Uncomment if a full page refresh is needed
    
      } catch (error) {
        console.error("Error during image compression or upload:", error);
        setActive(true);
      }
    };

  function fetchJson() {
    fetch(`${serverIp}/projects`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //
        setProjects(data); // Set the state
      })
      .catch((error) => {
        console.log(error); // Handle any errors
      });
  }

  useEffect(() => {
    fetchJson();
  }, []);

  function deleteProject(id) {
    fetch(`${serverIp}/projects/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Project Deleted");
        window.location.reload();
        // console.log(data);
      }).catch((error) => {
        console.log(error); // Handle any errors
      });
  }
  return (
    <Layout>
      <div className="Form">
        <h1>Project Form</h1>
        <form>
          <label>Project Name:</label>
          <input type="text" onChange={(e) => setprojectName(e.target.value)} />
          <label>Small Description:</label>
          <textarea
            type="text"
            onChange={(e) => setprojectSmallDescription(e.target.value)}
            maxLength={150}
          />
          <label>Detailed Description:</label>
          <textarea
            type="text"
            onChange={(e) => setprojectDetailedDescription(e.target.value)}
          />

          <label>Project Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <label>Project Link:</label>
          <input type="text" onChange={(e) => setprojectLink(e.target.value)} />

          <label>Project Github:</label>
          <input type="text" onChange={(e) => setprojectGithub(e.target.value)} />

          <button type="submit" onClick={handleSubmit} disabled={active ? false : true}>
            Submit
          </button>
        </form>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={() => {
          if (deleteOption === "flex") {
            setdeleteOption("none")
            setshowButton("Click to Delete a Project")
          }
          else {
            setdeleteOption("flex")
            setshowButton("Hide")
          }
        }
        }>{showButton}</button>
      </div>

      <div style={{ display: deleteOption, flexDirection: "column" }} className="Delete">
        {Projects.map((project, index) => (
          <div key={index} className="Delete_Div">
            <div className="Delete_Details" >
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

export default MembersForm;
