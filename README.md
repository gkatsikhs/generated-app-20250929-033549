# Eventide

Eventide is a sophisticated, minimalist web application designed for exclusive groups to seamlessly organize private parties and manage attendance. The platform provides a stunningly visual and intuitive interface for creating events, inviting guests, and tracking RSVPs. The core experience revolves around a central dashboard displaying upcoming and past events, a detailed view for each event with guest lists and discussions, and a simple, elegant form for event creation. The design prioritizes clarity, generous white space, and delightful micro-interactions to create a premium user experience. Authentication is handled through a clean, secure login system, ensuring privacy for the group's activities.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gkatsikhs/generated-app-20250928-192410)

## ✨ Key Features

-   **Elegant Event Dashboard:** View upcoming and past events in a beautiful, responsive grid.
-   **Detailed Event View:** Access comprehensive event details, including description, location, guest list, and RSVP functionality.
-   **Seamless Event Creation:** An intuitive form for organizers to create new events with ease.
-   **Mock Authentication Flow:** A complete, simulated user login/logout journey for a full-featured demo.
-   **Responsive & Minimalist Design:** A premium user experience crafted with Tailwind CSS and shadcn/ui, flawless on any device.
-   **State Management:** Centralized state management using Zustand for a predictable and maintainable application.

## 🚀 Technology Stack

-   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Backend:** [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
-   **Storage:** [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:
-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd eventide-party-planner
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

## 🛠️ Development

To start the development server, which runs both the Vite frontend and the Cloudflare Worker backend concurrently, run:

```bash
bun run dev
```

This will start the application on `http://localhost:3000` (or the next available port). The Vite server will handle hot module replacement for the frontend, and changes to the worker code will also be reloaded automatically.

## 🚀 Deployment

This application is designed to be deployed to the Cloudflare network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script to build the application and deploy it to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Wrangler will handle the process of building the frontend assets, bundling the worker, and deploying everything. You will be provided with a URL for your deployed application.

Alternatively, you can deploy directly from your GitHub repository.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gkatsikhs/generated-app-20250928-192410)

## 📂 Project Structure

The project is organized into three main directories:

-   `src/`: Contains all the frontend React application code, including pages, components, stores (Zustand), and utility functions.
-   `worker/`: Contains the backend Hono application code that runs on Cloudflare Workers, including API routes and entity logic for Durable Objects.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and backend to ensure type safety across the stack.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.