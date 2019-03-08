import React, { useState } from "react";
import "./App.css";
import { setFormData, targVal, updateElement, capitalize } from "./utils";

/*
 * TODO:
 * Add pagination
 */

const App = () => {
  // model state
  const [items, setItems] = useState([...Array(25)]);
  const updateItem = updateElement(items);

  // ui state
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const itemIsSelected = Boolean(items[selectedIndex]);

  // form state
  const [brand, setBrand] = useState("");
  const [style, setStyle] = useState("");
  const [size, setSize] = useState("");
  const [upcId, setUpcId] = useState("");

  const itemProps = {
    brand: { val: brand, setter: setBrand },
    style: { val: style, setter: setStyle },
    size: { val: size, setter: setSize },
    upcId: { val: upcId, setter: setUpcId, label: "UPC ID" }
  };

  const resetForm = () => {
    [setBrand, setStyle, setSize, setUpcId].map(f => f(""));
  };

  const addItem = e => {
    e.preventDefault();
    setItems(updateItem(selectedIndex, { brand, style, size, upcId }));
    resetForm();
    setShowAddItem(false);
    setShowEditOptions(false);
  };

  const handleAddClick = slotIndex => () => {
    setSelectedIndex(slotIndex);
    setShowAddItem(!showAddItem);
  };

  const handleEditClick = slotIndex => () => {
    setShowEditOptions(true);
    setSelectedIndex(slotIndex);
  };

  const handleEdit = i => e => {
    e.stopPropagation();
    setSelectedIndex(i);
    setFormData(itemProps, items[i]);
    setShowAddItem(!showAddItem);
  };

  const handleDelete = i => e => {
    e.stopPropagation();
    setSelectedIndex(i);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    setItems(updateItem(selectedIndex, undefined));
    setShowDeleteWarning(false);
  };

  const handleCancelDelete = () => {
    setSelectedIndex(-1);
    setShowDeleteWarning(false);
  };

  const cancelEdit = e => {
    e.stopPropagation();
    setShowEditOptions(false);
  };

  const renderItem = (item, i) => {
    if (Boolean(item) && showEditOptions && selectedIndex === i) {
      return (
        <ul
          className="App__Item --editOptions"
          key={item.upcId}
          onClick={handleEditClick(i)}
          role="button"
        >
          <li onClick={handleEdit(i)}>
            <i className="material-icons">edit</i>
          </li>
          <li onClick={handleDelete(i)}>
            <i className="material-icons" style={{ color: "red" }}>
              delete
            </i>
          </li>
          <li onClick={cancelEdit}>
            <i className="material-icons">close</i>
          </li>
        </ul>
      );
    }
    if (Boolean(item)) {
      return (
        <ul
          className="App__Item"
          key={item.upcId}
          onClick={handleEditClick(i)}
          role="button"
        >
          {Object.entries(itemProps).map(([prop, { label }]) => (
            <li className={`--${prop}`} key={prop}>
              <p>
                {label || capitalize(prop)}: {item[prop]}
              </p>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul
        key={i}
        className="App__Item --empty"
        role="button"
        onClick={handleAddClick(i)}
      >
        <li>
          <i className="material-icons">add</i>
        </li>
      </ul>
    );
  };

  return (
    <div className="App">
      <h1>The Shelf</h1>
      <div className="App__Shelf">{items.map(renderItem)}</div>

      {showAddItem && (
        <div className="Modal" onClick={() => setShowAddItem(false)}>
          <div className="Modal__inner">
            <div
              className="Modal__Header"
              onClick={() => setShowAddItem(false)}
            >
              <h2>Shoe Information</h2>
              <i className="material-icons Modal__Close">close</i>
            </div>
            <form
              className="App__AddItem"
              onSubmit={addItem}
              onClick={e => e.stopPropagation()}
            >
              {Object.entries(itemProps).map(
                ([prop, { val, setter, label }]) => {
                  return (
                    <input
                      required
                      key={prop}
                      type="text"
                      placeholder={label || capitalize(prop)}
                      value={val}
                      onChange={targVal(setter)}
                    />
                  );
                }
              )}

              <button
                type="submit"
                disabled={![brand, style, size, upcId].every(Boolean)}
              >
                {itemIsSelected ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
      {showDeleteWarning && (
        <div className="Modal" onClick={() => setShowDeleteWarning(false)}>
          <div className="Modal__inner">
            <div className="App__ConfirmDelete">
              <p>Are you sure?</p>
              <button
                className="App__ConfirmDelete__Cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="App__ConfirmDelete__Confirm"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
