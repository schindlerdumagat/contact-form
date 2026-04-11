const form = document.querySelector(".form");
const firstNameField = document.querySelector(".form__first-name");
const lastNameField = document.querySelector(".form__last-name");
const emailField = document.querySelector(".form__email");
const queryField = document.querySelector(".form__query");
const messageField = document.querySelector(".form__message");
const consentField = document.querySelector(".form__consent");

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

    const firstNameResult = validateName(firstName, firstNameField, firstNameError, "form__first-name--error");
    const lastNameResult = validateName(lastName, lastNameField, lastNameError, "form__last-name--error");
    const emailResult = validateEmail(email);
    const queryTypeResult = validateQueryType(queryType);
    const messageResult = validateMessage(message);
    const consentResult = validateConsent(consent);

    formState.hasAttemptedSubmit = true;

    if (firstNameResult && lastNameResult && emailResult && 
        queryTypeResult && messageResult && consentResult) {
            showSuccessMessage();
            form.reset();
    }

});

firstNameInput.addEventListener("input", (e) => {

    if (formState.hasAttemptedSubmit) {
        validateName(e.target.value, firstNameField, firstNameError, "form__first-name--error");
    }

})

lastNameInput.addEventListener("input", (e) => {

    if (formState.hasAttemptedSubmit) {
        validateName(e.target.value, lastNameField, lastNameError, "form__last-name--error");
    }

})

emailInput.addEventListener("input", (e) => {

    if (formState.hasAttemptedSubmit) {
        validateEmail(e.target.value);
    }

})

queryInputs.forEach(queryInput => {
    queryInput.addEventListener("change", (e) => {

        if (e.target.checked) {
            queryError.textContent = "";
            queryField.classList.remove("form__query--error");
        }

    })
})

messageInput.addEventListener("input", (e) => {

    if (formState.hasAttemptedSubmit) {
        validateMessage(e.target.value);
    }

})

consentInput.addEventListener("change", (e) => {

    if (formState.hasAttemptedSubmit) {

        if(e.target.checked) {
            consentError.textContent = "";
            consentField.classList.remove("form__query--error");
        } else {
            consentError.textContent = "To submit this form, please consent to being contacted";
            consentField.classList.add("form__query--error");
        }
    }

});

function showSuccessMessage () {
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
}

function validateName(value, inputField, inputError, errorClass) {
    
    const result = validations["isEmpty"](value);

    if (result) {
        inputError.textContent = result;
        inputField.classList.add(errorClass);
        return false;
    }

    inputError.textContent = "";
    inputField.classList.remove(errorClass);
    
    return true;

}

function validateEmail(value) {

    const validationItems = ["isEmpty", "isEmail"];
    
    for (const item of validationItems) {
        const result = validations[item](value);
        if (result) {
            emailError.textContent = result;
            emailField.classList.add("form__email--error");
            emailInput.focus();
            return false;
        }
    }

    emailError.textContent = "";
    emailField.classList.remove("form__email--error");

    return true;

}

function validateQueryType(value) {

    const result = validations["hasQueryValue"](value);

    if (result) {
        queryError.textContent = result;
        queryField.classList.add("form__query--error");
        return false;
    } else {
        queryError.textContent = "";
        queryField.classList.remove("form__query--error");
        return true;
    }

}

function validateMessage(value) {

    const validationItems = ["isEmpty", "isWithinRange"];
    
    for (const item of validationItems) {
        const result = validations[item](value);
        if (result) {
            messageError.textContent = result;
            messageField.classList.add("form__message--error");
            return false;
        }
    }

    messageError.textContent = "";
    messageField.classList.remove("form__message--error");

    return true;

}

function validateConsent(value) {

    const result = validations["isChecked"](value);

    if (result) {
        consentError.textContent = result;
        consentField.classList.add("form__consent--error");
        return false;
    } else {
        consentError.textContent = "";
        consentField.classList.remove("form__consent--error");
        return true;
    }

}

const validations = {
    isEmpty: (value) => value.trim().length === 0 && "This field is required",
    isEmail: (value) => !validEmailRegex.test(value) && "Please enter a valid email address",
    hasQueryValue: (value) => !value && "Please select a query type",
    isWithinRange: (value) => value.trim().length < 15 && "Message must be minimum of 15 characters",
    isChecked: (value) => !value && "To submit this form, please consent to being contacted",
}
