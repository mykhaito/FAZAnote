import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Menu,
  MenuItem,
  Divider,
  Checkbox,
  Collapse,
  Popover,
} from "@mui/material";
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, ContentCopy as CopyIcon, PlayArrow as PlayIcon, Pause as PauseIcon, Stop as StopIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useLanguage } from "../contexts/LanguageContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useTheme } from "../contexts/ThemeContext";

const TaskList = ({ tasks, onEditTask, onDeleteTask, onDuplicateTask, onTransferTask, onStartTimer, onPauseTimer, activeTimer, onToggleSubtaskComplete }) => {
  const { translations: t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedSubtaskId, setExpandedSubtaskId] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingSubtaskData, setEditingSubtaskData] = useState({ comment: "", commentImages: [] });
  const { theme } = useTheme();
  const [sessionAnchorEl, setSessionAnchorEl] = useState(null);
  const [sessionTask, setSessionTask] = useState(null);

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleTaskAction = (action) => {
    if (selectedTask) {
      switch (action) {
        case "edit":
          onEditTask(selectedTask);
          break;
        case "delete":
          onDeleteTask(selectedTask.id);
          break;
        case "duplicate":
          onDuplicateTask(selectedTask);
          break;
        case "transfer":
          onTransferTask(selectedTask);
          break;
      }
    }
    handleMenuClose();
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}${t.hours} ${mins}${t.minutes}`;
  };

  const formatDetailedTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}${t.hours} ${mins}${t.minutes}`;
    } else if (hours > 0) {
      return `${hours}${t.hours}`;
    } else {
      return `${mins}${t.minutes}`;
    }
  };

  const getLiveTimeSpent = (task, subtask = null) => {
    if (!activeTimer) return subtask ? subtask.timeSpent : task.totalTimeSpent;
    if (subtask && activeTimer.taskId === task.id && activeTimer.subtaskId === subtask.id) {
      return subtask.timeSpent + Math.floor((Date.now() - activeTimer.startTime) / 60000);
    }
    if (!subtask && activeTimer.taskId === task.id && !activeTimer.subtaskId) {
      return task.totalTimeSpent + Math.floor((Date.now() - activeTimer.startTime) / 60000);
    }
    return subtask ? subtask.timeSpent : task.totalTimeSpent;
  };

  const formatProgress = (timeSpent, goal) => {
    if (!goal || goal === 0) {
      return `${t.progress}: ${formatSessionTime(Math.round(timeSpent * 60))}`;
    }

    return `${t.progress}: ${formatSessionTime(Math.round(timeSpent * 60))} / ${formatSessionTime(Math.round(goal * 60))}`;
  };

  const getProgressColor = (timeSpent, goal) => {
    if (goal === 0) return "default";
    const progress = (timeSpent / goal) * 100;
    if (progress >= 100) return "success";
    if (progress >= 50) return "warning";
    return "error";
  };

  const isTimerActive = (taskId) => {
    return activeTimer && activeTimer.taskId === taskId;
  };

  const handleEditSubtaskComment = (subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskData({
      comment: subtask.comment || "",
      commentImages: subtask.commentImages ? [...subtask.commentImages] : [],
    });
  };

  const handleCancelEditSubtaskComment = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskData({ comment: "", commentImages: [] });
  };

  const handleSaveSubtaskComment = (taskId, subtaskId) => {
    if (!editingSubtaskId) return;
    onToggleSubtaskComplete(taskId, subtaskId, undefined, editingSubtaskData.comment, editingSubtaskData.commentImages);
    setEditingSubtaskId(null);
    setEditingSubtaskData({ comment: "", commentImages: [] });
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditingSubtaskData((prev) => ({
        ...prev,
        commentImages: [...(prev.commentImages || []), ev.target.result],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditingSubtaskData((prev) => ({
        ...prev,
        commentImages: [...(prev.commentImages || []), ev.target.result],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (imgIdx) => {
    setEditingSubtaskData((prev) => ({
      ...prev,
      commentImages: prev.commentImages.filter((_, i) => i !== imgIdx),
    }));
  };

  const handleOpenSessionHistory = (event, task) => {
    setSessionAnchorEl(event.currentTarget);
    setSessionTask(task);
  };

  const handleCloseSessionHistory = () => {
    setSessionAnchorEl(null);
    setSessionTask(null);
  };

  const formatSessionTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          color: "var(--text-secondary)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t.noTasks}
        </Typography>
        <Typography variant="body2">{t.addTaskHint}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {tasks.map((task) => (
        <Card
          key={task.id}
          sx={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 3,
            transition: "all 0.2s ease",
            minHeight: task.subtasks && task.subtasks.length > 0 ? "auto" : "80px",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <CardContent sx={{ p: task.subtasks && task.subtasks.length > 0 ? 3 : 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: task.subtasks && task.subtasks.length > 0 ? 2 : 1 }}>
              <Box sx={{ flexGrow: 1, pl: 1, pt: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: task.subtasks && task.subtasks.length > 0 ? 1 : 0.5, color: "var(--text-primary)" }}>
                  {task.title}
                </Typography>

                {task.isTransferred && <Chip label={`Перенесена с ${task.transferredFrom}`} size="small" color="info" variant="outlined" sx={{ mr: 1 }} />}

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip label={formatProgress(getLiveTimeSpent(task), task.dailyGoal)} size="small" color={getProgressColor(getLiveTimeSpent(task), task.dailyGoal)} variant="filled" />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                {!isTimerActive(task.id) ? (
                  <IconButton onClick={() => onStartTimer(task.id)} color="primary" size="small" disabled={activeTimer !== null}>
                    <PlayIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => onPauseTimer()} color="warning" size="small">
                    <PauseIcon />
                  </IconButton>
                )}

                <IconButton onClick={(e) => handleMenuOpen(e, task)} size="small" sx={{ color: "var(--text-primary)" }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            {task.subtasks && task.subtasks.length > 0 && (
              <List sx={{ mt: 2, p: 0 }}>
                {task.subtasks.map((subtask) => (
                  <ListItem
                    key={subtask.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: "1px solid var(--border-color)",
                      borderRadius: 2,
                      background: "var(--bg-primary)",
                      alignItems: "flex-start",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    secondaryAction={null}
                  >
                    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography
                        sx={{ color: "var(--text-primary)", fontWeight: 500, mb: 1, ...(subtask.completed ? { opacity: 0.5, filter: "grayscale(0.5)", textDecoration: "line-through" } : {}) }}
                      >
                        {subtask.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {editingSubtaskId !== subtask.id && (
                          <IconButton
                            size="small"
                            onClick={() => setExpandedSubtaskId(expandedSubtaskId === subtask.id ? null : subtask.id)}
                            className={`subtask-expand-btn${expandedSubtaskId === subtask.id ? " expanded" : ""}`}
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        )}
                        <Checkbox checked={!!subtask.completed} onChange={(e) => onToggleSubtaskComplete(task.id, subtask.id, e.target.checked)} className="subtask-checkbox" />
                      </Box>
                    </Box>
                    <Collapse in={expandedSubtaskId === subtask.id} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
                      <Box sx={{ mt: 1, mb: 1, position: "relative" }}>
                        <Typography variant="caption" sx={{ color: "#e0e0e0" }}>
                          Комментарий:
                        </Typography>
                        <Box
                          sx={{
                            border: "1px solid var(--border-color)",
                            borderRadius: 2,
                            p: 1,
                            minHeight: editingSubtaskId === subtask.id ? 120 : 60,
                            maxHeight: editingSubtaskId === subtask.id ? 240 : 120,
                            overflowY: "auto",
                            background: "var(--bg-secondary)",
                            mt: 0.5,
                            position: "relative",
                            transition: "max-height 0.2s, min-height 0.2s",
                          }}
                          onDrop={editingSubtaskId === subtask.id ? handleImageDrop : undefined}
                          onDragOver={editingSubtaskId === subtask.id ? (e) => e.preventDefault() : undefined}
                        >
                          {editingSubtaskId === subtask.id ? (
                            <>
                              <textarea
                                style={{ width: "100%", minHeight: 60, resize: "none", background: "transparent", color: "var(--text-primary)", border: "none", outline: "none" }}
                                value={editingSubtaskData.comment}
                                onChange={(e) => setEditingSubtaskData((prev) => ({ ...prev, comment: e.target.value }))}
                                placeholder="Введите комментарий..."
                              />
                              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                                {(editingSubtaskData.commentImages || []).map((img, idx) => (
                                  <Box key={idx} sx={{ position: "relative", width: 60, height: 60, mr: 1, mb: 1 }}>
                                    <Zoom
                                      overlayBgColorEnd={theme === "dark" ? "rgba(30,30,30,0.35)" : "rgba(255,255,255,0.35)"}
                                      transitionDuration={400}
                                      zoomMargin={32}
                                      wrapStyle={{ transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s", willChange: "transform,opacity" }}
                                    >
                                      <img
                                        src={img}
                                        alt="img"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          borderRadius: 4,
                                          border: "1px solid var(--border-color)",
                                          cursor: "pointer",
                                          transition: "box-shadow 0.3s",
                                          boxShadow: theme === "dark" ? "0 4px 32px rgba(0,0,0,0.7)" : "0 4px 32px rgba(0,0,0,0.12)",
                                        }}
                                      />
                                    </Zoom>
                                    <IconButton size="small" sx={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => handleRemoveImage(idx)}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                ))}
                                <Button
                                  component="label"
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 60, minWidth: 60, borderRadius: 2, border: "1px dashed var(--border-color)", color: "var(--text-secondary)" }}
                                >
                                  +
                                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <>
                              <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 4, right: 4, zIndex: 2, color: "#e0e0e0" }}
                                onClick={() => handleEditSubtaskComment(subtask)}
                                title={t.editComment}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body2" sx={{ color: "var(--text-primary)", whiteSpace: "pre-line" }}>
                                {subtask.comment || <span style={{ color: "var(--text-secondary)" }}>Нет комментария</span>}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                                {(editingSubtaskId === subtask.id ? editingSubtaskData.commentImages : subtask.commentImages || []).map((img, idx) =>
                                  editingSubtaskId === subtask.id ? (
                                    <Box key={idx} sx={{ position: "relative", width: 60, height: 60, mr: 1, mb: 1 }}>
                                      <Zoom
                                        overlayBgColorEnd={theme === "dark" ? "rgba(30,30,30,0.35)" : "rgba(255,255,255,0.35)"}
                                        transitionDuration={400}
                                        zoomMargin={32}
                                        wrapStyle={{ transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s", willChange: "transform,opacity" }}
                                      >
                                        <img
                                          src={img}
                                          alt="img"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 4,
                                            border: "1px solid var(--border-color)",
                                            cursor: "pointer",
                                            transition: "box-shadow 0.3s",
                                            boxShadow: theme === "dark" ? "0 4px 32px rgba(0,0,0,0.7)" : "0 4px 32px rgba(0,0,0,0.12)",
                                          }}
                                        />
                                      </Zoom>
                                      <IconButton size="small" sx={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => handleRemoveImage(idx)}>
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  ) : (
                                    <Zoom
                                      overlayBgColorEnd={theme === "dark" ? "rgba(30,30,30,0.35)" : "rgba(255,255,255,0.35)"}
                                      transitionDuration={400}
                                      zoomMargin={32}
                                      wrapStyle={{ transition: "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s", willChange: "transform,opacity" }}
                                    >
                                      <img
                                        src={img}
                                        alt="img"
                                        style={{
                                          width: 60,
                                          height: 60,
                                          objectFit: "cover",
                                          borderRadius: 4,
                                          border: "1px solid var(--border-color)",
                                          cursor: "pointer",
                                          transition: "box-shadow 0.3s",
                                          boxShadow: theme === "dark" ? "0 4px 32px rgba(0,0,0,0.7)" : "0 4px 32px rgba(0,0,0,0.12)",
                                        }}
                                      />
                                    </Zoom>
                                  )
                                )}
                              </Box>
                            </>
                          )}
                        </Box>
                        {editingSubtaskId === subtask.id && (
                          <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
                            <Button size="small" variant="contained" color="primary" onClick={() => handleSaveSubtaskComment(task.id, subtask.id)}>
                              Сохранить
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="inherit"
                              onClick={handleCancelEditSubtaskComment}
                              startIcon={<CancelIcon />}
                              sx={{
                                fontWeight: 600,
                                color: "var(--accent-color)",
                                borderColor: "var(--accent-color)",
                                "&:hover": {
                                  background: "rgba(220,53,69,0.08)",
                                  color: "var(--accent-color)",
                                  borderColor: "var(--accent-color)",
                                },
                              }}
                            >
                              Отмена
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </ListItem>
                ))}
              </List>
            )}

            {activeTimer && activeTimer.taskId !== task.id && (
              <Box sx={{ mt: 2, p: 2, background: "rgba(255, 193, 7, 0.1)", borderRadius: 2 }}>
                <Typography variant="body2" color="warning.main">
                  ⚠️ У вас уже запущен таймер на другой задаче
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          },
        }}
      >
        <MenuItem onClick={() => handleTaskAction("edit")}>
          <EditIcon sx={{ mr: 1 }} />
          {t.edit}
        </MenuItem>
        <MenuItem onClick={() => handleTaskAction("duplicate")}>
          <CopyIcon sx={{ mr: 1 }} />
          {t.duplicate}
        </MenuItem>
        <MenuItem onClick={(e) => handleOpenSessionHistory(e, selectedTask)}>
          <AccessTimeIcon sx={{ mr: 1 }} />
          {t.sessionHistory}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleTaskAction("delete")} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          {t.delete}
        </MenuItem>
      </Menu>

      <Popover
        open={Boolean(sessionAnchorEl)}
        anchorEl={sessionAnchorEl}
        onClose={handleCloseSessionHistory}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            p: 2,
            minWidth: 320,
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: 2,
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" /> {t.sessionHistory}
          </Typography>
          {sessionTask && Array.isArray(sessionTask.timerSessions) && sessionTask.timerSessions.length > 0 ? (
            <>
              <Box sx={{ maxHeight: 220, overflowY: "auto", mb: 2 }}>
                {sessionTask.timerSessions.map((s, idx) => (
                  <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, fontSize: "0.97rem" }}>
                    <span>
                      {new Date(s.start).toLocaleDateString()} {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>{formatSessionTime(s.duration)}</span>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
                {t.total}: {formatSessionTime(sessionTask.timerSessions.reduce((acc, s) => acc + s.duration, 0))}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              {t.noSessions}
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default TaskList;
