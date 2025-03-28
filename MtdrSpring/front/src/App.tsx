import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import "./App.css";
import { API_LIST, deleteItem, getItems, modifyItem } from "./api/todo";
import { ToDoElement } from "./models/ToDoElement";
import ErrorMessage from "./components/Error/Error";
import TaskTable from "./components/TaskTable";
import MainTitle from "./components/MainTitle";
import AddModal from "./components/AddModal/AddModal";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ToDoElement[]>([]);
  const [error, setError] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    getItems()
      .then((data) => {
        setItems(data);
        console.log(`Items: ${JSON.stringify(data)}`);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const reloadAllItems = () => {
    if (!loading) {
      setLoading(true);
    }
    getItems()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // TODO: Refactor into `api/todo` file.
  const reloadItems = (id: number) => {
    if (!loading) {
      setLoading(true);
    }
    fetch(API_LIST + "/" + id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error reloading item with id " + id);
        }
      })
      .then((data) => {
        const newItems = items.map((item) =>
          item.id === id
            ? {
                ...item,
                description: data.description,
                delivery_ts: data.delivery_ts,
                creation_ts: data.creation_ts,
                done: data.done,
              }
            : item
        );

        setItems(newItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const toggleDone = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
    description: string,
    done: boolean
  ) => {
    event.preventDefault();
    if (!loading) {
      setLoading(true);
    }
    modifyItem(id, description, done)
      .then(() => {
        reloadItems(id);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Error while updating item");
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    if (!loading) {
      setLoading(true);
    }
    deleteItem(id).then(() => {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      setLoading(false);
    });
  };

  const handleOpen = () => {
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col">
      <div>
        <MainTitle title="Oracle Task Management System" />
        {error && <ErrorMessage error={error} />}

        {loading && <CircularProgress />}

        {!loading && (
          <div>
            <div>
              <AddModal
                open={showAddModal}
                onClose={handleClose}
                reloadTable={reloadAllItems}
                setLoading={setLoading}
              />
              <Button onClick={handleOpen}>Add Element</Button>

              <h3>Pending Items</h3>
              <TaskTable
                tasks={items}
                done={false}
                toggleDone={toggleDone}
                handleDelete={handleDelete}
              />
            </div>
            <div>
              <h3>Done Items</h3>
              <TaskTable
                tasks={items}
                done={true}
                toggleDone={toggleDone}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
