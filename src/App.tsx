import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "@mui/material";
import Questionnaire from "./components/Questionnaire";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const language = newValue === 0 ? "en" : newValue === 1 ? "et" : "ru";
    i18n.changeLanguage(language);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="English" />
          <Tab label="Estonian" />
          <Tab label="Russian" />
        </Tabs>
      </header>
      <Questionnaire />
    </div>
  );
};

export default App;
