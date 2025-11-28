// section 6 state and interactivity {topic: travel project}

import React, { useState, useEffect } from "react";

// const initialItems = [
//   { id: 1, description: "toothbrush", packed: false, quantity: 1 },
//   { id: 2, description: "clothes", packed: true, quantity: 3 },
//   { id: 3, description: "snacks", packed: false, quantity: 5 },
//   { id: 4, description: "water bottle", packed: false, quantity: 2 },
//   { id: 5, description: "first aid kit", packed: true, quantity: 1 },
// ];

export default function App() {
  // لو حابب تبدأ فاضي خليه []، لو عايز داتا تجريبية خليه initialItems
  const [items, setItems] = useState(()=>{
   const saved = localStorage.getItem('item')
   return saved ? JSON.parse(saved) : []
});

  useEffect(() => {
    localStorage.setItem('item', JSON.stringify(items))
  }, [items])

  function handleAddItems(item) {
    setItems((items) => [...items, item])
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id))
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item,
      )
    )
  }

  function handleClearsItems() {
    const confirmed = window.confirm(
      "Are you sure you want delete all items?",
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearItems={handleClearsItems}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>Far Aways</h1>;
}

function Form({ onAddItem }) {
  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc) return;

    const newItemOfApp = {
      id: Date.now(),
      description: desc,
      quantity,
      packed: false,
    };

    onAddItem(newItemOfApp);
    setDesc("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>

      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Item..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItem, onToggleItem, onClearItems }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sorted by input order</option>
          <option value="description">Sorted by description</option>
          <option value="packed">Sorted by packed</option>
        </select>

        <button type="button" onClick={onClearItems}>
          Clear
        </button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
     <div className="dev">
       <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />

      <span className={item.packed ? "item-packed" : ""}>
        {item.quantity} {item.description}
      </span>
     </div>

      <button type="button" onClick={() => onDeleteItem(item.id)}>
        ❌
      </button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );

  const numItems = items.length;
  const itemsPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((itemsPacked / numItems) * 100) || 0;

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything! Ready to go ✈"
          : `You have ${numItems} items in your packing list, and you already packed ${itemsPacked} (${percentage}%)`}
      </em>
    </footer>
  );
}
