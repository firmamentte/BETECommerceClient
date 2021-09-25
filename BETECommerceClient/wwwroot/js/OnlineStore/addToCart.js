document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#Quantity").value = "";
});
var submitAddToCart = function () {
    var _messageAddToCart = clearErrorMessageDiv(document.querySelector("#messageAddToCart"));
    var _quantity = document.querySelector("#Quantity");
    if (!(!!_quantity.value.trim())) {
        appendErrorMessage(_messageAddToCart, "Quantity required");
    }
    else {
        if (isNaN(_quantity.value.trim())) {
            appendErrorMessage(_messageAddToCart, "Numeric Quantity required");
        }
        else {
            if (parseInt(_quantity.value.trim()) <= 0) {
                appendErrorMessage(_messageAddToCart, "Invalid Quantity");
            }
        }
    }
    if (!isErrorMessageDivEmpty(_messageAddToCart)) {
        return;
    }
    toggleButtonProgressBar(document.querySelector("#navAddToCart"), document.querySelector("#progressBarAddToCart"));
    fetch("/OnlineStore/AddToCart", postOptions(serialize(document.querySelector("#formAddToCart")))).
        then(handleError).
        then(jsonDataType).
        then(function (data) {
        window.location.replace(data.redirectToUrl);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var showItemImage = function (pictureControl) {
    showPopupFormProgressBar();
    fetch("/OnlineStore/ItemPicturePopup?picturePath=" + pictureControl.src).
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
//# sourceMappingURL=addToCart.js.map