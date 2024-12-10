import React from "react";

const LinkModal = ({ links = [], onClose }) => {
  return (
    <div className="link-modal">
      <div className="link-modal-content">
        <h2 style={{ color: "#ffc438" }}>External Links</h2>
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => window.open(link.url, "_blank")}
            className="link-button"
          >
            {link.name}
          </button>
        ))}
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default LinkModal;
