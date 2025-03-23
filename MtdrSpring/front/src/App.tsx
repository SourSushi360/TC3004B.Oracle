import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import "./App.css";
import { API_LIST, getItems, modifyItem } from "./api/todo";
import { ToDoElement } from "./models/ToDoElement";
import ErrorMessage from "./components/Error/Error";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ToDoElement[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getItems()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []); // Change it everytime [items] change it.

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
      })
      .catch((error) => {
        console.error(error);
        setError("Error while updating item");
      });
  };

  return (
    <div className="flex flex-col">
      <div>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "left",
            margin: "20px",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Oracle Redesign
        </Typography>
        {error && <ErrorMessage error={error} />}

        {loading && <CircularProgress />}
        {!loading && (
          <div>
            <div>
              <table>
                <TableBody>
                  <TableHead>
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2">Creation Date</th>
                      <th className="p-2">Delivery Date</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </TableHead>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={3}>No items</td>
                    </tr>
                  )}
                  {items.map(
                    (item, index) =>
                      !item.done && (
                        <tr
                          key={item.id}
                          className={`text-black ${
                            index % 2 == 0 ? "bg-gray-300" : "bg-white"
                          }`}
                        >
                          <td className="p-2 ">{item.description}</td>
                          <td className="p-2">
                            {item.creation_ts && item.creation_ts.toString()}
                          </td>

                          {item.delivery_ts ? (
                            <td className="p-2 text-green-500">
                              {item.delivery_ts.toString()}
                            </td>
                          ) : (
                            <td className="p-2 text-red-500">
                              No Delivery Date
                            </td>
                          )}
                          <td className="p-2">
                            <Button
                              variant="contained"
                              className="bg-blue-500 text-white"
                              onClick={(event) =>
                                toggleDone(
                                  event,
                                  item.id,
                                  item.description,
                                  !item.done
                                )
                              }
                            >
                              Done
                            </Button>
                          </td>
                        </tr>
                      )
                  )}
                </TableBody>
              </table>
            </div>
            <div>
              <h3>Done items</h3>
              <table>
                <TableBody>
                  <TableHead>
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2">Creation Date</th>
                      <th className="p-2">Delivery Date</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </TableHead>
                  {/** If no done item.  */}
                  {items.filter((item) => item.done).length === 0 && (
                    <tr>
                      <td colSpan={4}>No items</td>
                    </tr>
                  )}
                  {items.map(
                    (item) =>
                      item.done && (
                        <tr key={item.id} className="flex items-center">
                          <td className="flex-1 p-2">{item.description}</td>
                          <td className="p-2">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={(event) => {
                                toggleDone(
                                  event,
                                  item.id,
                                  item.description,
                                  !item.done
                                );
                              }}
                              size="small"
                            >
                              Undo
                            </Button>
                          </td>
                        </tr>
                      )
                  )}
                </TableBody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
