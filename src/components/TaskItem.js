import React from "react";
import "./TaskItem.css";

function TaskItem({ task, onToggleComplete, onDelete, onChangePriority }) {
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <div
        className="task-info"
        onClick={() => onToggleComplete(task.id, task.completed)}
      >
        <span className="task-checkbox">{task.completed ? "✅" : "⬜"}</span>
        <div className="task-details">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p
              className="task-desc"
              style={{
                color: task.completed ? "green" : "red",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="task-actions">
         {/* Priority dropdown */}
        <select
          value={task.priority}
          onChange={(e) => onChangePriority(task.id, e.target.value)}
          disabled={task.completed} // optional: disable if task is completed
          className={`priority ${task.priority.toLowerCase()}`}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        {/* Only show delete button if task is NOT completed */}
        {!task.completed && (
          <button className="delete-btn" onClick={() => onDelete(task.id)}>
            🗑️
          </button>
        )}
      </div>
    </li>
  );
}

export default TaskItem;