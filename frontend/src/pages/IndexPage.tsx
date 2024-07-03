import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IndexPage.css"; // Ensure this import points to your CSS file
import width_194 from "../pages/Chat/width_194.png";
function Index() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/chat");
    }, 500); // Match this duration to the CSS transition duration
  };

  return (
    <div className={`container ${fadeOut ? "fade-out" : ""}`}>
      <img src={width_194} alt="" />
      <h1>Talk with "MEE"</h1>
      <h3>ver : 0.1</h3>
      <button onClick={handleNavigate}>Let's talk</button>
      <div className="bottom">
        <h5>LineID : @pypuni</h5>
        <h5>Facebook : กิตติพัทธ์ ทิว</h5>
      </div>
    </div>
  );
}

export default Index;
