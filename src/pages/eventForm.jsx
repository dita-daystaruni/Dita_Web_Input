import { useState, useEffect } from "react";
import "/src/Css/general.css";
import axios from "axios";
import Layout from "../layout/layout";
import imageCompression from 'browser-image-compression';

function EventForm() {
  const [eventName, seteventName] = useState("");
  const [eventDate, seteventDate] = useState("");
  const [eventTime, seteventTime] = useState("");
  const [eventVenue, seteventVenue] = useState("");
  const [eventSmallDescription, seteventSmallDescription] = useState("");
  const [eventDetailedDescription, seteventDetailedDescription] = useState("");
  const [registrationDetails, setregistrationDetails] = useState("");
  const [eventLink, seteventLink] = useState("");
  const [image, setImage] = useState(null);
  const [deleteOption , setdeleteOption ] = useState("none")
  const [showButton , setshowButton] = useState("Click to Delete an Event")
  const [active , setActive] = useState(true)
  const [Events, setEvents] = useState([]);
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

        maxSizeMB: 0.9,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
  
      // Compress the image

      const compressedImage = await imageCompression(image, options);
  
      // Extract file extension (e.g., "png", "jpg")
      const fileType = image.type.split("/")[1];
  
      // Convert to a properly named file
      const file = new File([compressedImage], `event_image.${fileType}`, { type: image.type });
  

      // Prepare FormData
      const formData = new FormData();
      formData.append("image", file);

  
      // Upload compressed image
      const response = await axios.post(`${serverIp}/upload-image/Events`, formData, {

        headers: { 'Content-Type': 'multipart/form-data' },
      });
  

      let imageUrl = response.data.image;
  
      // Ensure filename has an extension
      if (!imageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {

        imageUrl += `.${fileType}`;
      }
  
      console.log("Received Image URL:", imageUrl);
  

      // Send event data with the correct image URL
      fetch(`${serverIp}/events`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventDate,

          eventTime,
          eventVenue,

          eventSmallDescription,
          eventDetailedDescription,
          eventImage: imageUrl,
          registrationDetail: registrationDetails,
          eventLink,
        }),
      })
        .then(response => response.json())
        .then(() => {
          alert("Event Added");
          setActive(true);
          window.location.reload();
        })
        .catch(error => {
          console.error("Error adding event:", error);
          setActive(true);
        });
  
    } catch (error) {
      console.error("Error during image compression or upload:", error);
      setActive(true);
    }
  };

  function fetchJson() {
    fetch(`${serverIp}/events`)
      .then((response) => response.json())

      .then((data) => {
        console.log(data); //
        setEvents(data); // Set the state
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
    fetch(`${serverIp}/events/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Event Deleted");
        window.location.reload();
        // console.log(data);
      });
  }

  return (
    <Layout>
      <div className="Form">
        <h1>Event Form</h1>
        <form>
          <label>Event Name:</label>
          <input type="text" onChange={(e) => seteventName(e.target.value)} />
          <label>Event Date:</label>
          <input type="date" onChange={(e) => seteventDate(e.target.value)} />
          <label>Event Time:</label>
          <input type="time" onChange={(e) => seteventTime(e.target.value)} />
          <label>Event Venue:</label>
          <input type="text" onChange={(e) => seteventVenue(e.target.value)} />
          <label>Event Small Description:</label>
          <textarea
            type="text"
            maxLength={150}
            onChange={(e) => seteventSmallDescription(e.target.value)}
          />
          <label>Event Detailed Description:</label>
          <textarea
            type="text"
            onChange={(e) => seteventDetailedDescription(e.target.value)}
          />
          <label>Registration Details:</label>
          <textarea
            type="text"
            onChange={(e) => setregistrationDetails(e.target.value)}
            
          />
          <label>Event Link:</label>
          <input type="text" onChange={(e) => seteventLink(e.target.value)} />
          <label>Event Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
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
              setshowButton("Click to Delete an Event")
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
          {Events.map((event, index) => (
            <div key={index} className="Delete_Div">
              <div className="Delete_Details" >
              <label>{event.eventName}</label>
              <label>{event.eventDate}</label>
              <label>{event.eventTime}</label>
              <label>{event.eventVenue}</label>
              </div>
              <button onClick={() => deleteEvent(event._id)}>Delete</button>
            </div>
          ))}
        </div>
    </Layout>
  );
}

export default EventForm;
