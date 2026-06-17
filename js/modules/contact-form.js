const formspreePlaceholder = "YOUR_FORM_ID";

function setFormState(form, statusElement, message, state) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (statusElement) {
    statusElement.textContent = message;
    statusElement.dataset.state = state;
  }

  if (submitButton) {
    submitButton.disabled = state === "sending";
    submitButton.textContent =
      state === "sending" ? "Sending..." : "Send Enquiry";
  }
}

export function initContactForm(form) {
  if (!form) return;

  const statusElement = form.querySelector("[data-contact-status]");
  const endpoint = form.getAttribute("action") || "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (endpoint.includes(formspreePlaceholder)) {
      setFormState(
        form,
        statusElement,
        "Formspree is not connected yet. Replace YOUR_FORM_ID with your Formspree form ID.",
        "error",
      );
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setFormState(form, statusElement, "Sending your enquiry...", "sending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setFormState(
        form,
        statusElement,
        "Thanks — your enquiry has been sent. Alt. will get back to you shortly.",
        "success",
      );
    } catch (error) {
      setFormState(
        form,
        statusElement,
        "Sorry, something went wrong. Please try again or email directly.",
        "error",
      );
    }
  });
}
