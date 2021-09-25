document.addEventListener("DOMContentLoaded", () => {
    (<HTMLInputElement>document.querySelector("#Quantity")).value = ""
})

const submitAddToCart = () => {

    const _messageAddToCart = clearErrorMessageDiv(document.querySelector("#messageAddToCart"))

    const _quantity = <HTMLInputElement>document.querySelector("#Quantity")
    if (!(!!_quantity.value.trim())) {
        appendErrorMessage(_messageAddToCart, "Quantity required")
    }
    else {
        if (isNaN(_quantity.value.trim() as unknown as number)) {
            appendErrorMessage(_messageAddToCart, "Numeric Quantity required")
        }
        else {
            if (parseInt(_quantity.value.trim()) <= 0) {
                appendErrorMessage(_messageAddToCart, "Invalid Quantity")
            }
        }
    }

    if (!isErrorMessageDivEmpty(_messageAddToCart)) {
        return
    }

    toggleButtonProgressBar(document.querySelector("#navAddToCart"), document.querySelector("#progressBarAddToCart"))

    fetch("/OnlineStore/AddToCart", postOptions(serialize(document.querySelector("#formAddToCart")))).
        then(handleError).
        then(jsonDataType).
        then((data) => {
            window.location.replace(data.redirectToUrl)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

var showItemImage = function (pictureControl: HTMLImageElement) {

    showPopupFormProgressBar()

    fetch(`/OnlineStore/ItemPicturePopup?picturePath=${pictureControl.src}`).
        then(handleError).
        then(htmlDataType).
        then(function (data) {
            showPopupFormHtml(data);
        }).
        catch(function (error) {
            showErrorPopupForm(error);
        });
};