var showErrorPopupForm = function (error) {
    fetch("/Shared/Ok?okMessage=" + error + "&messageSymbol=x").
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        console.log(error);
    });
};
var showMoreProgressBar = function (moreIcon, moreProgressBar, moreError) {
    moreIcon.classList.add("hide-more-icon");
    moreProgressBar.classList.add("show-get-more-text");
    moreError.classList.remove("show-get-more-error");
};
var hideMoreProgressBar = function (moreIcon, moreProgressBar, moreError) {
    moreIcon.classList.remove("hide-more-icon");
    moreProgressBar.classList.remove("show-get-more-text");
    moreError.classList.remove("show-get-more-error");
};
var hideMoreIcon = function (moreIcon, moreProgressBar, moreError) {
    moreIcon.classList.add("hide-more-icon");
    moreError.classList.remove("show-get-more-error");
    moreProgressBar.classList.remove("show-get-more-text");
};
var showMoreError = function (moreIcon, moreProgressBar, moreError) {
    moreIcon.classList.add("hide-more-icon");
    moreError.classList.add("show-get-more-error");
    moreProgressBar.classList.remove("show-get-more-text");
};
var index = function () {
    window.location.assign("/OnlineStore/Index");
};
var signOut = function () {
    window.location.assign("/ApplicationUser/UserSignOut");
};
var signUp = function () {
    toggleButtonProgressBar(document.querySelector("#navWelcome"), document.querySelector("#progressBarWelcome"));
    fetch("/ApplicationUser/SignUp").
        then(handleError).
        then(htmlDataType).
        then(function (signUpResp) {
        showPopupFormHtml(signUpResp);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var submitSignUp = function () {
    var _messageSignUp = clearErrorMessageDiv(document.querySelector("#messageSignUp"));
    validateSignUp(_messageSignUp);
    if (!isErrorMessageDivEmpty(_messageSignUp)) {
        return;
    }
    toggleButtonProgressBar(document.querySelector("#navSignUp"), document.querySelector("#progressBarSignUp"));
    fetch("/ApplicationUser/SignUp", postOptions(serialize(document.querySelector("#formSignUp")))).
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
function validateSignIn(messageDiv) {
    if (!(!!document.querySelector("#EmailAddress").value.trim())) {
        appendErrorMessage(messageDiv, "Email Address required");
    }
    if (!(!!document.querySelector("#UserPassword").value.trim())) {
        appendErrorMessage(messageDiv, "Password required");
    }
}
function validateSignUp(messageDiv) {
    var _emailAddress = document.querySelector("#EmailAddress");
    if (!(!!_emailAddress.value.trim())) {
        appendErrorMessage(messageDiv, "Email Address required");
    }
    else {
        if (!isValidEmailAddress(_emailAddress.value.trim())) {
            appendErrorMessage(messageDiv, "Invalid Email Address");
        }
    }
    if (!(!!document.querySelector("#UserPassword").value.trim())) {
        appendErrorMessage(messageDiv, "Password required");
    }
}
//# sourceMappingURL=site-shared.js.map