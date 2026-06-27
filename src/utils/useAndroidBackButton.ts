import { useEffect, useRef } from "react";

export function useAndroidBack() {
  const pushState = () => {
    window.history.pushState({ isAppletLayer: true }, "");
  };
  return { pushState };
}
