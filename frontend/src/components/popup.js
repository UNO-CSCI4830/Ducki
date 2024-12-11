const Popup = ({ message, onClose }) => {
    return (
      <div className="popup">
        <div className="popup-content">
          <p>{message}</p>
          <button onClick={onClose}>Dismiss</button>
        </div>
      </div>
    );
  };

export default Popup;