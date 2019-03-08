import React, { useState } from "react";
import "./App.css";
import { setFormData, targVal, updateElement, capitalize } from "./utils";

const PER_PAGE = 25;
const EMPTY_PAGE = [...Array(PER_PAGE)];

const App = () => {
  // model state
  const [totalItems, setItems] = useState(EMPTY_PAGE);
  const updateItem = updateElement(totalItems);

  // ui state
  const [page, setPage] = useState(0);
  const pageOffset = PER_PAGE * page;
  const items = totalItems.slice(pageOffset, pageOffset + PER_PAGE);
  const pages = totalItems.length / PER_PAGE;
  const [showAddItem, setShowAddItem] = useState(false);
  const [baseIndex, setSelectedIndex] = useState(-1);
  const selectedIndex = baseIndex + pageOffset;
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const itemIsSelected = Boolean(totalItems[selectedIndex]);
  const [error, setError] = useState("");

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

  const flashError = err => {
    setError(err);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  // event handlers

  const addItem = e => {
    e.preventDefault();
    if (!totalItems.find(({ upcId: existing } = {}) => existing === upcId)) {
      setItems(updateItem(selectedIndex, { brand, style, size, upcId }));
      setSelectedIndex(-1);
      resetForm();
      setShowAddItem(false);
      setShowEditOptions(false);
    } else {
      flashError("UPC ID already taken");
    }
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
    setSelectedIndex(-1);
  };

  const handleCancelDelete = () => {
    setSelectedIndex(-1);
    setShowDeleteWarning(false);
    setSelectedIndex(-1);
  };

  const cancelEdit = e => {
    e.stopPropagation();
    setShowEditOptions(false);
    resetForm();
    setSelectedIndex(-1);
  };

  const handlePrevPageClick = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPageClick = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const addPage = () => {
    setItems(totalItems.concat(EMPTY_PAGE));
    setPage(page + 1);
  };

  const handleBackdropClick = ({ target, currentTarget: listener }) => {
    if (listener === target) {
      closeForm();
    }
  };

  const closeForm = () => {
    if (itemIsSelected) {
      setSelectedIndex(-1);
      resetForm();
    }
    setShowAddItem(false);
  };

  // render helpers

  const renderItem = (item, i) => {
    if (Boolean(item) && showEditOptions && selectedIndex === i + pageOffset) {
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
      {Boolean(error) && (
        <div className="Error">
          <span>{error}</span>
        </div>
      )}
      <div className="App__left">
        <h1>The Shelf</h1>
        <div className="App__Pagination">
          <button
            className="App__Pagination__Left"
            disabled={page < 1}
            onClick={handlePrevPageClick}
          >
            <i className="material-icons">skip_previous</i>
          </button>
          <button className="App__Pagination__Add" onClick={addPage}>
            <i className="material-icons">add</i>
          </button>
          <button
            className="App__Pagination__Right"
            disabled={page + 1 === pages}
            onClick={handleNextPageClick}
          >
            <i className="material-icons">skip_next</i>
          </button>
          <span>
            Page {page + 1} of {pages}
          </span>
        </div>
      </div>
      <div className="App__Shelf">{items.map(renderItem)}</div>

      {showAddItem && (
        <div className="Modal" onClick={handleBackdropClick}>
          <div className="Modal__inner">
            <div className="Modal__Header">
              <h2>Shoe Information</h2>
              <i className="material-icons Modal__Close" onClick={closeForm}>
                close
              </i>
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
