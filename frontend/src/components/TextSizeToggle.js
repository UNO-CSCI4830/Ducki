const toggleFontSize = () => {
    setFontSize((prevSize) => (prevSize === 16 ? 20 : 16)); // Toggle between 16px and 20px
  };

export default toggleFontSize