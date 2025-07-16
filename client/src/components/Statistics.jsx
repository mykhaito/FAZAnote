import { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Card, CardContent, LinearProgress, Chip } from "@mui/material";
import { TrendingUp as TrendingUpIcon, Timer as TimerIcon, CheckCircle as CheckCircleIcon, Star as StarIcon } from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";

const Statistics = ({ tasks, selectedDate }) => {
  const { translations: t } = useLanguage();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalTimeSpent: 0,
    totalGoals: 0,
    completionRate: 0,
    goalProgress: 0,
  });

  useEffect(() => {
    const pad = (n) => n.toString().padStart(2, '0');
    const y = selectedDate.getFullYear();
    const m = pad(selectedDate.getMonth() + 1);
    const d = pad(selectedDate.getDate());
    const selectedDateString = `${y}-${m}-${d}`;
    const tasksForDate = tasks.filter((task) => task.date === selectedDateString);

    let totalTasks = tasksForDate.length;
    let completedTasks = 0;
    let totalTimeSpent = 0;
    let totalGoals = 0;
    let totalGoalProgress = 0;

    tasksForDate.forEach((task) => {
      totalTimeSpent += task.totalTimeSpent || 0;

      if (task.dailyGoal > 0) {
        totalGoals += task.dailyGoal;
        totalGoalProgress += Math.min(task.totalTimeSpent || 0, task.dailyGoal);
      }

      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((subtask) => {
          totalTimeSpent += subtask.timeSpent || 0;

          if (subtask.goal > 0) {
            totalGoals += subtask.goal;
            totalGoalProgress += Math.min(subtask.timeSpent || 0, subtask.goal);
          }
        });
      }

      const taskProgress = getTaskProgress(task);
      if (taskProgress >= 100) {
        completedTasks++;
      }
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const goalProgress = totalGoals > 0 ? (totalGoalProgress / totalGoals) * 100 : 0;

    setStats({
      totalTasks,
      completedTasks,
      totalTimeSpent,
      totalGoals,
      completionRate,
      goalProgress,
    });
  }, [tasks, selectedDate]);

  const getTaskProgress = (task) => {
    if (task.dailyGoal === 0) return 0;
    return Math.min((task.totalTimeSpent / task.dailyGoal) * 100, 100);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}${t.hours} ${mins}${t.minutes}`;
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "success";
    if (progress >= 50) return "warning";
    return "error";
  };

  const getProgressIcon = (progress) => {
    if (progress >= 100) return <StarIcon sx={{ color: "#FFD700" }} />;
    if (progress >= 50) return <CheckCircleIcon />;
    return <TrendingUpIcon />;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, marginBottom: "16px" }}>
        {t.dayStatistics}
      </Typography>

      <Grid container spacing={0} sx={{ width: "100%", mb: 3, gap: 1, marginTop: "8px !important" }}>
        <Grid item xs={12} md={5.8}>
          <Card sx={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {t.tasksLabel}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" sx={{ color: "var(--text-primary)" }}>
                  {t.completed}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {stats.completedTasks} / {stats.totalTasks}
                </Typography>
              </Box>

              <Box sx={{ marginTop: "auto" }}>
                <LinearProgress variant="determinate" value={stats.completionRate} color={getProgressColor(stats.completionRate)} sx={{ height: 8, borderRadius: 4, mb: 1 }} />

                <Typography variant="body2" sx={{ textAlign: "center", color: "var(--text-primary)" }}>
                  {Math.round(stats.completionRate)}
                  {t.completedPercent}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5.8}>
          <Card sx={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {t.timeLabel}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" sx={{ color: "var(--text-primary)" }}>
                  {t.progress}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {formatTime(stats.totalTimeSpent)}
                </Typography>
              </Box>

              {stats.totalGoals > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "var(--text-primary)" }}>
                    {t.goalLabel}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {formatTime(stats.totalGoals)}
                  </Typography>
                </Box>
              )}

              {stats.totalGoals > 0 && (
                <Box sx={{ marginTop: "auto" }}>
                  <LinearProgress variant="determinate" value={stats.goalProgress} color={getProgressColor(stats.goalProgress)} sx={{ height: 8, borderRadius: 4, mb: 1 }} />

                  <Typography variant="body2" sx={{ textAlign: "center", color: "var(--text-primary)" }}>
                    {Math.round(stats.goalProgress)}
                    {t.goalPercent}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, marginTop: "32px !important" }}>
          {t.detailsByTasks}
        </Typography>

        <Box sx={{ marginTop: "24px !important" }}>
          {tasks
            .filter((task) => {
              const taskDate = new Date(task.date);
              const selected = new Date(selectedDate);
              return taskDate.toDateString() === selected.toDateString();
            })
            .map((task) => (
              <Box
                key={task.id}
                className="statistics-task-item"
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid var(--border-color)",
                  borderRadius: 2,
                  background: "var(--bg-secondary)",
                  width: "100%",
                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "var(--text-primary)", pl: 0 }}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {getProgressIcon(getTaskProgress(task))}
                    <Chip label={`${Math.round(getTaskProgress(task))}%`} size="small" color={getProgressColor(getTaskProgress(task))} variant="outlined" />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "var(--text-secondary)", pl: 0 }}>
                    {t.progress}: {formatTime(task.totalTimeSpent || 0)}
                  </Typography>
                  {task.dailyGoal > 0 && (
                    <Typography variant="body2" sx={{ color: "var(--text-secondary)", pl: 0 }}>
                      {t.goalLabel}: {formatTime(task.dailyGoal)}
                    </Typography>
                  )}
                </Box>

                <LinearProgress variant="determinate" value={getTaskProgress(task)} color={getProgressColor(getTaskProgress(task))} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default Statistics;
