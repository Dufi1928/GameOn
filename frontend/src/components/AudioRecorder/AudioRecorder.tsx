import { useState, useRef } from 'react';
import { BiMicrophone, BiPlayCircle } from 'react-icons/bi';
import { FaMicrophone } from 'react-icons/fa';

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    let chunks: Blob[] = [];

    const handleDataAvailable = (event: BlobEvent) => {
        chunks.push(event.data);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            chunks = [];
            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(blob);
                setAudioReady(true);
            }
        }
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
                mediaRecorderRef.current.start();
                setRecording(true);
                setAudioReady(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la demande de l\'autorisation audio :', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setRecording(false);
        }
    };

    const playRecording = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const handleClick = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div>
            <div
                className={`record-button ${recording ? 'recording' : ''}`}
                onClick={handleClick}
            >
                {recording ? <FaMicrophone className="icon active-micro" /> : <BiMicrophone className="icon" />}
            </div>
            {audioReady && <div>
                <audio ref={audioRef} controls />
                <button onClick={playRecording}><BiPlayCircle /> Play</button>
            </div>}
        </div>
    );
};

export default AudioRecorder;
