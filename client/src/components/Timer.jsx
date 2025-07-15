import { useState, useEffect } from "react";
import { Box, Paper, Typography, IconButton, Chip, LinearProgress } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";

const Timer = ({ activeTimer, onPauseTimer, tasks }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const { translations: t } = useLanguage();

  useEffect(() => {
    if (!activeTimer) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) {
    return null;
  }

  const task = tasks.find((t) => t.id === activeTimer.taskId);
  const subtask = activeTimer.subtaskId ? task?.subtasks?.find((st) => st.id === activeTimer.subtaskId) : null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    const goal = subtask ? subtask.goal : task?.dailyGoal;
    if (!goal || goal === 0) return 0;

    const totalElapsed = elapsedTime / 60 + (subtask ? subtask.timeSpent : task.totalTimeSpent);
    return Math.min((totalElapsed / goal) * 100, 100);
  };

  const getProgressColor = () => {
    const progress = getProgress();
    if (progress >= 100) return "success";
    if (progress >= 50) return "warning";
    return "error";
  };

  return (
    <Paper
      elevation={4}
      data-timer="true"
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        p: 3,
        minWidth: 320,
        maxWidth: 380,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: 3,
        zIndex: 1000,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <TimerIcon
          color="primary"
          sx={{
            fontSize: 28,
            color: "var(--accent-color)",
            flexShrink: 0,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          {t.timerActive}
        </Typography>

        <IconButton
          onClick={onPauseTimer}
          color="warning"
          size="small"
          sx={{
            backgroundColor: "rgba(255, 193, 7, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 193, 7, 0.2)",
              transform: "scale(1.05)",
              boxShadow: "0 4px 12px rgba(255, 193, 7, 0.2)",
            },
            transition: "all 0.2s ease",
            "& .MuiSvgIcon-root": {
              fontSize: 20,
            },
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="4" height="12" rx="1.5" fill="#ff9800" />
            <rect x="14" y="6" width="4" height="12" rx="1.5" fill="#ff9800" />
          </svg>
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {subtask ? t.subtaskLabel : t.taskLabel}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          {subtask ? subtask.title : task?.title}
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 3,
          textAlign: "center",
          p: 2,
          backgroundColor: "var(--bg-secondary)",
          borderRadius: 2,
          border: "1px solid var(--border-color)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "var(--accent-color)",
            fontFamily: "monospace",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            animation: "pulse 2s infinite",
          }}
        >
          {formatTime(elapsedTime)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {t.sessionTime}
        </Typography>
      </Box>

      {(subtask?.goal > 0 || task?.dailyGoal > 0) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, color: "var(--text-secondary)" }}>
            {t.progress}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            color={getProgressColor()}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "var(--bg-secondary)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background:
                  getProgressColor() === "success"
                    ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                    : getProgressColor() === "warning"
                    ? "linear-gradient(90deg, #ff9800, #ffb74d)"
                    : "linear-gradient(90deg, #f44336, #ef5350)",
              },
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 2,
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {t.totalTime}:
        </Typography>
        <Chip
          label={formatTime(Math.floor((subtask ? subtask.timeSpent : task?.totalTimeSpent || 0) * 60 + elapsedTime))}
          size="small"
          color="primary"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderColor: "var(--accent-color)",
            color: "var(--accent-color)",
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default Timer;
