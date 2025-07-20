import { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, Grid, AppBar, Toolbar, IconButton, Button, Tabs, Tab, Tooltip } from "@mui/material";
import { Add as AddIcon, Logout as LogoutIcon, Download as DownloadIcon, Upload as UploadIcon, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { uk, enUS, ru } from "date-fns/locale";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Calendar from "../components/Calendar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Timer from "../components/Timer";
import Statistics from "../components/Statistics";
import "../styles/Dashboard.css";
import "../styles/MobileStyles.css";
import "../styles/MobileEnhancements.css";
import "../styles/Performance.css";
import logo from "../assets/logo.png";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

function AppControls({ theme, toggleTheme, language, setLanguage, t, handleExportData, handleImportData, handleLogout, isMobile }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 3 : 2,
        minWidth: isMobile ? 180 : "auto",
        p: 2,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: isMobile ? 2 : 0 }}>
        {isMobile && (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t.themeLabel || "Тема:"}
          </Typography>
        )}
        {isMobile ? (
          <IconButton onClick={toggleTheme} color="inherit" size="large" sx={{ color: "var(--text-primary)" }}>
            {theme === "light" ? "🌙" : "☀️"}
          </IconButton>
        ) : (
          <Tooltip title={(t.themeLabel || "Тема").replace(/:$/, "")} enterDelay={1000} arrow>
            <IconButton onClick={toggleTheme} color="inherit" size="large" sx={{ color: "var(--text-primary)" }}>
              {theme === "light" ? "🌙" : "☀️"}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: isMobile ? 2 : 0 }}>
        {isMobile && (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t.languageLabel || "Язык:"}
          </Typography>
        )}
        {isMobile ? (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <option value="ukr">🇺🇦 UKR</option>
            <option value="en">🇺🇸 EN</option>
            <option value="ru">🇷🇺 RU</option>
          </select>
        ) : (
          <Tooltip title={(t.languageLabel || "Язык").replace(/:$/, "")} enterDelay={1000} arrow>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <option value="ukr">🇺🇦 UKR</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ru">🇷🇺 RU</option>
            </select>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: isMobile ? 2 : 0 }}>
        {isMobile && (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t.exportLabel || "Скачать:"}
          </Typography>
        )}
        {isMobile ? (
          <IconButton onClick={handleExportData} color="inherit" title={t.exportData} size="large" sx={{ color: "var(--text-primary)" }}>
            <DownloadIcon />
          </IconButton>
        ) : (
          <Tooltip title={(t.exportLabel || "Скачать").replace(/:$/, "")} enterDelay={1000} arrow>
            <IconButton onClick={handleExportData} color="inherit" size="large" sx={{ color: "var(--text-primary)" }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: isMobile ? 2 : 0 }}>
        {isMobile && (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t.importLabel || "Загрузить:"}
          </Typography>
        )}
        {isMobile ? (
          <IconButton component="label" color="inherit" title={t.importData} size="large" sx={{ color: "var(--text-primary)" }}>
            <UploadIcon />
            <input type="file" accept=".json" onChange={handleImportData} style={{ display: "none" }} />
          </IconButton>
        ) : (
          <Tooltip title={(t.importLabel || "Загрузить").replace(/:$/, "")} enterDelay={1000} arrow>
            <IconButton component="label" color="inherit" size="large" sx={{ color: "var(--text-primary)" }}>
              <UploadIcon />
              <input type="file" accept=".json" onChange={handleImportData} style={{ display: "none" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: isMobile ? 2 : 0 }}>
        {isMobile && (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t.logoutLabel || "Выйти:"}
          </Typography>
        )}
        {isMobile ? (
          <IconButton onClick={handleLogout} color="inherit" size="large" sx={{ color: "var(--text-primary)" }}>
            <LogoutIcon />
          </IconButton>
        ) : (
          <Tooltip title={(t.logoutLabel || "Выйти").replace(/:$/, "")} enterDelay={1000} arrow>
            <IconButton onClick={handleLogout} color="inherit" size="large" sx={{ color: "var(--text-primary)" }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

const sanitizeText = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  const safe = div.innerHTML;
  return safe
    .replace(/script/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/javascript:/gi, "");
};

const isSafeDepth = (obj, depth = 0, maxDepth = 10) => {
  if (depth > maxDepth) return false;
  if (typeof obj !== "object" || obj === null) return true;
  return Object.values(obj).every((value) => isSafeDepth(value, depth + 1, maxDepth));
};

const isValidLength = (str, max = 500) => typeof str === "string" && str.length <= max;

const countTextWeight = (tasks) => {
  return tasks.reduce((sum, task) => {
    const taskSize = (task.title || "").length + (task.description || "").length + (task.subtasks || []).reduce((s, sub) => s + (sub.title || "").length + (sub.comment || "").length, 0);
    return sum + taskSize;
  }, 0);
};

const sanitizeTasks = (tasks) =>
  tasks
    .filter((task) => typeof task === "object" && typeof task.title === "string" && typeof task.date === "string" && Array.isArray(task.subtasks))
    .map((task) => ({
      ...task,
      title: isValidLength(task.title) ? sanitizeText(task.title) : "title too long",
      description: isValidLength(task.description) ? sanitizeText(task.description || "") : "description too long",
      subtasks: (task.subtasks || []).map((subtask) => ({
        ...subtask,
        title: isValidLength(subtask.title) ? sanitizeText(subtask.title || "") : "⚠️",
        comment: isValidLength(subtask.comment) ? sanitizeText(subtask.comment || "") : "",
      })),
    }));

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { translations: t, language, setLanguage } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawerOpen]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("faza_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks:", error);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("faza_tasks", JSON.stringify(tasks));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [tasks]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleExportData = () => {
    let tasksToExport = [...tasks];

    tasksToExport.sort((a, b) => new Date(a.date) - new Date(b.date));

    while (countTextWeight(tasksToExport) > 500000 && tasksToExport.length > 0) {
      tasksToExport.shift();
    }

    const exportData = {
      tasks: tasksToExport,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `fazanote_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!isSafeDepth(importedData)) {
          alert("Import stopped: too complicated structure.");
          return;
        }

        if (importedData.tasks && Array.isArray(importedData.tasks)) {
          const textWeight = countTextWeight(importedData.tasks);
          if (textWeight > 500000) {
            let tasks = importedData.tasks;
            tasks = tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
            while (countTextWeight(tasks) > 500000 && tasks.length > 0) {
              tasks.shift();
            }
            if (tasks.length === 0) {
              alert("Import failure: too much text data.");
              return;
            }
            const cleanedTasks = sanitizeTasks(tasks);
            setTasks(cleanedTasks);
            alert("Import successful: latest tasks keeped.");
            return;
          }

          const cleanedTasks = sanitizeTasks(importedData.tasks);
          setTasks(cleanedTasks);
          alert(t.importSuccess || "Import successful");
        } else {
          alert(t.invalidFormat || "Invalid format");
        }
      } catch {
        alert(t.importError || "Import failure");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleLogout = () => {
    localStorage.removeItem("faza_has_visited");
    const basePath = import.meta.env.PROD ? "/FAZAnote" : "";
    window.location.href = basePath + "/";
  };

  const tasksForSelectedDate = tasks.filter((task) => {
    const taskDate = new Date(task.date + "T00:00:00");
    const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return taskDate.getTime() === selected.getTime();
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? taskData : task)));
    } else {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        totalTimeSpent: 0,
        timerSessions: [],
      };

      if (taskData.repeat && taskData.repeat.mode !== "none") {
        const startDate = new Date(taskData.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const repeatTasks = generateRepeatTasks(newTask, startDate, endDate);
        setTasks((prev) => [...prev, newTask, ...repeatTasks]);
      } else {
        setTasks((prev) => [...prev, newTask]);
      }
    }
  };

  const generateRepeatTasks = (originalTask, startDate, endDate) => {
    const tasks = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      currentDate.setDate(currentDate.getDate() + 1);

      if (shouldCreateTaskForDate(originalTask.repeat, currentDate)) {
        const taskCopy = {
          ...originalTask,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + currentDate.getTime(),
          date: currentDate.toISOString().split("T")[0],
          totalTimeSpent: 0,
          timerSessions: [],
          subtasks: originalTask.subtasks.map((subtask) => ({
            ...subtask,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timeSpent: 0,
            completed: false,
            timerSessions: [],
          })),
        };
        tasks.push(taskCopy);
      }
    }

    return tasks;
  };

  const shouldCreateTaskForDate = (repeat, date) => {
    const dayOfWeek = date.getDay();

    switch (repeat.mode) {
      case "daily":
        return true;
      case "weekdays":
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case "weekends":
        return dayOfWeek === 0 || dayOfWeek === 6;
      case "custom":
        return repeat.days.includes(dayOfWeek);
      default:
        return false;
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleDuplicateTask = (task) => {
    const duplicatedTask = {
      ...task,
      id: Date.now().toString(),
      totalTimeSpent: 0,
      subtasks: task.subtasks.map((subtask) => ({
        ...subtask,
        timeSpent: 0,
      })),
    };
    setTasks((prev) => [...prev, duplicatedTask]);
  };

  const handleTransferTask = (task) => {
    if (import.meta.env.DEV) console.log("Transfer task:", task);
  };

  const handleStartTimer = (taskId, subtaskId = null) => {
    if (activeTimer) {
      if (!window.confirm("У вас уже запущен таймер. Хотите запустить еще один?")) {
        return;
      }
    }
    setActiveTimer({ taskId, subtaskId, startTime: Date.now() });
  };

  const handlePauseTimer = () => {
    if (activeTimer) {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - activeTimer.startTime) / 1000);
      const elapsedMinutes = elapsedSeconds / 60;
      if (elapsedSeconds > 0) {
        setTasks((prev) =>
          prev.map((task) => {
            if (task.id === activeTimer.taskId) {
              const updatedTask = {
                ...task,
                totalTimeSpent: (task.totalTimeSpent || 0) + elapsedMinutes,
                timerSessions: Array.isArray(task.timerSessions)
                  ? [...task.timerSessions, { start: activeTimer.startTime, end: now, duration: elapsedSeconds }]
                  : [{ start: activeTimer.startTime, end: now, duration: elapsedSeconds }],
              };
              if (activeTimer.subtaskId) {
                updatedTask.subtasks = task.subtasks.map((subtask) =>
                  subtask.id === activeTimer.subtaskId
                    ? {
                        ...subtask,
                        timeSpent: (subtask.timeSpent || 0) + elapsedMinutes,
                        timerSessions: Array.isArray(subtask.timerSessions)
                          ? [...subtask.timerSessions, { start: activeTimer.startTime, end: now, duration: elapsedSeconds }]
                          : [{ start: activeTimer.startTime, end: now, duration: elapsedSeconds }],
                      }
                    : subtask
                );
              }
              return updatedTask;
            }
            return task;
          })
        );
      }
      setActiveTimer(null);
    }
  };

  const handleToggleSubtaskComplete = (taskId, subtaskId, completed, comment, commentImages) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((st) => {
            if (st.id !== subtaskId) return st;
            return {
              ...st,
              ...(typeof completed === "boolean" ? { completed } : {}),
              ...(typeof comment === "string" ? { comment } : {}),
              ...(Array.isArray(commentImages) ? { commentImages } : {}),
            };
          }),
        };
      })
    );
  };

  return (
    <div className={`dashboard ${theme}`}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          boxShadow: "none",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <img
              src={logo}
              alt="FAZAnote logo"
              width={64}
              height={64}
              style={{
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                width: "64px",
                height: "64px",
                ...(window.innerWidth <= 600 ? { width: "72px", height: "72px" } : {}),
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "2.3rem", md: "1.5rem" },
                lineHeight: 1.1,
              }}
            >
              fazanote
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} sx={{ transform: { xs: "scale(1.10)", md: "none" } }}>
              <MenuIcon sx={{ fontSize: { xs: 36, md: 28 } }} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <AppControls
              theme={theme}
              toggleTheme={toggleTheme}
              language={language}
              setLanguage={setLanguage}
              t={t}
              handleExportData={handleExportData}
              handleImportData={handleImportData}
              handleLogout={handleLogout}
              isMobile={false}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          className: "menu-dialog",
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderRadius: 3,
          },
        }}
      >
        <IconButton onClick={() => setDrawerOpen(false)} sx={{ position: "absolute", top: 8, right: 8, color: "var(--text-primary)", zIndex: 10 }}>
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ width: { xs: "90vw", sm: "50vw" }, maxWidth: 400, minWidth: 240, p: 2, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <AppControls
            theme={theme}
            toggleTheme={toggleTheme}
            language={language}
            setLanguage={setLanguage}
            t={t}
            handleExportData={handleExportData}
            handleImportData={handleImportData}
            handleLogout={handleLogout}
            isMobile={true}
          />
        </DialogContent>
      </Dialog>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
          <Grid container spacing={0} sx={{ justifyContent: "center", alignItems: "flex-start", gap: "30px" }}>
            <Grid
              item
              sx={{
                position: "sticky",
                top: 20,
                width: { xs: "100%", lg: "490px" },
                flexShrink: 0,
              }}
            >
              <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} tasks={tasks} />
            </Grid>

            <Grid
              item
              sx={{
                width: { xs: "100%", lg: "600px" },
                flexShrink: 0,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  minHeight: "600px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, gap: 2 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>
                    {format(selectedDate, "EEEE, d MMMM yyyy", {
                      locale: language === "en" ? enUS : language === "ru" ? ru : uk,
                    })}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddTask}
                    sx={{
                      backgroundColor: "var(--accent-color)",
                      "&:hover": { backgroundColor: "var(--accent-hover)" },
                      minWidth: "140px",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      padding: "8px 16px",
                    }}
                  >
                    {t.addTask}
                  </Button>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: "var(--border-color)", mb: 3 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                      "& .MuiTab-root": {
                        color: "var(--text-secondary)",
                        "&.Mui-selected": {
                          color: "var(--text-primary)",
                        },
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "var(--accent-color)",
                      },
                    }}
                  >
                    <Tab label={t.tasks} />
                    <Tab label={t.statistics} />
                  </Tabs>
                </Box>

                {activeTab === 0 && (
                  <TaskList
                    tasks={tasksForSelectedDate}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onDuplicateTask={handleDuplicateTask}
                    onTransferTask={handleTransferTask}
                    onStartTimer={handleStartTimer}
                    onPauseTimer={handlePauseTimer}
                    activeTimer={activeTimer}
                    onToggleSubtaskComplete={handleToggleSubtaskComplete}
                  />
                )}

                {activeTab === 1 && <Statistics tasks={tasks} selectedDate={selectedDate} />}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <TaskForm open={taskFormOpen} onClose={() => setTaskFormOpen(false)} task={editingTask} selectedDate={selectedDate} onSave={handleSaveTask} />

      <Timer activeTimer={activeTimer} onPauseTimer={handlePauseTimer} tasks={tasks} />
    </div>
  );
};

export default Dashboard;
