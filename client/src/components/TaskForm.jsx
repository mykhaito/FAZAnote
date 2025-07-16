import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Collapse,
  TextareaAutosize,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const AnimatedExpandMoreIcon = (props) => {
  const { open } = props;
  return (
    <ExpandMoreIcon
      {...props}
      sx={{
        color: "var(--text-primary)",
        transition: "transform 0.18s cubic-bezier(.4,0,.2,1)",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        ...props.sx,
      }}
    />
  );
};

const TaskForm = ({ open, onClose, task = null, selectedDate, onSave }) => {
  const { translations: t } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    dailyGoal: "",
    subtasks: [],
    repeat: { mode: "none", days: [] },
  });
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [newSubtask, setNewSubtask] = useState({ title: "" });
  const [expandedSubtaskId, setExpandedSubtaskId] = useState(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        dailyGoal: task.dailyGoal || "",
        subtasks: task.subtasks || [],
        repeat: task.repeat || { mode: "none", days: [] },
      });
    } else {
      setFormData({
        title: "",
        dailyGoal: "",
        subtasks: [],
        repeat: { mode: "none", days: [] },
      });
    }
  }, [task, open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.title.trim()) {
      setFormData((prev) => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: newSubtask.title.trim(),
            timeSpent: 0,
            comment: "",
            commentImages: [],
            completed: false,
            timerSessions: [],
          },
        ],
      }));
      setNewSubtask({ title: "" });
    }
  };

  const handleDeleteSubtask = (subtaskId) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== subtaskId),
    }));
  };

  const handleEditSubtask = (subtaskId) => {
    const subtask = formData.subtasks.map((st) => st.id === subtaskId);
    if (subtask) {
      setEditingSubtask({
        id: subtaskId,
        title: subtask.title,
        comment: subtask.comment || "",
        commentImages: subtask.commentImages || [],
        completed: subtask.completed || false,
      });
    }
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      // Формируем дату в формате YYYY-MM-DD
      const pad = (n) => n.toString().padStart(2, '0');
      const y = selectedDate.getFullYear();
      const m = pad(selectedDate.getMonth() + 1);
      const d = pad(selectedDate.getDate());
      const localDateString = `${y}-${m}-${d}`;
      const taskData = {
        id: task?.id || Date.now().toString(),
        title: formData.title.trim(),
        dailyGoal: formData.dailyGoal === "" ? 0 : parseInt(formData.dailyGoal) || 0,
        subtasks: formData.subtasks.map((subtask) => ({
          ...subtask,
          id: subtask.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timeSpent: subtask.timeSpent || 0,
          completed: subtask.completed || false,
          comment: subtask.comment || "",
          commentImages: subtask.commentImages || [],
          timerSessions: subtask.timerSessions || [],
        })),
        totalTimeSpent: task?.totalTimeSpent || 0,
        date: localDateString,
        isTransferred: false,
        transferredFrom: null,
        repeat: formData.repeat,
        timerSessions: task?.timerSessions || [],
      };
      onSave(taskData);
      onClose();
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditingSubtask((prev) => ({
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
      setEditingSubtask((prev) => ({
        ...prev,
        commentImages: [...(prev.commentImages || []), ev.target.result],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (imgIdx) => {
    setEditingSubtask((prev) => ({
      ...prev,
      commentImages: prev.commentImages.filter((_, i) => i !== imgIdx),
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
          {task ? t.editTask : t.createTask}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 5, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "14px",
              p: 2.5,
              color: "var(--text-primary)",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "var(--text-primary)", letterSpacing: 0.2, fontSize: "1.15rem" }}>
              {t.mainInfo}
            </Typography>
            <TextField
              fullWidth
              label={t.taskTitle}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              variant="outlined"
              size="small"
              required
              sx={{
                mb: 2,
                mt: 1,
                "& .MuiInputLabel-root": {
                  color: "var(--text-primary)",
                  fontSize: "1.15rem",
                  fontWeight: 500,
                },
                "& .MuiInputBase-input": {
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  height: "40px",
                  minHeight: "40px",
                  boxSizing: "border-box",
                  padding: "0 12px",
                },
                "& .MuiOutlinedInput-root": {
                  background: "var(--bg-primary)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "10px",
                  height: "40px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                label={`${t.dailyGoal} (${t.timeSpent})`}
                type="number"
                value={formData.dailyGoal}
                onChange={(e) => handleInputChange("dailyGoal", e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                variant="outlined"
                size="small"
                placeholder="0"
                sx={{
                  mb: 0,
                  "& .MuiInputLabel-root": {
                    color: "var(--text-primary)",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    height: "40px",
                    minHeight: "40px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "var(--text-primary)",
                  },
                  "& .MuiOutlinedInput-root": {
                    background: "var(--bg-primary)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "10px",
                    height: "40px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                  },
                }}
                inputProps={{
                  min: 0,
                  step: 1,
                  style: {
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    height: "40px",
                    minHeight: "40px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                  },
                }}
                helperText={t.timeInputHint}
              />
            </Box>
          </Box>

          <Box
            sx={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "14px",
              p: 2.5,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "var(--text-primary)", letterSpacing: 0.2, fontSize: "1.15rem" }}>
              {t.schedule}
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <Select
                value={formData.repeat.mode}
                onChange={(e) => setFormData((prev) => ({ ...prev, repeat: { ...prev.repeat, mode: e.target.value, days: e.target.value === "custom" ? prev.repeat.days : [] } }))}
                IconComponent={AnimatedExpandMoreIcon}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "10px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    },
                  },
                }}
                sx={{
                  background: "var(--bg-primary)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  border: "1.5px solid var(--border-color)",
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  height: "40px",
                  minHeight: "40px",
                  "& .MuiOutlinedInput-root": { height: "40px", minHeight: "40px", display: "flex", alignItems: "center", boxSizing: "border-box" },
                  "& .MuiSelect-select": {
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    paddingLeft: "0px",
                    paddingRight: "12px",
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: "40px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                  },
                  "& .MuiSelect-icon": {
                    right: 8,
                  },
                  "& fieldset": { borderColor: "transparent" },
                }}
              >
                <MenuItem value="none">{t.dontRepeat}</MenuItem>
                <MenuItem value="daily">{t.everyDay}</MenuItem>
                <MenuItem value="weekdays">{t.weekdaysOnly}</MenuItem>
                <MenuItem value="weekends">{t.weekendsOnly}</MenuItem>
                <MenuItem value="custom">{t.customDays}</MenuItem>
              </Select>
            </FormControl>
            {formData.repeat.mode === "custom" && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <Box key={day} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 54 }}>
                    <Checkbox
                      checked={formData.repeat.days.includes(day)}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          repeat: {
                            ...prev.repeat,
                            days: e.target.checked ? [...prev.repeat.days, day] : prev.repeat.days.filter((d) => d !== day),
                          },
                        }));
                      }}
                      sx={{
                        color: "var(--accent-color)",
                        "&.Mui-checked": { color: "var(--accent-color)" },
                        p: 0.5,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "var(--text-primary)", fontWeight: 600, letterSpacing: 0.5 }}>
                      {[t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat][day]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "14px",
              p: 2.5,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "var(--text-primary)", letterSpacing: 0.2, fontSize: "1.15rem" }}>
              {t.subtasks}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                label={t.subtaskTitle}
                value={newSubtask.title}
                onChange={(e) => setNewSubtask({ title: e.target.value })}
                variant="outlined"
                size="small"
                onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "var(--text-primary)",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    height: "40px",
                    minHeight: "40px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                  },
                  "& .MuiOutlinedInput-root": {
                    background: "var(--bg-primary)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "10px",
                    height: "40px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                  },
                }}
              />
              <IconButton
                onClick={handleAddSubtask}
                sx={{
                  background: "var(--accent-color)",
                  color: "white",
                  "&:hover": { background: "var(--accent-hover)" },
                  height: "40px",
                  width: "40px",
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {formData.subtasks.length > 0 && (
              <List sx={{ mt: 2, p: 0 }}>
                {formData.subtasks.map((subtask, index) => (
                  <ListItem
                    key={subtask.id}
                    sx={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "10px",
                      mb: 1,
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {subtask.title}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteSubtask(subtask.id)} sx={{ color: "var(--text-primary)" }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: "var(--text-secondary)" }}>
          {t.cancel}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            background: "var(--accent-color)",
            "&:hover": { background: "var(--accent-hover)" },
          }}
        >
          {task ? t.save : t.create}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
