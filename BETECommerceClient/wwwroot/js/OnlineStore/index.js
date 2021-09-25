window.onload = function () {
    loadCartSummary();
};
window.onscroll = function (e) {
    e.preventDefault();
    toggleScrollTopButton();
    if (isInViewport(document.querySelector("#moreItemIcon")) && isVisible(document.querySelector("#moreItemIcon"))) {
        getMoreItems();
    }
};
document.addEventListener("DOMContentLoaded", function () {
    var _cartSummaries = document.querySelectorAll(".cart-summary");
    _cartSummaries.forEach(function (cartSummary) {
        cartSummary.addEventListener("click", function () {
            if (parseInt(removeWhiteSpaceAndComma(cartSummary.querySelector(".lblQuantity").textContent.trim())) > 0) {
                viewCart();
            }
        });
    });
});
var loadCartSummary = function () {
    fetch("/OnlineStore/CartSummary").
        then(handleError).
        then(jsonDataType).
        then(function (data) {
        document.querySelector(".cart-summary-popup .cart-label-qty .lblQuantity").textContent = data.quantity;
        document.querySelector(".cart-summary-popup .cart-label-sub-total .lblSubTotal").textContent = data.subTotal;
        showCartSummaryPopupButton();
    }).
        catch(function (error) {
        document.querySelector(".loader").classList.add("hide-loader");
        showErrorPopupForm(error);
    });
};
var viewCart = function () {
    showPopupFormProgressBar();
    fetch("/OnlineStore/ViewCart").
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var updateCartSummary = function () {
    fetch("/OnlineStore/CartSummary").
        then(handleError).
        then(jsonDataType).
        then(function (data) {
        document.querySelector(".cart-label-qty .lblQuantity").textContent = data.quantity(document.querySelector(".cart-label-sub-total .lblSubTotal")).textContent = data.subTotal;
        reCenterCartSummaryPopup();
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var updateCartItemQuantity = function (itemDetailId, quantity) {
    showPopupFormProgressBar();
    var _parameters = "itemDetailId=" + itemDetailId + "\n         &quantity=" + quantity;
    fetch("/OnlineStore/UpdateItemQuantity", postOptions(removeLineBreaks(_parameters))).
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        document.querySelector("#divLineItemGrid").innerHTML = data;
        updateCartSummary();
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var searchItem = function () {
    showPopupFormProgressBar();
    fetch("/OnlineStore/SearchItem").
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        document.querySelector("#popupFormToShow").innerHTML = data;
        var _hdItemDescription = document.querySelector("#hdItemDescription");
        var _itemDescription = document.querySelector("#ItemDescription");
        _itemDescription.value = _hdItemDescription.value;
        showPopupForm();
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var submitSearchItem = function () {
    toggleButtonProgressBar(document.querySelector("#navSearchItem"), document.querySelector("#progressBarSearchItem"));
    fetch("/OnlineStore/SearchItem", postOptions(serialize(document.querySelector("#formSearchItem")))).
        then(handleError).
        then(htmlDataType).
        then(function (dataItems) {
        reCenterCartSummaryPopup();
        disableImgContextMenu(document.querySelectorAll("#divMainItemGrid .item-body img"));
        document.querySelector("#divMainItemGrid .item-body").innerHTML = dataItems;
        var _hdItemDescription = document.querySelector("#hdItemDescription");
        var _itemDescription = document.querySelector("#ItemDescription");
        _hdItemDescription.value = _itemDescription.value;
        hidePopupForm();
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var getMoreItems = function () {
    showMoreProgressBar(document.querySelector("#moreItemIcon"), document.querySelector("#moreItemText"), document.querySelector("#moreItemError"));
    var _parameters = "?skip=" + document.querySelectorAll("#divMainItemGrid .item-body .item-grid .container .item").length;
    fetch("OnlineStore/GetMoreItemsByCriteria" + removeLineBreaks(_parameters)).
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        var _data = document.createElement("div");
        _data.innerHTML = data;
        if (!!_data.querySelector(".item")) {
            document.querySelector("#divMainItemGrid .item-body .item-grid .container").insertAdjacentHTML("beforeend", data);
            disableImgContextMenu(document.querySelectorAll("#divMainItemGrid .item-body .item-grid .container img"));
            hideMoreProgressBar(document.querySelector("#moreItemIcon"), document.querySelector("#moreItemText"), document.querySelector("#moreItemError"));
        }
        else {
            hideMoreIcon(document.querySelector("#moreItemIcon"), document.querySelector("#moreItemText"), document.querySelector("#moreItemError"));
        }
    }).
        catch(function (error) {
        showMoreError(document.querySelector("#moreItemIcon"), document.querySelector("#moreItemText"), document.querySelector("#moreItemError"));
    });
};
var buyItem = function (itemDetailId) {
    showPopupFormProgressBar();
    fetch("/OnlineStore/BuyNow", postOptions("itemDetailId=" + itemDetailId)).
        then(handleError).
        then(function () {
        window.location.assign("/OnlineStore/AddToCart");
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var customerAccount = function () {
    showPopupFormProgressBar();
    fetch("/Shared/CustomerAccount").
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var signIn = function () {
    toggleButtonProgressBar(document.querySelector("#navWelcome"), document.querySelector("#progressBarWelcome"));
    fetch("/ApplicationUser/SignIn").
        then(handleError).
        then(htmlDataType).
        then(function (data) {
        showPopupFormHtml(data);
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var submitSignIn = function () {
    var _messageSignIn = clearErrorMessageDiv(document.querySelector("#messageSignIn"));
    validateSignIn(_messageSignIn);
    if (!isErrorMessageDivEmpty(_messageSignIn)) {
        return;
    }
    toggleButtonProgressBar(document.querySelector("#navSignIn"), document.querySelector("#progressBarSignIn"));
    fetch("/ApplicationUser/SignIn", postOptions(serialize(document.querySelector("#formSignIn")))).
        then(handleError).
        then(function () {
        hidePopupForm();
    }).
        catch(function (error) {
        showErrorPopupForm(error);
    });
};
var checkOut = function () {
    window.location.assign("/OnlineStore/ShouldAuthenticateCustomer");
};
var showCartSummaryPopupButton = function () {
    var _cartSummaryPopup = document.querySelector(".cart-summary-popup");
    centerCartSummaryPopup(_cartSummaryPopup);
    _cartSummaryPopup.classList.add("show-cart-summary-popup");
};
function centerCartSummaryPopup(cartSummaryPopup) {
    if (!!cartSummaryPopup) {
        cartSummaryPopup.style.cssText = "top: 11px;right:0px;";
    }
}
//# sourceMappingURL=index.js.map