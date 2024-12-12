import React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

// Define and export the root route
export const Route = createRootRoute({
  component: RootComponent,
});

// Root component with navigation
function RootComponent() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              activeProps={{ style: { fontWeight: "bold" } }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/Dashboard"
              activeProps={{ style: { fontWeight: "bold" } }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/Events"
              activeProps={{ style: { fontWeight: "bold" } }}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/CreateEvent"
              activeProps={{ style: { fontWeight: "bold" } }}
            >
              Create Event
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet /> {/* Renders child routes */}
    </div>
  );
}

export default RootComponent;