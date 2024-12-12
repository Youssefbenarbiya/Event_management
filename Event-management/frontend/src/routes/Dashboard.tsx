import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import "./Dashboard.css";
import Header from "../Navbar";
import { createFileRoute } from "@tanstack/react-router";

// Route Definition
export const Route = createFileRoute("/Dashboard")({
  component: Dashboard,
});
interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  finishDate: string;
  venue: string;
  price: number;
  image: string;
}

interface Ticket {
  _id: string;
  event?: Event;
}

interface EditedFields {
  title?: string;
  description?: string;
  startDate?: string;
  finishDate?: string;
  venue?: string;
  price?: string;
}

function Dashboard() {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [scheduledEvents, setScheduledEvents] = useState<Ticket[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editedFields, setEditedFields] = useState<EditedFields>({});
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate({ to: "/LoginPage" });
      return;
    }
    fetchUserEvents(token);
    fetchScheduledEvents(token);
  }, [token, navigate]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchUserEvents = async (token: string) => {
    try {
      const response = await fetch("http://localhost:9090/event", {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserEvents(data.userEvents);
      } else {
        console.error("Failed to fetch user events.");
      }
    } catch (error) {
      console.error("Error during fetchUserEvents:", error);
    }
  };

  const fetchScheduledEvents = async (token: string) => {
    try {
      const response = await fetch("http://localhost:9090/ticket/user", {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setScheduledEvents(data.userTickets);
      } else {
        console.error("Error fetching scheduled events");
      }
    } catch (error) {
      console.error("Error fetching scheduled events:", error);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setEditedFields({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      finishDate: event.finishDate,
      venue: event.venue,
      price: event.price.toString(),
    });
  };

  const handleFieldChange = (field: keyof EditedFields, value: string) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImage(e.target.files[0]);
    }
  };

  const handleSaveClick = async () => {
    if (!editingEvent || !token) return;

    const formData = new FormData();
    Object.entries(editedFields).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        `http://localhost:9090/event/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setEditingEvent(null);
        setEditedFields({});
        setImage(null);
        fetchUserEvents(token);
      } else {
        console.error("Failed to update event.");
      }
    } catch (error) {
      console.error("Error during event update:", error);
    }
  };

  const handleDeleteClick = async (eventId: string) => {
    if (!token) return;

    try {
      const ticketResponse = await fetch(
        `http://localhost:9090/ticket/event/${eventId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (ticketResponse.ok) {
        const ticketData = await ticketResponse.json();
        if (ticketData.tickets.length > 0) {
          alert("Cannot delete event. It is booked by at least one person.");
          return;
        }
      }

      const response = await fetch(`http://localhost:9090/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        fetchUserEvents(token);
      } else {
        console.error("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error during event deletion:", error);
    }
  };

  const handleCancelEventClick = async (ticketId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:9090/ticket/${ticketId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        fetchScheduledEvents(token);
      } else {
        console.error("Failed to cancel event.");
      }
    } catch (error) {
      console.error("Error during event cancellation:", error);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <div className="left-div">
          <h1>My Events</h1>
          {userEvents.length === 0 ? (
            <p>No events available.</p>
          ) : (
            userEvents.map((event) => (
              <div key={event._id} className="event-item">
                {event === editingEvent ? (
                  <>
                    <input
                      type="text"
                      value={editedFields.title || ""}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                    <textarea
                      value={editedFields.description || ""}
                      onChange={(e) =>
                        handleFieldChange("description", e.target.value)
                      }
                    />
                    <input
                      type="date"
                      value={editedFields.startDate || ""}
                      onChange={(e) =>
                        handleFieldChange("startDate", e.target.value)
                      }
                    />
                    <input
                      type="date"
                      value={editedFields.finishDate || ""}
                      onChange={(e) =>
                        handleFieldChange("finishDate", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={editedFields.venue || ""}
                      onChange={(e) =>
                        handleFieldChange("venue", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      value={editedFields.price || ""}
                      onChange={(e) =>
                        handleFieldChange("price", e.target.value)
                      }
                    />
                    <input type="file" onChange={handleImageChange} />
                    <button onClick={handleSaveClick}>Save</button>
                  </>
                ) : (
                  <>
                    <h3>{event.title || "No Title"}</h3>
                    <p className="first-p">
                      {event.description || "No Description"}
                    </p>
                    <p className="second-p">
                      Start Date:{" "}
                      {event.startDate
                        ? formatDate(event.startDate)
                        : "No Date"}
                    </p>
                    <p className="second-p">
                      End Date:{" "}
                      {event.finishDate
                        ? formatDate(event.finishDate)
                        : "No Date"}
                    </p>
                    <p className="third-p">
                      Venue: {event.venue || "No Venue"}
                    </p>
                    <p className="third-p">
                      Price: ${event.price || "No Price"}
                    </p>
                    <img
                      src={`http://localhost:9090/uploads/${event.image}`}
                      alt={event.title}
                      className="event-image"
                    />
                    <div className="but-div">
                      <button
                        className="Edit"
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="Delete"
                        onClick={() => handleDeleteClick(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="right-div">
          <h1>My Scheduled Events</h1>
          {scheduledEvents.length === 0 ? (
            <p>No scheduled events available.</p>
          ) : (
            scheduledEvents.map((ticket) => (
              <div key={ticket.event?._id} className="event-item">
                <h3>{ticket.event?.title}</h3>
                <p className="first-p">{ticket.event?.description}</p>
                <p className="second-p">
                  Start Date:{" "}
                  {ticket.event?.startDate
                    ? formatDate(ticket.event.startDate)
                    : "No Date"}
                </p>
                <p className="second-p">
                  End Date:{" "}
                  {ticket.event?.finishDate
                    ? formatDate(ticket.event.finishDate)
                    : "No Date"}
                </p>
                <p className="third-p">
                  Venue: {ticket.event?.venue || "No Venue"}
                </p>
                <p className="third-p">
                  Price: ${ticket.event?.price || "No Price"}
                </p>
                <img
                  src={`http://localhost:9090/uploads/${ticket.event?.image}`}
                  alt={ticket.event?.title}
                  className="event-image"
                />
                <button
                  className="Cancel"
                  onClick={() => handleCancelEventClick(ticket._id)}
                >
                  Cancel Event
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
