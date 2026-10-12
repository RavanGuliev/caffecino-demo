// Telefonda titrəyiş.
// Android (Chrome, Samsung Internet): standart Vibration API.
// iPhone: Safari Vibration API-ni dəstəkləmir. iOS 18+ Safari-də <input type="checkbox" switch>
// elementinin dəyişməsi sistem haptikasını işə salır — bunu gizli element ilə istifadə edirik.

const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

let iosLabel = null;

function iosTap() {
  if (!iosLabel) {
    iosLabel = document.createElement("label");
    iosLabel.setAttribute("aria-hidden", "true");
    iosLabel.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    iosLabel.appendChild(input);
    document.body.appendChild(iosLabel);
  }
  iosLabel.click();
}

// strength: "light" (qızıl dən) | "heavy" (buz)
export function haptic(strength = "light") {
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(strength === "heavy" ? [70, 40, 110] : 15);
  } else if (isIOS()) {
    iosTap();
    if (strength === "heavy") setTimeout(iosTap, 110); // iki ardıcıl "tık" — daha güclü hiss
  }
}

export function disposeHaptics() {
  iosLabel?.remove();
  iosLabel = null;
}
