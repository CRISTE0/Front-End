import React from "react";
import "../../assets/css/style.css"; // Ajusta la ruta si es necesario

const SearchBar = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
