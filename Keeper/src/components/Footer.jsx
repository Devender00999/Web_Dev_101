import React from "react";

const currentYear = new Date().getFullYear();
export default function Footer() {
  return (
    <footer>
      <p>Copyright &copy; {currentYear}</p>
    </footer>
  );
}
