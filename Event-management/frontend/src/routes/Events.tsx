import React, { useState, useEffect } from "react";
import "./Events.css";
import Header from "../Navbar";
import { createFileRoute } from "@tanstack/react-router";
import "./SignupPage.css";

// Route Definition
export const Route = createFileRoute("/Events")({
  component: Events,
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
  event: Event;
}

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [showAlreadyBookedPopup, setShowAlreadyBookedPopup] =
    useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // Redirect to login or handle unauthorized access
      window.location.href = "/login";
      return;
    }
    fetchEvents();
  }, [token]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:9090/event/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Event[] = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error during fetchEvents:", error);
    }
  };

  // Function to handle booking an event
  const handleBookEvent = async (eventId: string) => {
    try {
      // Fetch the user's booked tickets
      const response = await fetch(`http://localhost:9090/ticket/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch user tickets.");
        return;
      }

      const data = await response.json();
      const userTickets: Ticket[] = data.userTickets;

      const isAlreadyBooked = userTickets.some(
        (ticket) => ticket.event._id === eventId
      );

      if (isAlreadyBooked) {
        setShowAlreadyBookedPopup(true);
      } else {
        const bookResponse = await fetch(`http://localhost:9090/ticket`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }),
        });

        if (bookResponse.ok) {
          setShowSuccessPopup(true);
        } else {
          const errorData = await bookResponse.json();
          console.error("Failed to book event:", errorData);
          alert(`Failed to book event: ${errorData.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error during event booking:", error);
    }
  };

  return (
    <div className="events">
      <Header />

      {/* Event cards */}
      <div className="event-cards">
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h2>{event.title}</h2>
              <img
                src={`http://localhost:9090/uploads/${event.image}`}
                alt={event.title}
                className="event-image"
              />
              <p>{event.description}</p>
              <p>Start Date: {formatDate(event.startDate)}</p>
              <p>End Date: {formatDate(event.finishDate)}</p>
              <p>Venue: {event.venue}</p>
              <p>Price: ${event.price}</p>
              <button
                className="book-button"
                onClick={() => handleBookEvent(event._id)}
              >
                Book
              </button>
            </div>
          ))
        )}
      </div>

      {/* Success Pop-up */}
      {showSuccessPopup && (
        <div className="popup success-popup">
          <p>Event booked successfully!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}

      {/* Already Booked Pop-up */}
      {showAlreadyBookedPopup && (
        <div className="popup error-popup">
          <p>Event is already booked!</p>
          <button onClick={() => setShowAlreadyBookedPopup(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
