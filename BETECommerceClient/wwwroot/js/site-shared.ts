const showErrorPopupForm = (error: string) => {

    fetch(`/Shared/Ok?okMessage=${error}&messageSymbol=x`).
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            console.log(error)
        })
}

const showMoreProgressBar = (moreIcon: HTMLDivElement, moreProgressBar: HTMLDivElement, moreError: HTMLDivElement) => {
    moreIcon.classList.add("hide-more-icon")
    moreProgressBar.classList.add("show-get-more-text")
    moreError.classList.remove("show-get-more-error")
}

const hideMoreProgressBar = (moreIcon: HTMLDivElement, moreProgressBar: HTMLDivElement, moreError: HTMLDivElement) => {
    moreIcon.classList.remove("hide-more-icon")
    moreProgressBar.classList.remove("show-get-more-text")
    moreError.classList.remove("show-get-more-error")
}

const hideMoreIcon = (moreIcon: HTMLDivElement, moreProgressBar: HTMLDivElement, moreError: HTMLDivElement) => {
    moreIcon.classList.add("hide-more-icon")
    moreError.classList.remove("show-get-more-error")
    moreProgressBar.classList.remove("show-get-more-text")
}

const showMoreError = (moreIcon: HTMLDivElement, moreProgressBar: HTMLDivElement, moreError: HTMLDivElement) => {
    moreIcon.classList.add("hide-more-icon")
    moreError.classList.add("show-get-more-error")
    moreProgressBar.classList.remove("show-get-more-text")
}

const index = () => {
    window.location.assign("/OnlineStore/Index")
}

const signOut = () => {
    window.location.assign("/ApplicationUser/UserSignOut")
}

const signUp = () => {

    toggleButtonProgressBar(document.querySelector("#navWelcome"), document.querySelector("#progressBarWelcome"))

    fetch("/ApplicationUser/SignUp",).
        then(handleError).
        then(htmlDataType).
        then((signUpResp) => {
            showPopupFormHtml(signUpResp)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const submitSignUp = () => {

    const _messageSignUp = clearErrorMessageDiv(document.querySelector("#messageSignUp"))

    validateSignUp(_messageSignUp);

    if (!isErrorMessageDivEmpty(_messageSignUp)) {
        return
    }

    toggleButtonProgressBar(document.querySelector("#navSignUp"), document.querySelector("#progressBarSignUp"))

    fetch("/ApplicationUser/SignUp", postOptions(serialize(document.querySelector("#formSignUp")))).
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

function validateSignIn(messageDiv: HTMLDivElement) {

    if (!(!!(<HTMLInputElement>document.querySelector("#EmailAddress")).value.trim())) {
        appendErrorMessage(messageDiv, "Email Address required")
    }

    if (!(!!(<HTMLInputElement>document.querySelector("#UserPassword")).value.trim())) {
        appendErrorMessage(messageDiv, "Password required")
    }
}

function validateSignUp(messageDiv: HTMLDivElement) {

    const _emailAddress: HTMLInputElement = document.querySelector("#EmailAddress")

    if (!(!!_emailAddress.value.trim())) {
        appendErrorMessage(messageDiv, "Email Address required")
    }
    else {
        if (!isValidEmailAddress(_emailAddress.value.trim())) {
            appendErrorMessage(messageDiv, "Invalid Email Address")
        }
    }

    if (!(!!(<HTMLInputElement>document.querySelector("#UserPassword")).value.trim())) {
        appendErrorMessage(messageDiv, "Password required")
    }
}