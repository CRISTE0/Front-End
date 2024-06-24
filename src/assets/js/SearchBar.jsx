import React from "react";
import "../../assets/css/style.css"; // Ajusta la ruta si es necesario

const SearchBar = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="input-group mb-1">
      <input
        type="text"
        className="Buscador"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
