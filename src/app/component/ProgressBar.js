"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarComponent() {
  return (
    <ProgressBar
      height="4px"
      color="#155dfc"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
