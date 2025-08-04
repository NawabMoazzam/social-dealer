"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarComponent() {
  return (
    <ProgressBar
      height="2px"
      color="#4F46E5"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
