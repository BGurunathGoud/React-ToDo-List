import React, { useEffect, useState } from "react";
import styles from "../styles/home.module.css";
import { addTodoTask, getTodoItems, deleteTodoTask, saveTodoTask } from "../api";
import { useToasts } from "react-toast-notifications";

//Home fun() 
export function Home() {
  const [item, setItem] = useState([]);
  const [id, setId] = useState(201);
  const [task, setTask] = useState("");
  const [updateId, setUpdateId] = useState();
  const [editTask, setEditTask] = useState(false);
  const { addToast } = useToasts();

  //Here the data is fetched from API and added the data is displayed
  useEffect(() => {
    async function fetchItems() {
      const response = await getTodoItems();
      if (response.success) {
        setItem(response.data);
      }
    }
    fetchItems();
  }, []);

  
  // Here the data/task is added ito todolist and displayed in 1st position 
  const handleAddButton = async () => {
    const userId = 1;
    if (task !== "") {
      const response = await addTodoTask(task, userId);
      const data = response.data;
      if (response.success) {
        response.data.id = id;
        item.unshift(data);
        setId(id + 1);
        setTask("");
        return addToast(response.message, {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        return addToast(response.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

 //  Here the fun() is executed whenever we click on update button in task's displayed in list container
  const handleUpdate = async (ind) => {
    setEditTask(true);
    setUpdateId(ind);
    setTask(item[ind].title);
    console.log(task);
  };

  // Below Fun() is executed whenever we click on Save button after the details/data is updated in inputbar and added to existing task list.
  const handleSavingTask = async () => {
    const response = await saveTodoTask(item[updateId]);
    if (response.success) {
      item[updateId].title = task;
      setEditTask(false);
      setTask("");
      return addToast(response.message, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      return addToast(response.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // Below fun() is genereted whenever the task is completed
  const handleToggleTask = (ind) => {
    const flag = item[ind].completed;
    item[ind].completed = !flag;
    console.log(item[ind].completed, "0000000");
    return addToast("Completed! Task Successfully", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  // Task is deleted whenever we click on delete button icon from todolist
  const handleDelete = async (ind) => {
    if (task !== null) {
      setTask("");
    }
    const response = await deleteTodoTask(item[ind]);
    if (response.success) {
      const currentTaskID = item[ind].id;
      console.log(response);
      const newList = item.filter((element) => element.id !== currentTaskID);
      setItem(newList);
      return addToast(response.message, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      return addToast(response.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div className={styles.todoMainContainer}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={task}
          placeholder="Enter Task details here..."
          onChange={(e) => setTask(e.target.value)}
          required
        />
        {editTask ? (
          <>
             {/* Here the button update the task details... */}
            <button className={styles.buttons} onClick={handleSavingTask}>
              Save
            </button>
          </>
        ) : (
          <>
            {/* Task is added to todo list by clicking on Add data button */}
            <button className={styles.buttons} onClick={handleAddButton}>
              Add data 
            </button>
          </>
        )}
      </div>
      <div className={styles.todoTaskContainer}>
        {item.map((task, index) => (
          <div className={styles.taskContainer} key={`${task.id}`}>
            <div className={styles.leftDiv}>
              {task.completed ? (
                <>
                 
                  <input
                    type="checkbox"
                    checked
                    onClick={() => {
                      handleToggleTask(index);
                    }}
                  />
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    onClick={() => {
                      handleToggleTask(index);
                    }}
                  />
                </>
              )}
              <span>{task.title}</span>
            </div>
            <div className={styles.rightDiv}>
              {/* Here data is passed into handlebutton fun() after clicking on delete button */}
              <img
                src="https://cdn-icons-png.flaticon.com/128/9790/9790368.png"
                alt="D"
                onClick={() => {
                  handleDelete(index);
                }}
              />
              {/* Here data is passed into handleUpdate fun() after clicking on edit button  */}
              <img
                src="https://cdn-icons-png.flaticon.com/128/6051/6051993.png"
                alt="U"
                onClick={() => {
                  handleUpdate(index);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


