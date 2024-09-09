import { useState, useRef } from "react";

interface AudioInputProps {
  onFileUpload: (file: File) => void;
}

function AudioInput({ onFileUpload }: AudioInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null); // Store the media stream

  // Function to handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setRecordedAudio(null);
  };

  // Function to handle audio recording
  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorder.current?.stop();
      setIsRecording(false);

      // Stop all tracks of the media stream to release the microphone
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaStream.current = null; // Clear the media stream reference
      }
    } else {
      // Start recording
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          mediaStream.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          const recorder = new MediaRecorder(mediaStream.current);
          mediaRecorder.current = recorder;
          audioChunks.current = []; // Reset chunks

          recorder.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, {
              type: "audio/wav",
            });
            const audioURL = URL.createObjectURL(audioBlob);
            setRecordedAudio(audioURL);
            const wavFile = new File([audioBlob], "recording.wav", {
              type: "audio/wav",
            });
            setFile(wavFile);
          };

          recorder.start();
          setIsRecording(true);
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      }
    }
  };

  const handleDiscard = () => {
    setRecordedAudio(null);
    setFile(null); // Reset the file state when recording is discarded
  };

  // Function to handle upload
  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
    } else {
      console.log("No file or recording selected");
    }
  };

  return (
    <div className="input-group mb-3 d-flex flex-column align-items-center">
      <div className="d-flex align-items-center mb-2">
        <input
          type="file"
          className="form-control"
          id="inputGroupFile02"
          accept="audio/*"
          onChange={handleFileChange}
        />

        <button
          className={`btn ${isRecording ? "btn-danger" : "btn-secondary"} ms-2`}
          onClick={handleRecording}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <i className="bi bi-mic-fill"></i>
        </button>

        <button className="btn btn-primary ms-2" onClick={handleUpload}>
          Upload
        </button>
      </div>

      {recordedAudio && (
        <div className="d-flex align-items-center">
          <audio controls className="mr-2">
            <source src={recordedAudio} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <button
            className="btn btn-close"
            aria-label="Close"
            onClick={handleDiscard}
          ></button>
        </div>
      )}
    </div>
  );
}

export default AudioInput;
