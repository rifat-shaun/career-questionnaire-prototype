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
import { SCORING_DATA } from "../constants/ScroingData";

type Language = "en" | "et" | "ru";

const Questionnaire: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: any;
  }>({});

  const handleSelect = (id: string, choice: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: choice }));
  };

  const getScores = (scoreObj: any, userAnswer: any) => {
    const scores: any = [];
    Object.keys(userAnswer)?.forEach((item: string) => {
      if (typeof userAnswer[item] === "object") {
        const innerScores = getScores(scoreObj[item], userAnswer[item]);
        scores.push(...innerScores);
      } else {
        const val: any = scoreObj[item][userAnswer[item]];
        scores.push(val);
      }
    });

    return scores;
  };

  const calculateScore = () => {
    const scores = getScores(SCORING_DATA.scoring, selectedOptions);
    const userScores: any = {};
    scores.forEach((score: { [x: string]: any }) => {
      Object.keys(score)?.map((key) => {
        userScores[key] = (userScores[key] || 0) + score[key];
      });
    });

    let maxKey: any = null;
    let maxValue = -Infinity;

    for (const key in userScores) {
      if (userScores[key] > maxValue) {
        maxKey = key;
        maxValue = userScores[key];
      }
    }

    const highestScoreCareer: any = SCORING_DATA.careerPaths.find(
      (item) => item.id === maxKey
    );

    console.log(highestScoreCareer[selectedLanguage]);
  };

  useEffect(() => {
    if (i18n?.language) {
      setSelectedLanguage((i18n?.language as Language) || "en");
    }
  }, [i18n.language]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <FormControl component="fieldset">
        {DUMMY_QUESTIONS.map((item) => (
          <div key={item.id}>
            {item[selectedLanguage]?.options ? (
              <>
                <FormLabel component="legend">
                  {item[selectedLanguage]?.question}
                </FormLabel>
                <RadioGroup name="education">
                  {(item[selectedLanguage]?.options || []).map(
                    (option: string, index: number) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                        onChange={(e) =>
                          handleSelect(
                            item.id,
                            (e.target as HTMLInputElement).value
                          )
                        }
                      />
                    )
                  )}
                </RadioGroup>
              </>
            ) : (
              <>
                <FormLabel component="legend">
                  {item[selectedLanguage]?.question}
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
                          selectedOptions?.[item.id]?.[pair.id] === "a"
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          handleSelect(item.id, {
                            ...selectedOptions[item.id],
                            [pair.id]: "a",
                          })
                        }
                      >
                        {pair.a}
                      </Button>
                      <Button
                        variant={
                          selectedOptions?.[item.id]?.[pair.id] === "b"
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          handleSelect(item.id, {
                            ...selectedOptions[item.id],
                            [pair.id]: "b",
                          })
                        }
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
      <div className="mt-4 flex items-center justify-center">
        <Button variant="contained" color="primary" onClick={calculateScore}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
