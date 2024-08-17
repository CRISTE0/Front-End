import React from "react";
import "../../assets/css/style.css"; // Ajusta la ruta si es necesario

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 3; // Número máximo de páginas visibles
    let pages = [];

    if (totalPages <= maxVisiblePages) {
      // Si hay 3 o menos páginas, muestra todas
      pages = [...Array(totalPages).keys()].map((i) => i + 1);
    } else {
      if (currentPage === 1) {
        // Si estamos en la primera página, muestra las primeras 3
        pages = [1, 2, 3];
      } else if (currentPage === totalPages) {
        // Si estamos en la última página, muestra las últimas 3
        pages = [totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Si estamos en cualquier otra página, muestra una ventana de 3 páginas
        pages = [currentPage - 1, currentPage, currentPage + 1];
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav>
      <ul className="pagination">
        {/* Botón para ir a la página anterior */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
        </li>
        {visiblePages.map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        {/* Botón para ir a la página siguiente */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
