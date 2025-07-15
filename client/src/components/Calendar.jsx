import { useState, useMemo } from "react";
import { Box, Paper, Typography, IconButton, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight, Home, Star } from "@mui/icons-material";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { uk, enUS, ru } from "date-fns/locale";
import { useLanguage } from "../contexts/LanguageContext";

const getTaskProgress = (task) => {
  if (task.dailyGoal === 0) return 0;
  return Math.min((task.totalTimeSpent / task.dailyGoal) * 100, 100);
};

const getTaskMarkerType = (tasksForDay) => {
  if (!tasksForDay.length) return { type: "none" };

  const completed = tasksForDay.filter((t) => getTaskProgress(t) >= 100).length;
  const starred = tasksForDay.filter((t) => t.starred && getTaskProgress(t) >= 100).length;

  if (tasksForDay.length === 1 && getTaskProgress(tasksForDay[0]) >= 100 && tasksForDay[0].starred) {
    return { type: "star" };
  }
  if (completed === tasksForDay.length && starred > 0) {
    return { type: "star" };
  }
  if (completed === tasksForDay.length) {
    return { type: "circle", color: "#20c997" };
  }
  if (completed > 0) {
    return { type: "circle", color: "#ffc107" };
  }
  return { type: "circle", color: "#dc3545" };
};

const Calendar = ({ selectedDate, onDateSelect, tasks = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { language } = useLanguage();

  const getLocale = () => {
    switch (language) {
      case "en":
        return enUS;
      case "ru":
        return ru;
      default:
        return uk;
    }
  };

  const getUkrainianMonthName = (date) => {
    const months = ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"];
    return months[date.getMonth()];
  };

  const getRussianMonthName = (date) => {
    const months = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
    return months[date.getMonth()];
  };

  const getWeekDays = () => {
    switch (language) {
      case "en":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      case "ru":
        return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
      default:
        return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    }
  };

  const getWeekStart = () => {
    switch (language) {
      case "en":
        return 0;
      case "ru":
      case "ukr":
      default:
        return 1;
    }
  };

  const locale = getLocale();

  const calendarDays = useMemo(() => {
    const weekStart = getWeekStart();
    const start = startOfWeek(startOfMonth(currentMonth), { locale, weekStartsOn: weekStart });
    const end = endOfWeek(endOfMonth(currentMonth), { locale, weekStartsOn: weekStart });
    return eachDayOfInterval({ start, end });
  }, [currentMonth, locale]);

  const getTasksForDate = (date) => tasks.filter((task) => isSameDay(new Date(task.date), date));

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    onDateSelect(new Date());
  };

  const handleDayClick = (day) => {
    onDateSelect(day);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <Paper
      elevation={2}
      data-calendar="true"
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        pb: { xs: 2.5, sm: 3.5 },
        borderRadius: 2,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
        width: { xs: "100%", lg: "390px" },
        overflow: "visible",
        transform: { xs: "none", lg: "scale(1.25)" },
        transformOrigin: "top left",
        marginBottom: "16px",
        "&:hover": {
          transform: { xs: "translateY(-2px)", lg: "scale(1.25) translateY(-2px)" },
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <IconButton
          onClick={handlePrevMonth}
          size="large"
          title="Предыдущий месяц"
          sx={{
            zIndex: 10,
            position: "relative",
            color: "var(--text-primary)",
            "&:hover": {
              backgroundColor: "var(--bg-secondary)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            minWidth: "200px",
            textAlign: "center",
          }}
        >
          {(() => {
            const year = currentMonth.getFullYear();

            if (language === "ukr") {
              return `${getUkrainianMonthName(currentMonth)} ${year}`;
            } else if (language === "ru") {
              return `${getRussianMonthName(currentMonth)} ${year}`;
            } else {
              return format(currentMonth, "MMMM yyyy", { locale: locale });
            }
          })()}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={handleToday}
            size="large"
            title="Вернуться к сегодняшнему дню"
            sx={{
              zIndex: 10,
              position: "relative",
              color: "var(--text-primary)",
              "&:hover": {
                backgroundColor: "var(--bg-secondary)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Home />
          </IconButton>
          <IconButton
            onClick={handleNextMonth}
            size="large"
            title="Следующий месяц"
            sx={{
              zIndex: 10,
              position: "relative",
              color: "var(--text-primary)",
              "&:hover": {
                backgroundColor: "var(--bg-secondary)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
          mb: 1,
        }}
      >
        {getWeekDays().map((day) => (
          <Box
            key={day}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              align="center"
              sx={{
                fontWeight: 600,
                color: isMobile ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
          mb: 2,
        }}
      >
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const tasksForDay = getTasksForDate(day);
          const marker = getTaskMarkerType(tasksForDay);

          return (
            <Box
              key={index}
              sx={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                onClick={() => handleDayClick(day)}
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  cursor: "pointer",
                  position: "relative",
                  backgroundColor: isSelected ? "var(--accent-color)" : isCurrentDay ? "rgba(0, 123, 255, 0.15)" : "transparent",
                  color: isMobile ? "var(--text-primary)" : isSelected ? "white" : isCurrentDay ? "var(--accent-color)" : isCurrentMonth ? "var(--text-primary)" : "var(--text-secondary)",
                  opacity: isCurrentMonth ? 1 : 0.4,
                  border: isCurrentDay ? "2px solid var(--accent-color)" : "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1,
                  "&:hover": {
                    backgroundColor: isSelected ? "var(--accent-hover)" : "var(--bg-secondary)",
                  },
                  transition: "all 0.15s ease",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrentDay ? 600 : isSelected ? 600 : 400,
                    fontSize: "inherit",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    color: isMobile ? "var(--text-primary)" : undefined,
                  }}
                >
                  {format(day, "d")}
                </Typography>
                {tasksForDay.length > 0 &&
                  (() => {
                    if (marker.type === "star") {
                      return (
                        <Star
                          sx={{
                            position: "absolute",
                            left: "50%",
                            bottom: 1,
                            transform: "translateX(-50%)",
                            fontSize: 12,
                            color: "#FFD700",
                            zIndex: 2,
                          }}
                        />
                      );
                    }
                    if (marker.type === "circle") {
                      return (
                        <Box
                          className="marker"
                          sx={{
                            position: "absolute",
                            left: "50%",
                            bottom: 2,
                            transform: "translateX(-50%)",
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            backgroundColor: marker.color,
                            zIndex: 1,
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default Calendar;
