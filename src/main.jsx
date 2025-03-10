// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./pages/App.jsx";
import LeaderForm from "./pages/LeadersForm.jsx";
import EventForm from "./pages/eventForm.jsx";
import MembersForm from "./pages/membersForm.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectForm from "./pages/projectForm.jsx";
import TechnicalWriting from "./pages/technicalWriting.jsx";
import HackathonForm from "./pages/hackathon.jsx";
import AwardsForm from "./pages/awards.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/leaders",
    element: <LeaderForm />,
  },

  {
    path: "/event",
    element: <EventForm />,
  },

  {
    path: "/members",
    element: <MembersForm />,
  },

  {
    path: "/project",
    element: <ProjectForm />,
  },

  {
    path: "/technicalWriting",
    element: <TechnicalWriting />,
  },
  {
    path: "/hackathon",
    element: <HackathonForm />
  },
  {
    path: '/award',
    element: <AwardsForm />
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
