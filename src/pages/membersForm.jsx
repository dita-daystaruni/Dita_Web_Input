import { useState, useEffect } from "react";
import "/src/Css/general.css";
import axios from "axios";
import Layout from "../layout/layout";
import imageCompression from 'browser-image-compression';

function MembersForm() {
  const [membersName, setmemberName] = useState("");
  const [memberRole, setmemberRole] = useState("");
  const [memberDescription, setmemberDescription] = useState("");
  const [memberGithub, setmemberGithub] = useState("");
  const [memberLinkedin, setmemberLinkedin] = useState("");
  const [image, setImage] = useState(null);
  const [Members, setMembers] = useState([]);
  const [deleteOption, setdeleteOption] = useState("none")
  const [showButton, setshowButton] = useState("Click to Delete a Member")
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
      // Compression options
      const options = {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1024, // Max width/height in pixels
        useWebWorker: true,
      };
  
      // Compress the image
      const compressedImage = await imageCompression(image, options);
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("image", compressedImage);
  
      // Upload the compressed image
      const response = await axios.post(`${serverIp}/upload-image/Members`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const imageUrl = response.data.image; // Ensure this is correct
      console.log("Received Image URL:", imageUrl);
  
      // Send the member data with the image URL
      fetch(`${serverIp}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberName: membersName,
          memberRole: memberRole,
          memberDescription: memberDescription,
          memberImage: imageUrl,
          githubLink: memberGithub,
          linkedinLink: memberLinkedin,
        }),
      })
        .then(response => response.json())
        .then(() => {
          alert("Added");
          setActive(true);
          window.location.reload();
        })
        .catch(error => {
          console.error('Error adding member:', error);
          setActive(true);
        });
  
    } catch (error) {
      console.error("Error during image compression or upload:", error);
      setActive(true);
    }
  };


  function fetchJson() {
    fetch(`${serverIp}/members`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //
        setMembers(data); // Set the state
      })
      .catch((error) => {
        console.log(error); // Handle any errors
      });
  }

  useEffect(() => {
    fetchJson();
  }, []);

  function deleteMember(id) {
    fetch(`${serverIp}/members/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Member Deleted");
        window.location.reload();
        // console.log(data);
      }).catch((error) => {
        console.log(error); // Handle any errors
      });
  }
  return (
    <Layout>
      <div className="Form">
        <h1>Members Form</h1>
        <form>
          <label>Name:</label>
          <input type="text" onChange={(e) => setmemberName(e.target.value)} />
          <label>Role:</label>
          <input type="text" onChange={(e) => setmemberRole(e.target.value)} />
          <label>Description:</label>
          <textarea
            type="text"
            onChange={(e) => setmemberDescription(e.target.value)}
            maxLength={150}
          />

          <label>Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <label>Github:</label>
          <input type="text" onChange={(e) => setmemberGithub(e.target.value)} />
          <label>Linkedin:</label>
          <input
            type="text"
            onChange={(e) => setmemberLinkedin(e.target.value)}
          />

          <button type="submit" onClick={handleSubmit} disabled={active ? false : true}>
            Submit
          </button>
        </form>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={() => {
          if (deleteOption === "flex") {
            setdeleteOption("none")
            setshowButton("Click to Delete a Member")
          }
          else {
            setdeleteOption("flex")
            setshowButton("Hide")
          }
        }
        }>{showButton}</button>
      </div>

      <div style={{ display: deleteOption, flexDirection: "column" }} className="Delete">
        {Members.map((members, index) => (
          <div key={index} className="Delete_Div">
            <div className="Delete_Details" >
              <label>{members.memberName}</label>
              <label>{members.memberRole}</label>
            </div>
            <button onClick={() => deleteMember(members._id)}>Delete</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default MembersForm;
