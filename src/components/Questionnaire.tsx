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
import ReactGA from "react-ga4";

type Language = "en" | "et" | "ru";

const Questionnaire: React.FC = () => {
  const { i18n } = useTranslation();
  const [showReport, setShowReport] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [recomendation, setRecomendation] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: any;
  }>({});

  const onQuestionnaireComplete = () => {
    ReactGA.event({
      category: "Questionnaire",
      action: "Complete",
      label: "Questionnaire Completion",
      value: 1,
    });
  };

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
    onQuestionnaireComplete();
    const scores = getScores(SCORING_DATA.scoring, selectedOptions);
    const userScores: any = {};
    scores.forEach((score: { [x: string]: any }) => {
      Object.keys(score)?.map((key) => {
        userScores[key] = (userScores[key] || 0) + score[key];
      });
    });

    console.log(userScores);
    setRecomendation(userScores);
    setShowReport(true);
  };

  useEffect(() => {
    if (i18n?.language) {
      setSelectedLanguage((i18n?.language as Language) || "en");
    }
  }, [i18n.language]);

  return (
    <div className="p-4 max-w-md mx-auto">
      {showReport ? (
        <div className="flex flex-col gap-4 justify-center items-center w-[400px]">
          <div className="p-4 bg-slate-200">
            <Typography variant="h6">Recomended Career Paths:</Typography>

            {Object.keys(recomendation)?.map((item: any, index: number) => (
              <Typography key={item}>
                {index + 1}.{" "}
                {
                  SCORING_DATA.careerPaths.find((cp) => cp.id === item)?.[
                    selectedLanguage || "en"
                  ]
                }
              </Typography>
            ))}
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowReport(false)}
          >
            Back
          </Button>
        </div>
      ) : (
        <>
          <FormControl component="fieldset">
            {DUMMY_QUESTIONS.map((item) => (
              <div key={item.id}>
                {item[selectedLanguage || "en"]?.options ? (
                  <>
                    <FormLabel component="legend">
                      {item[selectedLanguage || "en"]?.question}
                    </FormLabel>
                    <RadioGroup name="education">
                      {(item[selectedLanguage || "en"]?.options || []).map(
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
                      {item[selectedLanguage || "en"]?.question}
                    </FormLabel>
                    {item[selectedLanguage || "en"]?.pairs?.map((pair) => (
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
            <Button
              variant="contained"
              color="primary"
              onClick={calculateScore}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
