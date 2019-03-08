import React, { useState } from "react";
import "./App.css";

/*
 * TODO:
 * Refactor repetitive array update code
 * Add pagination
 * Clean up styling
 * Use custom delete confirmation
 */

const App = () => {
  const [items, setItems] = useState([...Array(25)]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const itemIsSelected = Boolean(items[selectedIndex]);

  // form data
  const [brand, setBrand] = useState("");
  const [style, setStyle] = useState("");
  const [size, setSize] = useState("");
  const [upcId, setUpcId] = useState("");

  const shoeProps = {
    brand: { val: brand, setter: setBrand },
    style: { val: style, setter: setStyle },
    size: { val: size, setter: setSize },
    upcId: { val: upcId, setter: setUpcId }
  };

  const addItem = e => {
    e.preventDefault();
    const item = {
      brand,
      style,
      size,
      upcId
    };
    const newItems = [
      ...items.slice(0, selectedIndex),
      item,
      ...items.slice(selectedIndex + 1)
    ];
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

  const handleEdit = i => () => {
    setSelectedIndex(i);
    Object.entries(shoeProps).forEach(([prop, { setter }]) => {
      setter(items[i][prop]);
    });
    setShowAddItem(!showAddItem);
  };

  const handleDelete = i => () => {
    setSelectedIndex(i);
    setShowDeleteWarning(true);
    const it = window.confirm("Are you sure?");
    if (it) {
      setItems([...items.slice(0, i), undefined, ...items.slice(i + 1)]);
    }
    setShowDeleteWarning(false);
  };

  return (
    <div className="App">
      <h1>The Shelf</h1>
      <div className="App__Shelf">
        {items.map((item, i) =>
          Boolean(item) ? (
            <ul
              className="App__Item"
              key={item.upcId}
              onClick={handleEditClick(i)}
              role="button"
            >
              {showEditOptions && selectedIndex === i ? (
                <>
                  <li onClick={handleEdit(i)}>edit</li>
                  <li onClick={handleDelete(i)}>delete</li>
                </>
              ) : (
                Object.keys(shoeProps).map(prop => (
                  <li className={`--${prop}`} key={prop}>
                    {item[prop]}
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
            />
          )
        )}
      </div>

      {showAddItem && (
        <div className="Modal" onClick={() => setShowAddItem(false)}>
          <div className="Modal__close" onClick={() => setShowAddItem(false)}>
            X
          </div>
          <form
            className="App__AddItem"
            onSubmit={addItem}
            onClick={e => e.stopPropagation()}
          >
            {Object.entries(shoeProps).map(([prop, { val, setter }]) => {
              return (
                <input
                  key={prop}
                  type="text"
                  placeholder={prop}
                  value={val}
                  onChange={targVal(setter)}
                />
              );
            })}

            <button type="submit">
              {itemIsSelected ? "Update" : "Add"} Shoe
            </button>
          </form>
        </div>
      )}
      {showDeleteWarning && (
        <div className="Modal" onClick={() => setShowDeleteWarning(false)}>
          Are you sure?
        </div>
      )}
    </div>
  );
};

export default App;
