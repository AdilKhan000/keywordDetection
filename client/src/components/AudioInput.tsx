import { useState } from "react";

interface AudioInputProps {
  onFileUpload: (file: File) => void;
}

function AudioInput({ onFileUpload }: AudioInputProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="file"
        className="form-control"
        id="inputGroupFile02"
        onChange={handleFileChange}
      />
      <button className="btn btn-primary" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default AudioInput;
