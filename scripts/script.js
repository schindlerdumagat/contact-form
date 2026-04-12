const form = document.querySelector(".form");

// Input Elements
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const queryInputs = document.querySelectorAll(".form__query-input");
const messageInput = document.querySelector("#message");
const consentInput = document.querySelector("#consent");

// Error Elements
const firstNameError = document.querySelector("#first-name-error");
const lastNameError = document.querySelector("#last-name-error");
const emailError = document.querySelector("#email-error");
const queryError = document.querySelector("#query-error");
const messageError = document.querySelector("#message-error");
const consentError = document.querySelector("#consent-error");

const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const formState = {
    hasAttemptedSubmit: false,
}

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const { firstName, lastName, email, queryType, message, consent } = data;

    // Validates each values
    const firstNameResult = validateName(firstName.trim(), firstNameInput, firstNameError);
    const lastNameResult = validateName(lastName.trim(), lastNameInput, lastNameError);
    const emailResult = validateEmail(email.trim());
    const queryTypeResult = validateQueryType(queryType);
    const messageResult = validateMessage(message.trim());
    const consentResult = validateConsent(consent); 

    // Checks if all fields are valid
    const allValid = firstNameResult && lastNameResult && emailResult && queryTypeResult && messageResult && consentResult;
    if (allValid) {
            showSuccessMessage();
            return;
        }
    
    // If form has error, focus will go to the first input with error
    const formResult = {
        firstName: firstNameResult,
        lastName: lastNameResult,
        email: emailResult,
        queryType: queryTypeResult,
        message: messageResult,
        consent: consentResult,
    };

    focusFirstInputError(formResult);
    formState.hasAttemptedSubmit = true;
});

firstNameInput.addEventListener("input", (e) => {

    if (!formState.hasAttemptedSubmit) return;
    validateName(e.target.value.trim(), firstNameInput, firstNameError);

});

lastNameInput.addEventListener("input", (e) => {

    if (!formState.hasAttemptedSubmit) return;
    validateName(e.target.value.trim(), lastNameInput, lastNameError);

});

emailInput.addEventListener("input", (e) => {

    if (!formState.hasAttemptedSubmit) return;
    validateEmail(e.target.value.trim());

});

messageInput.addEventListener("input", (e) => {

    if (!formState.hasAttemptedSubmit) return;
    validateMessage(e.target.value.trim());
    
});

queryInputs.forEach(queryInput => {
    queryInput.addEventListener("change", (e) => {
        handleSelectionEvent(e, queryError, "Please select a query type");
    })
})

consentInput.addEventListener("change", (e) => {
    handleSelectionEvent(e, consentError, "To submit this form, please consent to being contacted");

});

function handleSelectionEvent(e, error, errorMessage) {

    if (!formState.hasAttemptedSubmit) return;

    if(e.target.checked) {
        error.textContent = "";
        error.classList.remove("form__error--active");
    } else {
        error.textContent = errorMessage;
        error.classList.add("form__error--active");
    }
}

function validateName(value, input, error) {
    
    const validationItems = ["isEmpty"];
    const isValid = checkTextField(input, error, validations, validationItems, value);

    return isValid;

}

function validateEmail(value) {

    const validationItems = ["isEmpty", "isEmail"];
    const isValid = checkTextField(emailInput, emailError, validations, validationItems, value);

    return isValid;

}

function validateMessage(value) {

    const validationItems = ["isEmpty", "isWithinRange"];
    const isValid = checkTextField(messageInput, messageError, validations, validationItems, value);

    return isValid;

}

function validateQueryType(value) {

    const validationItems = ["hasQueryValue"];
    const isValid = checkSelectionField(value, validations, validationItems, queryError);
    return isValid;

}

function validateConsent(value) {

    const validationItems = ["isChecked"];
    const isValid = checkSelectionField(value, validations, validationItems, consentError);
    return isValid;

}

// Checks the validity of text fields against the validations requirements
function checkTextField(input, error, validations, validationItems, value) {

    const updateErrorUIFunc = (isValid, result) => updateTextFieldError(isValid, input, error, result);
    const isValid = runFieldChecks(value, validations, validationItems, updateErrorUIFunc);
    return isValid;
}

// Checks the validity of selection fields against the validations requirements
function checkSelectionField(value, validations, validationItems, error) {

    const updateErrorUIFunc = (isValid, result) => updateSelectionFieldError(isValid, error, result);
    const isValid = runFieldChecks(value, validations, validationItems, updateErrorUIFunc);
    return isValid;
}

function runFieldChecks(value, validations, validationItems, updateErrorUIFunc) {
    let isValid = false;

    for(const item of validationItems) {
        const result = validations[item](value);
        isValid = !result;

        updateErrorUIFunc(isValid, result);
        if (!isValid) {
            break;
        }
    }

    return isValid;
}

// Updates the error states (input classes and error messages) of text fields.
function updateTextFieldError(isValid, input, error, result) {

    if (isValid) {
        error.textContent = "";
        error.classList.remove("form__error--active");
        input.classList.remove("form__input--error");
    } else {
        error.textContent = result;
        error.classList.add("form__error--active");
        input.classList.add("form__input--error");
    }

}

function updateSelectionFieldError(isValid, error, result) {

    if(isValid) {
        error.textContent = "";
        error.classList.remove("form__error--active");
    } else {
        error.textContent = result;
        error.classList.add("form__error--active");
    }

}

// Displays the success message upon successful form submission
function showSuccessMessage () {

    // Removes the existing success message when filling out forms again
    const existingSuccessMessage = document.querySelector(".toast");
    if(existingSuccessMessage) {
        existingSuccessMessage.remove();
    }

    const toastElementString = `
        <div class="toast">
            <div class="toast__header">
                <img src="./assets/images/icon-success-check.svg" alt="" width="20" height="20">
                <strong class="toast__title">Message Sent!</strong>
            </div>
            <p class="toast__message">Thanks for completing the form. We’ll be in touch soon!</p>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", toastElementString);

    // Resets the form to its original state
    form.reset();
    formState.hasAttemptedSubmit = false;
}

// This brings the user to the first input field with error in the form.
// Prioritizes errors at the very top.
function focusFirstInputError(formResult) {

    const {firstName, lastName, email, queryType, message, consent} = formResult;

    if (!firstName) {
        firstNameInput.focus();
    } else if (!lastName) {
        lastNameInput.focus();
    } else if (!email) {
        emailInput.focus();
    } else if (!queryType) {
        queryInputs[0].focus();
    } else if (!message) {
        messageInput.focus();
    } else if (!consent) {
        consentInput.focus({ focusVisible: true });
    }

}

// List of all the validations that can be performed
const validations = {
    isEmpty: (value) => value.trim().length === 0 && "This field is required",
    isEmail: (value) => !validEmailRegex.test(value) && "Please enter a valid email address",
    hasQueryValue: (value) => !value && "Please select a query type",
    isWithinRange: (value) => value.trim().length < 15 && "Message must be minimum of 15 characters",
    isChecked: (value) => !value && "To submit this form, please consent to being contacted",
}
