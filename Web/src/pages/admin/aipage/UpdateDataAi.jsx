import { useEffect, useRef, useState } from "react";

const UpdateDataAi = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const readerRef = useRef(null);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isUpdating) {
        event.preventDefault();
        event.returnValue =
          "Dữ liệu đang được cập nhật. Nếu bạn thoát, tiến trình sẽ bị hủy và dữ liệu sẽ không được cập nhật!";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUpdating]);

  const startProgress = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3500/api/ai/updatedata"
      );

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder("utf-8");
      let partial = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setDone(true);
          setIsUpdating(false);
          break;
        }

        partial += decoder.decode(value, { stream: true });
        const lines = partial.split("\n\n");

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith("data:")) {
            const percent = parseFloat(
              line.replace("data:", "").trim()
            );
            if (!isNaN(percent)) {
              setProgress(percent);
            }
          }
        }

        partial = lines[lines.length - 1];
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      setIsUpdating(false);
    }
  };

  const handleStart = () => {
    setProgress(0);
    setDone(false);
    setIsUpdating(true);
    startProgress();
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">
            Cập nhật dữ liệu cho chat bot
          </h5>

          <button
            className="btn btn-primary mb-3"
            onClick={handleStart}
            disabled={isUpdating}
          >
            🚀 Bắt đầu cập nhật dữ liệu
          </button>

          {isUpdating && (
            <div>
              <div className="progress" style={{ height: "30px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {progress.toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {done && (
            <p className="mt-2 fw-bold text-success">
              ✅ Đã hoàn tất!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateDataAi;
