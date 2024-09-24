import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  Typography,
  Button,
} from "@mui/material";
import { DUMMY_QUESTIONS } from "../constants/DummyQuestions";

type Language = "en" | "et" | "ru";

const Questionnaire: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  const handleSelect = (id: string, choice: "a" | "b") => {
    setSelectedOptions((prev) => ({ ...prev, [id]: choice }));
  };

  useEffect(() => {
    setSelectedLanguage((i18n?.language as Language) || "en");
  }, [i18n.language]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <FormControl component="fieldset">
        {DUMMY_QUESTIONS.map((item) => (
          <div key={item.id}>
            {item[selectedLanguage]?.options ? (
              <>
                <FormLabel component="legend">
                  {t(item[selectedLanguage].question)}
                </FormLabel>
                <RadioGroup name="education">
                  {(item[selectedLanguage]?.options || []).map(
                    (option: string, index: number) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    )
                  )}
                </RadioGroup>
              </>
            ) : (
              <>
                <FormLabel component="legend">
                  {t(item[selectedLanguage].question)}
                </FormLabel>
                {item[selectedLanguage]?.pairs?.map((pair) => (
                  <Card
                    key={pair.id}
                    className="mb-4 p-4 w-full max-w-md gap-2"
                  >
                    <Typography>
                      {pair.a} vs {pair.b}
                    </Typography>
                    <div className="flex justify-around mt-4 gap-2">
                      <Button
                        variant={
                          selectedOptions[pair.id] === "a"
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => handleSelect(pair.id, "a")}
                      >
                        {pair.a}
                      </Button>
                      <Button
                        variant={
                          selectedOptions[pair.id] === "b"
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => handleSelect(pair.id, "b")}
                      >
                        {pair.b}
                      </Button>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        ))}
      </FormControl>
    </div>
  );
};

export default Questionnaire;
