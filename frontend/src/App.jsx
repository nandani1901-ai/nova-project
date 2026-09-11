import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const updateTaskStatus = async (id, status) => {
  try {
    const response = await fetch(`https://nova-project-t0gu.onrender.com/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update task");
      return;
    }

    alert("Task status updated successfully");

    fetchTasks();
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://nova-project-t0gu.onrender.com/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://nova-project-t0gu.onrender.com/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };
const fetchUsers = async () => {
  try {
    const response = await fetch("https://nova-project-t0gu.onrender.com/api/users");
    const data = await response.json();
    setUsers(data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
      fetchTasks();
      fetchUsers();
    }
  }, [isLoggedIn]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://nova-project-t0gu.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        setShowRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://nova-project-t0gu.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        alert("Login successful!");

        setIsLoggedIn(true);
        setEmail("");
        setPassword("");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectName) {
      alert("Project name is required");
      return;
    }

    try {
      const response = await fetch(
        "https://nova-project-t0gu.onrender.com/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: projectName,
            description: projectDescription,
          }),
        }
      );

      if (response.ok) {
        alert("Project created successfully!");
        setProjectName("");
        setProjectDescription("");
        fetchProjects();
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!taskTitle || !selectedProject) {
      alert("Task title and project are required");
      return;
    }

    try {
      const response = await fetch(
        "https://nova-project-t0gu.onrender.com/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            project: selectedProject,
          }),
        }
      );

      if (response.ok) {
        alert("Task created successfully!");
        setTaskTitle("");
        setTaskDescription("");
        setSelectedProject("");
        fetchTasks();
      } else {
        alert("Failed to create task");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  // LOGIN / REGISTER PAGE
  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>NOVA</h1>
          <p>Team Productivity Platform</p>

          {showRegister ? (
            <>
              <h2>Create Account</h2>

              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Register</button>
              </form>

              <p>
                Already have an account?{" "}
                <button
                  className="link-button"
                  onClick={() => setShowRegister(false)}
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Login</h2>

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Login</button>
              </form>

              <p>
                Don't have an account?{" "}
                <button
                  className="link-button"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>NOVA</h1>
          <p>Team Productivity Platform</p>
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="container">
        <section className="welcome">
          <h2>Project Dashboard</h2>
          <p>Create projects and manage your team's tasks.</p>
        </section>

        <div className="dashboard">
          <section className="card">
            <h2>Create Project</h2>

            <form onSubmit={createProject}>
              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <textarea
                placeholder="Project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
              />

              <button type="submit">Create Project</button>
            </form>
          </section>

          <section className="card">
            <h2>Create Task</h2>

            <form onSubmit={createTask}>
              <input
                type="text"
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <textarea
                placeholder="Task description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(e.target.value)
                }
              />

              <select
                value={selectedProject}
                onChange={(e) =>
                  setSelectedProject(e.target.value)
                }
              >
                <option value="">Select project</option>

                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <button type="submit">Create Task</button>
            </form>
          </section>
        </div>

        <section className="card">
          <h2>Projects</h2>

          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <div className="list">
              {projects.map((project) => (
                <div className="item" key={project._id}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Tasks</h2>

          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="list">
              {tasks.map((task) => (
                <div className="item" key={task._id}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>

                  <span className="status">
                    Status: {task.status || "Todo"}
                  </span>
                  <div className="task-actions">
  <button onClick={() => updateTaskStatus(task._id, "In Progress")}>
    In Progress
  </button>

  <button onClick={() => updateTaskStatus(task._id, "Completed")}>
    Done
  </button>

  <button onClick={() => deleteTask(task._id)}>
    Delete
  </button>
</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;