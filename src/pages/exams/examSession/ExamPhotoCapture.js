import React, { useEffect, useRef, useState, useCallback } from "react";
import { uploadExamSessionPhoto } from "../../../services/examSessionsApi";
import styles from "./ExamSessionPage.module.css";

const ExamPhotoCapture = ({ examId, studentNumber }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sequenceNumber, setSequenceNumber] = useState(1);

  useEffect(() => {
    if (!examId || !studentNumber) return;

    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setError("Kamera açılmadı. Brauzer icazələrini yoxlayın.");
      }
    };

    start();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [examId, studentNumber]);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !examId || !studentNumber) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const timestamp = new Date().toISOString();
    const currentSeq = sequenceNumber;

    setUploading(true);
    setError("");

    try {
      await uploadExamSessionPhoto({
        examId,
        studentNumber,
        timestamp,
        sequenceNumber: currentSeq,
        file: blob,
      });
      setSequenceNumber(currentSeq + 1);
    } catch (e) {
      setError("Şəkil göndərilərkən xəta baş verdi.");
    } finally {
      setUploading(false);
    }
  }, [examId, studentNumber, sequenceNumber]);

  useEffect(() => {
    if (!examId || !studentNumber) return;

    const intervalId = window.setInterval(() => {
      handleCapture();
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [examId, studentNumber, handleCapture]);

  if (!studentNumber) return null;

  return (
    <div className={styles.photoBox}>
      {error && <div className={styles.photoError}>{error}</div>}
      <div className={styles.photoVideoWrapper}>
        <video
          ref={videoRef}
          className={styles.photoVideo}
          autoPlay
          playsInline
        />
      </div>
      <button
        type="button"
        className={styles.photoButton}
        onClick={handleCapture}
        disabled={uploading}
      >
        {uploading ? "Göndərilir..." : "Şəkil çək və göndər"}
      </button>
    </div>
  );
};

export default ExamPhotoCapture;
