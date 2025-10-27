import React, { useState, useEffect, useCallback } from "react";
import TaskItem from "../components/TaskItem";
import API from "../api/axios";
import "./Tasks.css";

function Tasks() {
  const [page, setPage] = useState(1);
  const limit = 5; // tasks per page

  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0); // ✅ declare totalTasks
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("");
  

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal"); // ✅ new field
  
  const fetchTasks = useCallback(async () => {
  try {
    let query = [];
    if (filter === "completed") query.push("completed=true");
    if (filter === "pending") query.push("completed=false");
    if (priorityFilter) query.push(`priority=${priorityFilter}`);
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    const queryString = query.length > 0 ? "?" + query.join("&") : "";

    const res = await API.get(`/tasks${queryString}`);
    setTasks(res.data.tasks); // tasks array
    setTotalTasks(res.data.total); // total count
    console.log("Fetched tasks:", res.data.tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}, [filter, priorityFilter,page,limit]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);



  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority: priority, // ✅ include priority
      completed: false,
     
    };


  try {
    const response = await API.post("/tasks", newTask); // send empty object
    setTasks((prev) => [...prev, response.data]);
    setTitle("");
    setDescription("");
    setPriority("normal"); // reset
  } catch (error) {
    console.error("Error adding task:", error);
    alert(error.response?.data?.message || "Failed to add task");
  }

  };

   const handleToggleComplete = async (id, completed) => {
    try {
      await API.put(`/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  const handleChangePriority = async (taskId, newPriority) => {
    try {
      await API.put(`/tasks/${taskId}`, { priority: newPriority }); // API instance already has baseURL
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
      );
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };
 

  return (
    <div className="tasks-container">
      <h2>🗂️ Your Tasks</h2>

      {/* Add New Task */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Add new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        
        {/* ✅ Priority selection */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="Task Priority"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button type="submit">➕ Add</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>
    

      {/* Task List */}
      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
              
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onChangePriority={handleChangePriority}
            />
          ))
        )}
      </ul>

      {/* Pagination */}
      
      {tasks.length > 0 && (
        <div className="pagination right">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span style={{ padding: "10px 10px" }}>Page {page}</span>
          <button
            disabled={page * limit >= totalTasks}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Tasks;
