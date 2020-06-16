interface Control {
  value: number | string;
  min?: number;
  max?: number;
  unit?: string;
}

export function control({ value, min, max, unit = "" }: Control): any | null {
  let fails: number = 0;
  let valid: boolean = null;
  let feedbacks: Array<string> = [];

  const valueEntered = value || (typeof value === "number" && value === 0);

  if (valueEntered) {
    if (typeof min === "number" || typeof max === "number") {
      let minMaxFeedback: string;

      if (typeof min === "number" && typeof max === "number") {
        minMaxFeedback = `${value} is outside range ${min}-${max}${unit}`;
      } else if (typeof min === "number") {
        minMaxFeedback = `${value} is less than minimum ${min}${unit}`;
      } else if (typeof max === "number") {
        minMaxFeedback = `${value} is greater than maximum ${max}${unit}`;
      }

      if (value < min || value > max) {
        fails += 1;
        feedbacks.push(minMaxFeedback);
      }

      if (fails === 0) {
        valid = true;
      } else {
        valid = false;
      }
    }
  }

  let feedback: string;

  feedbacks.forEach((string, index) => {
    if ((index = 1)) {
      feedback = string;
    } else if (index > 1) {
      feedback += ` ∙ ${string}`;
    }
  });

  return [valid, feedback];
}
