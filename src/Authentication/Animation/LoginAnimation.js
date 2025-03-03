import React from 'react'
import Lottie from "lottie-react";
import animationData from "./Animation - 1739769913852.json"
export default function LoginAnimation() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  )
}
