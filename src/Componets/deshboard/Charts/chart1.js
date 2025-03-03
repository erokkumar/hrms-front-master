import React, { useState, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";
import clone from "clone";

export default function Chart1(){
  const [options, setOptions] = useState({
    background: { visible: false },
    label: {
        color: "white", // Set text color to white
        fontSize: 16, // Adjust size if needed
      },
    type: "radial-gauge",

    value: 85,
    scale: {
      min: 0,
      max: 100,
      label: {
        color: "white", // Ensures scale labels are also white
      },
    },
    cornerRadius: 99,
    cornerMode: "container",
    segmentation: {
      enabled: false,
      interval: {
        count: 4,
      },
      spacing: 2,
    },
  });

 

 

  return (
    <Fragment>
    
      <AgGauge options={options} />
    </Fragment>
  );
};

