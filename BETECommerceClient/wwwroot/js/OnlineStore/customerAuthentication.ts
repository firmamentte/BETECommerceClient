const checkOutSignUp = () => {

    showPopupFormProgressBar()

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

const checkOutSignIn = () => {

    showPopupFormProgressBar()

    fetch("/ApplicationUser/CheckOutSignIn").
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
    })
}

const submitCheckOutSignIn = () => {

    const _messageCustomerSignIn = clearErrorMessageDiv(document.querySelector("#messageCustomerSignIn"))

    validateSignIn(_messageCustomerSignIn)

    if (!isErrorMessageDivEmpty(_messageCustomerSignIn)) {
        return
    }

    toggleButtonProgressBar(document.querySelector("#navCustomerSignIn"), document.querySelector("#progressBarCustomerSignIn"))

    fetch("/ApplicationUser/CheckOutSignIn", postOptions(serialize(document.querySelector("#formCustomerSignIn")))).
    then(handleError).
    then(() => {
        window.location.assign("/OnlineStore/PurchaseOrderConfirmation")
    }).
    catch((error) => {
        showErrorPopupForm(error)
    })
}