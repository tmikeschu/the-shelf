import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const addItem = () => {
    setItems(items.concat({}));
  };

  return (
    <div className="App">
      <h1>The Shelf</h1>
      <div className="App__Shelf">
        {items.map(item => (
          <div className="App__Item" key={item.upcId}>
            {item.name}
          </div>
        ))}
        {[...Array(25 - items.length)].map((_, i) => (
          <div
            key={i}
            className="App__Item --empty"
            role="button"
            onClick={() => setShowAddItem(!showAddItem)}
          />
        ))}
      </div>

      {showAddItem && (
        <form className="App__AddItem" onSubmit={addItem}>
          <input type="text" value="" />
        </form>
      )}
    </div>
  );
};

export default App;
