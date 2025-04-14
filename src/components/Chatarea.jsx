import React, { useState } from "react";
import { FaArrowAltCircleUp, FaCheck } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner'
import logo from "../assets/logo.png";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";

const API_KEY = import.meta.env.VITE_APP_OPENROUTER_KEY;

export default function Chatarea() {
 const [loading, setLoading] = useState(false);
 const [url,setUrl] = useState('');
 const [boolUrl, setBoolUrl] = useState(false);
 const [message,setMessage] = useState([]);
  const [formData, setformData] = useState({
    query: "",
  });
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const chatUrl = localStorage.getItem('api')+'/chat';
  console.log(chatUrl);
  const handleSave = () => {
    localStorage.setItem('api',url);
    setBoolUrl(true);
    console.log(localStorage)

  }
  
 const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.query.trim() === "") return;

    setLoading(true);
    setMessage((prev) => [...prev, { text: formData.query, sender: "user" }]);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`, // Store key in .env
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are CalmNest AI, a compassionate, non-judgmental, and empathetic mental health assistant. Your purpose is to support users by listening attentively, offering thoughtful and encouraging responses, and providing evidence-based mental wellness advice. Prioritize emotional validation, constructive guidance, and self-care techniques. Avoid medical diagnosis, and if needed, gently suggest seeking professional help. Always be kind, uplifting, and supportive." 
            },
            { role: "user", content: formData.query },
          ],
        }),
      });

      const data = await response.json();
      setLoading(false);

      setMessage((prev) => [...prev, { text: data.choices[0]?.message?.content || "I couldn't understand that.", sender: "bot" }]);
    } catch (err) {
      console.log("API error:", err);
      setLoading(false);
      setMessage((prev) => [...prev, { text: "Failed to connect to AI. Check API key.", sender: "bot" }]);
    }

    setformData({ query: "" });
  };
  
  return (
<div className="chatarea flex flex-col justify-between items-center">
  <div
    className="flex justify-between items-center"
    style={{
      width: "100%",
      borderBottom: "1px solid #e0e0e0",
      padding: "0.75rem",
      // backgroundColor: ' #',
      borderRadius:'20px'
    }}
  >
    <p className="logo mr-4 font-bold text-2xl">calmNest Ai</p>
    {/* <input
      placeholder="Paste the API link..."
      className="rounded-xl p-2 shadow-md"
      name="url"
      style={{ width: "300px", marginLeft: "auto" }}
      onChange={(e) => {
        e.preventDefault();
        setUrl(e.target.value);
      }}
    />
    <button onClick={handleSave} className="m-2 px-2 py-1 border-2 rounded-md text-blue-500 flex items-center gap-1 text-sm"><>SET URL</>{boolUrl&&<BsCheckCircle className="text-green-500"/>}</button> */}
    <img src={logo} alt="" style={{ width: "50px", height: "auto" }} />
  </div>
  <div className="chat-container" >
    <div className="message-container">
      {message.map((message, index) =>{ 
        {/* if(message.sender === 'bot'){
            for(let i=0; )
        } */}
        return(
        <div
          key={index}
          className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
        style={{
                alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              }}>
          {<div className="message-text">
  {message.text.split('\n').map((line, i) => (
    <div className="poppins-regular" key={i}>{line}</div>
  ))}
</div>}
        </div>
      )})}
    </div>
    <div style={{display:'flex', justifyContent:'center'}}>  {loading && <ThreeDots
  visible={true}
  height="80"
  width="80"
  color="#5BBCFF"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />}</div>
  </div>
  <form onSubmit={handleSubmit} style={{ position: "relative", width: "100%", background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)",borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
    <textarea
      placeholder="Express how you feel today..."
      name="query"
      value={formData.query}
      onChange={handleChange}
       className="textarea-style"
/>
    <button type="submit">
      <FaArrowAltCircleUp
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "1.50rem",
          color: "rgba(0, 0, 0, 0.8)",
        }}
      />
    </button>
  </form>
</div>
  );
} 
