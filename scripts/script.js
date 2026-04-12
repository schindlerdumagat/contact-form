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

    const firstNameResult = validateName(firstName, firstNameInput, firstNameError);
    const lastNameResult = validateName(lastName, lastNameInput, lastNameError);
    const emailResult = validateEmail(email);
    const queryTypeResult = validateQueryType(queryType);
    const messageResult = validateMessage(message);
    const consentResult = validateConsent(consent);

    if (firstNameResult && lastNameResult && emailResult && 
        queryTypeResult && messageResult && consentResult) {
            showSuccessMessage();
            return;
        }
    
    focusFirstInputError();
    formState.hasAttemptedSubmit = true;
});

firstNameInput.addEventListener("input", (e) => {

    if (formState.hasAttemptedSubmit) {
        validateName(e.target.value, firstNameInput, firstNameError);
    }

})

lastNameInput.addEventListener("input", (e) => {

    if (formState.hasAttemptedSubmit) {
        validateName(e.target.value, lastNameInput, lastNameError);
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
            queryError.classList.remove("form__error--active")
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
            consentError.classList.remove("form__error--active");
        } else {
            consentError.textContent = "To submit this form, please consent to being contacted";
            consentError.classList.add("form__error--active");
        }
    }

});

// Displays the success message upon successful form submission
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
    form.reset();
    formState.hasAttemptedSubmit = false;
}

// This brings the user to the first error in the form
function focusFirstInputError() {

    const fields = [firstNameInput, lastNameInput, emailInput];

    for (const field of fields) {

        if(!field.validity.valid) {
            field.focus();
            return;
        }
    }

    if(!queryInputs[0].checked && !queryInputs[1].checked) {
        queryInputs[0].focus();
        return;
    }

    if(!messageInput.validity.valid) {
        messageInput.focus();
        return;
    }

    if (!consentInput.checked) {
        consentInput.focus({ focusVisible: true });
        return;
    }

}

function validateName(value, inputField, inputError) {
    
    const result = validations["isEmpty"](value);

    if (result) {
        inputError.textContent = result;
        inputField.classList.add("form__input--error");
        inputError.classList.add("form__error--active")
        return false;
    }

    inputError.textContent = "";
    inputField.classList.remove("form__input--error");
    inputError.classList.remove("form__error--active");
    
    return true;

}

function validateEmail(value) {

    const validationItems = ["isEmpty", "isEmail"];
    
    for (const item of validationItems) {
        const result = validations[item](value);
        if (result) {
            emailError.textContent = result;
            emailError.classList.add("form__error--active");
            emailInput.classList.add("form__input--error");
            return false;
        }
    }

    emailError.textContent = "";
    emailError.classList.remove("form__error--active");
    emailInput.classList.remove("form__input--error");

    return true;

}

function validateQueryType(value) {

    const result = validations["hasQueryValue"](value);

    if (result) {
        queryError.textContent = result;
        queryError.classList.add("form__error--active");
        return false;
    } else {
        queryError.textContent = "";
        queryError.classList.remove("form__error--active");
        return true;
    }

}

function validateMessage(value) {

    const validationItems = ["isEmpty", "isWithinRange"];
    
    for (const item of validationItems) {
        const result = validations[item](value);
        if (result) {
            messageError.textContent = result;
            messageError.classList.add("form__error--active");
            messageInput.classList.add("form__input--error");
            return false;
        }
    }

    messageError.textContent = "";
    messageError.classList.remove("form__error--active");
    messageInput.classList.remove("form__input--error");

    return true;

}

function validateConsent(value) {

    const result = validations["isChecked"](value);

    if (result) {
        consentError.textContent = result;
        consentError.classList.add("form__error--active");
        return false;
    } else {
        consentError.textContent = "";
        consentError.classList.remove("form__error--active");
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
