import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

import "../styles/LoginPage.css";
import "../styles/MobileStyles.css";
import "../styles/MobileEnhancements.css";

const LoginPage = ({ onLogin }) => {
  const { translations: t, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleStart = () => {
    onLogin("anonymous");
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="header-controls">
        <div className="controls">
          <button className="control-btn theme-toggle" onClick={toggleTheme} title={t.theme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <select onChange={(e) => setLanguage(e.target.value)} className="language-select">
            <option value="ukr">🇺🇦 UKR</option>
            <option value="en">🇺🇸 EN</option>
            <option value="ru">🇷🇺 RU</option>
          </select>
        </div>
      </div>

      <div className="login-container">
        <div className="login-content">
          <h1 className="title">{t.title}</h1>
          {t.subtitle && <h2 className="subtitle">{t.subtitle}</h2>}

          <div className="description">
            <p>{t.description}</p>
            <p className="features">{t.features}</p>
            <p className="action">{t.action}</p>
          </div>

          <div className="warning">
            <p>{t.warning}</p>
          </div>

          <div className="github-link">
            <a href="https://github.com/mykhaito/FAZAnote" target="_blank" rel="noopener noreferrer">
              {t.github}
            </a>
          </div>

          <div className="start-section">
            <button onClick={handleStart} className="start-btn">
              {t.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
