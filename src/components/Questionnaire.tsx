import React from "react";
import { useTranslation } from "react-i18next";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { DUMMY_QUESTIONS } from "../constants/DummyQuestions";

const Questionnaire: React.FC = () => {
  const { t } = useTranslation();

  const options = (translationKey: string) => {
    const optionsArray = t(translationKey, {
      returnObjects: true,
    }) as string[];

    return Array.isArray(optionsArray) ? optionsArray : [];
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <FormControl component="fieldset">
        {DUMMY_QUESTIONS.map((item) => (
          <div key={item.id}>
            <FormLabel component="legend">{t(item.en.question)}</FormLabel>
            <RadioGroup name="education">
              <>{console.log(options(`${item.id}_options`), 123)}</>
              {options(`${item.id}_options`).map(
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
          </div>
        ))}
      </FormControl>
    </div>
  );
};

export default Questionnaire;
