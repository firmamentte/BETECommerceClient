var checkOutSignUp = function () {
    showPopupFormProgressBar();
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
var checkOutSignIn = function () {
    showPopupFormProgressBar();
    fetch("/ApplicationUser/CheckOutSignIn").
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var submitCheckOutSignIn = function () {
    var _messageCustomerSignIn = clearErrorMessageDiv(document.querySelector("#messageCustomerSignIn"));
    validateSignIn(_messageCustomerSignIn);
    if (!isErrorMessageDivEmpty(_messageCustomerSignIn)) {
        return;
    }
    toggleButtonProgressBar(document.querySelector("#navCustomerSignIn"), document.querySelector("#progressBarCustomerSignIn"));
    fetch("/ApplicationUser/CheckOutSignIn", postOptions(serialize(document.querySelector("#formCustomerSignIn")))).
        then(handleError).
        then(function () {
        window.location.assign("/OnlineStore/PurchaseOrderConfirmation");
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
//# sourceMappingURL=customerAuthentication.js.map