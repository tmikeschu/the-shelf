import React, { useState } from "react";
import "./App.css";

/*
 * TODO:
 * Add pagination
 */

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

const updateElement = xs => index => fn => [
  ...xs.slice(0, index),
  fn(xs[index]),
  ...xs.slice(index + 1)
];

const App = () => {
  // UI state
  const [items, setItems] = useState([...Array(25)]);
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

  const addItem = e => {
    e.preventDefault();
    const item = {
      brand,
      style,
      size,
      upcId
    };
    const newItems = updateElement(items)(selectedIndex)(() => item);
    setItems(newItems);
    [setBrand, setStyle, setSize, setUpcId].map(f => f(""));
    setShowAddItem(false);
    setShowEditOptions(false);
  };

  const targVal = cb => ({ target: { value } }) => cb(value);

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
    Object.entries(itemProps).forEach(([prop, { setter }]) => {
      setter(items[i][prop]);
    });
    setShowAddItem(!showAddItem);
  };

  const handleDelete = i => e => {
    e.stopPropagation();
    setSelectedIndex(i);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    setItems(updateElement(items)(selectedIndex)(() => undefined));
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

  return (
    <div className="App">
      <h1>The Shelf</h1>
      <div className="App__Shelf">
        {items.map((item, i) =>
          Boolean(item) ? (
            <ul
              className={`App__Item ${
                showEditOptions && selectedIndex === i ? "--editOptions" : ""
              }`}
              key={item.upcId}
              onClick={handleEditClick(i)}
              role="button"
            >
              {showEditOptions && selectedIndex === i ? (
                <>
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
                </>
              ) : (
                Object.entries(itemProps).map(([prop, { label }]) => (
                  <li className={`--${prop}`} key={prop}>
                    <p>
                      {label || capitalize(prop)}: {item[prop]}
                    </p>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <ul
              key={i}
              className="App__Item --empty"
              role="button"
              onClick={handleAddClick(i)}
            >
              <i className="material-icons">add</i>
            </ul>
          )
        )}
      </div>

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
