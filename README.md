# Task Manager Backend

A simple backend API for managing tasks and user profiles using Node.js, Express, and Supabase.

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Task-Manager-Web-App/task-manager-backend.git
cd task-manager-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add:
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
```

Get your credentials from your Supabase project settings.

### 4. Start the Server
```bash
npm run dev
```

The server will run on `http://localhost:5000` (or your specified PORT).

## API Endpoints

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Profile
- `GET /profile/:userId` - Get user profile and role
- `PUT /profile/:userId` - Update user profile and role

## Notes
- The backend uses Supabase SERVICE_ROLE_KEY to bypass Row Level Security (RLS)
- Make sure your `.env` file is in the `.gitignore` to keep credentials safe
