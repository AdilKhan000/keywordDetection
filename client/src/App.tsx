import { useState } from "react";
import AudioInput from "./components/AudioInput";
import OutputComponent from "./components/Output";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [outputMessage, setOutputMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsSuccess(true);
      setOutputMessage(response.data.message);
    } catch (error) {
      setIsSuccess(false);
      setOutputMessage("File upload failed!");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <AudioInput onFileUpload={handleFileUpload} />
      <OutputComponent message={outputMessage} isSuccess={isSuccess} />
    </div>
  );
}

export default App;
