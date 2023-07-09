import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { TextSection } from "../../../../types";
import { SourcesArrowLeft, SourcesArrowRight } from "./MessageSources.styled";

interface MessageSourcesProps {
  textSections?: TextSection[];
}

export const MessageSources: React.FC<MessageSourcesProps> = ({
  textSections,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const maxSteps = textSections?.length || 0;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const toggleSources = () => {
    setShowSources(!showSources);
  };

  return (
    <>
      <Box sx={{ marginTop: "0.5rem" }}>
        {textSections && textSections.length > 0 && (
          <Box sx={{ marginTop: "0.75rem" }}>
            <Box
              sx={{
                fontSize: "0.875rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#272727",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={toggleSources}
            >
              Sources
              {showSources ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Box>
            {showSources && (
              <>
                <Box
                  sx={{
                    fontSize: "0.875rem",
                    color: "#272727",
                    marginBottom: "1rem",
                  }}
                >
                  {textSections[activeStep].text}
                </Box>
                <Typography variant={"caption"} component="div">
                  From "{textSections[activeStep].sources.name}"
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    lineHeight: 1.25,
                  }}
                >
                  <Button
                    sx={{
                      padding: 0,
                      minWidth: "auto",
                      color: activeStep === 0 ? "" : "#272727",
                    }}
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    <SourcesArrowLeft />
                  </Button>
                  <Box sx={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                    {activeStep + 1}/{maxSteps}
                  </Box>
                  <Button
                    sx={{
                      padding: 0,
                      minWidth: "auto",
                      color: activeStep === maxSteps - 1 ? "" : "#272727",
                    }}
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >
                    <SourcesArrowRight />
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};
