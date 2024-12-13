import React, { useState } from "react";
import ImageComponent from "./ImageComponent";
import Ducki from "../assets/ducki.ico"; 

const DuckiImageToggle = () => {
  const [showDuckiImage, setShowDuckiImage] = useState(true);

  return (
    <div>
      {/* Button to toggle the visibility of Ducki image */}
      <button className="HideDucki" onClick={() => setShowDuckiImage((prev) => !prev)}>
        {showDuckiImage ? "Hide Ducki Image" : "Show Ducki Image"}
      </button>

      {/* Conditionally render the DuckiImage */}
      {showDuckiImage && (
        <div className="DuckiImage">
          <ImageComponent src={Ducki} alt="Ducki" />
        </div>
      )}
    </div>
  );
};

export default DuckiImageToggle;
