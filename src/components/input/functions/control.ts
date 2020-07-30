interface Control {
  value: number | string;
  min?: number;
  max?: number;
  unit?: string;
  disabled?: boolean;
  readOnly?: boolean;
  feedback?: string;
}

export function control({
  value,
  min,
  max,
  unit = "",
  disabled,
  readOnly,
  feedback
}: Control): any | null {
  let fails: number = 0;
  let valid: boolean | null = null;
  let feedbacks: Array<string> = [];

  const valueEntered = value || (typeof value === "number" && value === 0);

  if (valueEntered && !disabled && !readOnly) {
    if (typeof min === "number" || typeof max === "number") {
      let minMaxFeedback: string = "";

      if (typeof min === "number" && typeof max === "number") {
        minMaxFeedback = `${value}${unit} is outside range ${min}-${max}${unit}`;
      } else if (typeof min === "number") {
        minMaxFeedback = `${value}${unit} is less than minimum ${min}${unit}`;
      } else if (typeof max === "number") {
        minMaxFeedback = `${value}${unit} is greater than maximum ${max}${unit}`;
      }

      if ((min && value < min) || (max && value > max)) {
        fails += 1;
        feedbacks.push(minMaxFeedback);
      }
    }

    if ([69, "69", "tiss", "bæsj", "promp"].includes(value)) {
      valid = true;
      feedbacks.push("Tihi 😉");
    }

    if (fails === 0) {
      // valid = true;
    } else {
      valid = false;
    }
  }

  let combinedFeedback: string | null = null;

  feedbacks.forEach((string, index) => {
    if ((index = 1)) {
      combinedFeedback = string;
    } else if (index > 1) {
      combinedFeedback += ` ∙ ${string}`;
    }
  });

  return [valid, combinedFeedback];
}
