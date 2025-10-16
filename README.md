# AI Post Offer Generator

This is a React-based web application that uses the Gemini API to generate promotional post offers for businesses, complete with custom text and unique AI-generated images.

## Features

-   **Dynamic Text Generation**: Creates catchy titles and post bodies based on user input.
-   **AI Image Generation**: Generates a unique, high-quality image for each offer.
-   **Customization**: Allows users to specify business details, occasion, keywords, post length, and keyword richness.
-   **Wishlist**: Users can save their favorite offers.
-   **Responsive Design**: A clean, modern, and responsive UI built with Tailwind CSS.

## Running the Project Locally

To run this project on your local machine, follow these steps:

### 1. Prerequisites

-   Node.js (v18 or later recommended)
-   npm, pnpm, or yarn

### 2. Installation

1.  **Clone the repository (or unzip this source code):**
    ```bash
    # If you have git
    git clone <repository_url>
    cd ai-post-offer-generator

    # If you downloaded the zip
    unzip ai-post-offer-generator.zip
    cd ai-post-offer-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 3. Environment Variables

You need a Gemini API key to run this application.

1.  Create a file named `.env` in the root of your project directory.
2.  Add your API key to this file:
    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key. Vite will automatically load this variable.

### 4. Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or another port if 5173 is in use).

## Deploying to Vercel

1.  **Push your project to a Git repository** (e.g., GitHub, GitLab).

2.  **Import the project into Vercel.**

3.  **Configure Environment Variables:**
    In your Vercel project settings, go to "Environment Variables" and add your Gemini API key:
    -   **Name**: `API_KEY`
    -   **Value**: `YOUR_GEMINI_API_KEY_HERE`

4.  **Deploy!**
    Vercel should automatically detect that it's a Vite project and use the correct build settings. Click "Deploy".
