import "./main.scss";
import type { FormData, FormElements } from "./ts/types";
import { validateForm, validateField } from "./ts/validation";
import { sendPremiumRequest } from "./ts/telegram";

// ==============================================
// DOM ELEMENTS
// ==============================================

function getFormElements(): FormElements {
  const form = document.getElementById("premiumForm") as HTMLFormElement;
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
  const statusDiv = document.getElementById("statusMessage") as HTMLElement;

  if (!form || !submitBtn || !statusDiv) {
    throw new Error("Required form elements not found");
  }

  return {
    form,
    submitBtn,
    statusDiv,
    inputs: {
      fullName: document.getElementById("fullName") as HTMLInputElement,
      phone: document.getElementById("phone") as HTMLInputElement,
      school: document.getElementById("school") as HTMLInputElement,
    },
    errors: {
      fullName: document.getElementById("fullNameError") as HTMLElement,
      phone: document.getElementById("phoneError") as HTMLElement,
      school: document.getElementById("schoolError") as HTMLElement,
    },
  };
}

// ==============================================
// UI HELPERS
// ==============================================

function showFieldError(
  input: HTMLInputElement,
  errorEl: HTMLElement,
  message: string
): void {
  input.classList.add("form-input--error");

  // Clear previous content
  errorEl.innerHTML = "";

  // Create SVG icon safely
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");

  const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.setAttribute("x1", "12");
  line1.setAttribute("y1", "8");
  line1.setAttribute("x2", "12");
  line1.setAttribute("y2", "12");

  const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line2.setAttribute("x1", "12");
  line2.setAttribute("y1", "16");
  line2.setAttribute("x2", "12.01");
  line2.setAttribute("y2", "16");

  svg.appendChild(circle);
  svg.appendChild(line1);
  svg.appendChild(line2);

  // Add message as text content (safe from XSS)
  const messageSpan = document.createElement("span");
  messageSpan.textContent = message;

  errorEl.appendChild(svg);
  errorEl.appendChild(messageSpan);
}

function clearFieldError(input: HTMLInputElement, errorEl: HTMLElement): void {
  input.classList.remove("form-input--error");
  errorEl.innerHTML = "";
}

function showStatus(
  statusDiv: HTMLElement,
  type: "success" | "error",
  message: string
): void {
  statusDiv.className = `status status--visible status--${type}`;

  // Clear previous content
  statusDiv.innerHTML = "";

  // Create SVG icon safely
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");

  if (type === "success") {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("d", "M5 13l4 4L19 7");
    svg.appendChild(path);
  } else {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "10");

    const line1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line1.setAttribute("x1", "12");
    line1.setAttribute("y1", "8");
    line1.setAttribute("x2", "12");
    line1.setAttribute("y2", "12");

    const line2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line2.setAttribute("x1", "12");
    line2.setAttribute("y1", "16");
    line2.setAttribute("x2", "12.01");
    line2.setAttribute("y2", "16");

    svg.appendChild(circle);
    svg.appendChild(line1);
    svg.appendChild(line2);
  }

  // Add message as text content (safe from XSS)
  const messageSpan = document.createElement("span");
  messageSpan.textContent = message;

  statusDiv.appendChild(svg);
  statusDiv.appendChild(messageSpan);
}

function hideStatus(statusDiv: HTMLElement): void {
  statusDiv.className = "status";
}

function setButtonLoading(btn: HTMLButtonElement, loading: boolean): void {
  btn.disabled = loading;
  btn.classList.toggle("submit-btn--loading", loading);
}

function getFormData(inputs: FormElements["inputs"]): FormData {
  return {
    fullName: inputs.fullName.value.trim(),
    phone: inputs.phone.value.trim(),
    school: inputs.school.value.trim(),
  };
}

function resetForm(elements: FormElements): void {
  elements.form.reset();

  // Clear all errors
  (Object.keys(elements.inputs) as Array<keyof FormElements["inputs"]>).forEach(
    (key) => {
      clearFieldError(elements.inputs[key], elements.errors[key]);
    }
  );
}

// ==============================================
// EVENT HANDLERS
// ==============================================

function handleFieldBlur(
  field: keyof FormData,
  input: HTMLInputElement,
  errorEl: HTMLElement
): void {
  const error = validateField(field, input.value);

  if (error) {
    showFieldError(input, errorEl, error);
  } else {
    clearFieldError(input, errorEl);
  }
}

async function handleSubmit(
  event: Event,
  elements: FormElements
): Promise<void> {
  event.preventDefault();

  const { submitBtn, statusDiv, inputs, errors } = elements;

  // Hide previous status
  hideStatus(statusDiv);

  // Get form data
  const data = getFormData(inputs);

  // Validate
  const validation = validateForm(data);

  // Clear previous errors
  (Object.keys(inputs) as Array<keyof FormElements["inputs"]>).forEach(
    (key) => {
      clearFieldError(inputs[key], errors[key]);
    }
  );

  // Show validation errors
  if (!validation.isValid) {
    validation.errors.forEach(({ field, message }) => {
      showFieldError(inputs[field], errors[field], message);
    });

    // Focus first error field
    const firstErrorField = validation.errors[0]?.field;
    if (firstErrorField) {
      inputs[firstErrorField].focus();
    }

    return;
  }

  // Submit form
  setButtonLoading(submitBtn, true);

  try {
    const result = await sendPremiumRequest(data);

    if (result.success) {
      showStatus(
        statusDiv,
        "success",
        "Request submitted! We'll contact you soon."
      );
      resetForm(elements);
    } else {
      showStatus(statusDiv, "error", result.message);
    }
  } catch (error) {
    console.error("Submit error:", error);
    showStatus(
      statusDiv,
      "error",
      "An unexpected error occurred. Please try again."
    );
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// ==============================================
// INITIALIZATION
// ==============================================

function init(): void {
  try {
    const elements = getFormElements();

    // Add blur validation to each field
    (
      Object.keys(elements.inputs) as Array<keyof FormElements["inputs"]>
    ).forEach((key) => {
      const input = elements.inputs[key];
      const errorEl = elements.errors[key];

      // Validate on blur (when user leaves field)
      input.addEventListener("blur", () => {
        handleFieldBlur(key, input, errorEl);
      });

      // Clear error when user starts typing
      input.addEventListener("input", () => {
        if (input.classList.contains("form-input--error")) {
          clearFieldError(input, errorEl);
        }
      });
    });

    // Handle form submission
    elements.form.addEventListener("submit", (e) => handleSubmit(e, elements));

    console.log("✓ Premium form initialized");
  } catch (error) {
    console.error("Failed to initialize form:", error);
  }
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", init);
