import React from "react";
import "../styles/searchbar.css";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="search-container">

      <span className="search-icon">🔍</span>

      <input
        type="text"
        className="search-input"
        placeholder="Search prediction markets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          className="clear-btn"
          onClick={() => setSearch("")}
        >
          ✖
        </button>
      )}

    </div>
  );
};

export default SearchBar;