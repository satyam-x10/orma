import React from "react";
import "./EventDetailsProgress.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const EventDetailsProgress = ({ page, onPageNumberClick }: any) => {
  var stepPercentage = 0;
  if (page === "page1") {
    stepPercentage = 16;
  } else if (page === "page2") {
    stepPercentage = 33.33;
  } else if (page === "page3") {
    stepPercentage = 50;
  } else if (page === "page4") {
    stepPercentage = 66.66;
  } else if (page === "page5") {
    stepPercentage = 83.33;
  } else if (page === "page6") {
    stepPercentage = 100;
  } else {
    stepPercentage = 0;
  }

  return (
    <ProgressBar percent={stepPercentage}>
      {["", "", "", "", "", "", ""].map((index) => (
        <Step key={index}>
          {({ accomplished }: any) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : null}`}
              onClick={() => onPageNumberClick(index)}
            >
              {index}
            </div>
          )}
        </Step>
      ))}
    </ProgressBar>
  );
};

export default EventDetailsProgress;
