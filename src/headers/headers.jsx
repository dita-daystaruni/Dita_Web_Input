import { Link } from "react-router-dom"

function headers()
{
  return (
    <div className="headers">
        <Link to="/leaders">Leaders</Link>
        <Link to="/event">Event</Link>
        <Link to="/members">Members</Link>
        <Link to="/project">Project</Link>
        <Link to="/technicalWriting">Technical Writing</Link>
        <Link to="/award">Awards</Link>
        <Link to="/hackathon">Hackathon</Link>
    </div>
  )
}

export default headers