import React from "react";
import '../../assets/css/AdminFooter.css'; // Asegúrate de tener este archivo CSS en la misma carpeta

export const AdminFooter = () => {
  return (
    <>
      {/* <!-- Footer --> */}
      <footer className="admin-footer">
        <div className="footer-content">
          <div className="copyright">
            <span>Copyright &copy; Soft-Shirt 2024 || <a id="descargarApp" href="https://expo.dev/artifacts/eas/4NE4kZtXTUUFoE6YvpseE7.apk">Descarga la APP aquí</a></span>
          </div>
        </div>
      </footer>
      {/* <!-- End of Footer --> */}
    </>
  );
};
