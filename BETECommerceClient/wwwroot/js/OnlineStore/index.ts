window.onload = () => {
    loadCartSummary()
}

window.onscroll = (e: Event) => {

    e.preventDefault()

    toggleScrollTopButton()

    if (isInViewport(document.querySelector("#moreItemIcon")) && isVisible(document.querySelector("#moreItemIcon"))) {
        getMoreItems()
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const _cartSummaries = document.querySelectorAll(".cart-summary")

    _cartSummaries.forEach((cartSummary) => {

        cartSummary.addEventListener("click", () => {

            if (parseInt(removeWhiteSpaceAndComma(cartSummary.querySelector(".lblQuantity").textContent.trim())) > 0) {
                viewCart()
            }
        })
    })
})

const loadCartSummary = () => {

    fetch("/OnlineStore/CartSummary").
        then(handleError).
        then(jsonDataType).
        then((data) => {

            document.querySelector(".cart-summary-popup .cart-label-qty .lblQuantity").textContent = data.quantity
            document.querySelector(".cart-summary-popup .cart-label-sub-total .lblSubTotal").textContent = data.subTotal

            showCartSummaryPopupButton()
        }).
        catch((error) => {
            document.querySelector(".loader").classList.add("hide-loader")

            showErrorPopupForm(error)
        })
}

const viewCart = () => {

    showPopupFormProgressBar()

    fetch("/OnlineStore/ViewCart").
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
    })
}

const updateCartSummary = () => {

    fetch("/OnlineStore/CartSummary").
        then(handleError).
        then(jsonDataType).
        then((data) => {
            
            (<HTMLLabelElement>document.querySelector(".cart-label-qty .lblQuantity")).textContent = data.quantity
            (<HTMLLabelElement>document.querySelector(".cart-label-sub-total .lblSubTotal")).textContent = data.subTotal

            reCenterCartSummaryPopup()
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const updateCartItemQuantity = (itemDetailId: string, quantity: number) => {

    showPopupFormProgressBar()

    const _parameters =
        `itemDetailId=${itemDetailId}
         &quantity=${quantity}`

    fetch("/OnlineStore/UpdateItemQuantity", postOptions(removeLineBreaks(_parameters))).
        then(handleError).
        then(htmlDataType).
        then((data) => {

            document.querySelector("#divLineItemGrid").innerHTML = data

            updateCartSummary();
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const searchItem = () => {

    showPopupFormProgressBar()

    fetch("/OnlineStore/SearchItem").
        then(handleError).
        then(htmlDataType).
        then((data) => {

            document.querySelector("#popupFormToShow").innerHTML = data

            let _hdItemDescription = <HTMLInputElement>document.querySelector("#hdItemDescription")
            let _itemDescription = <HTMLInputElement>document.querySelector("#ItemDescription")

            _itemDescription.value = _hdItemDescription.value

            showPopupForm()
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const submitSearchItem = () => {

    toggleButtonProgressBar(document.querySelector("#navSearchItem"), document.querySelector("#progressBarSearchItem"))

    fetch("/OnlineStore/SearchItem", postOptions(serialize(document.querySelector("#formSearchItem")))).
        then(handleError).
        then(htmlDataType).
        then((dataItems) => {

            reCenterCartSummaryPopup()

            disableImgContextMenu(document.querySelectorAll("#divMainItemGrid .item-body img"))

            document.querySelector("#divMainItemGrid .item-body").innerHTML = dataItems

            let _hdItemDescription = <HTMLInputElement>document.querySelector("#hdItemDescription")
            let _itemDescription = <HTMLInputElement>document.querySelector("#ItemDescription")

            _hdItemDescription.value = _itemDescription.value

            hidePopupForm()
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const getMoreItems = () => {

    showMoreProgressBar(
        document.querySelector("#moreItemIcon"),
        document.querySelector("#moreItemText"),
        document.querySelector("#moreItemError"))

    let _parameters =
        `?skip=${document.querySelectorAll("#divMainItemGrid .item-body .item-grid .container .item").length}`

    fetch(`OnlineStore/GetMoreItemsByCriteria${removeLineBreaks(_parameters)}`).
        then(handleError).
        then(htmlDataType).
        then((data) => {

            const _data = document.createElement("div")
            _data.innerHTML = data

            if (!!_data.querySelector(".item")) {

                document.querySelector("#divMainItemGrid .item-body .item-grid .container").insertAdjacentHTML("beforeend", data)
                disableImgContextMenu(document.querySelectorAll("#divMainItemGrid .item-body .item-grid .container img"))

                hideMoreProgressBar(
                    document.querySelector("#moreItemIcon"),
                    document.querySelector("#moreItemText"),
                    document.querySelector("#moreItemError"))
            }
            else {
                hideMoreIcon(
                    document.querySelector("#moreItemIcon"),
                    document.querySelector("#moreItemText"),
                    document.querySelector("#moreItemError"))
            }
        }).
        catch((error) => {
            showMoreError(
                document.querySelector("#moreItemIcon"),
                document.querySelector("#moreItemText"),
                document.querySelector("#moreItemError"))
        })
}

const buyItem = (itemDetailId) => {

    showPopupFormProgressBar()

    fetch("/OnlineStore/BuyNow", postOptions(`itemDetailId=${itemDetailId}`)).
        then(handleError).
        then(() => {
            window.location.assign("/OnlineStore/AddToCart")
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const customerAccount = () => {

    showPopupFormProgressBar()

    fetch("/Shared/CustomerAccount").
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const signIn = () => {

    toggleButtonProgressBar(document.querySelector("#navWelcome"), document.querySelector("#progressBarWelcome"))

    fetch("/ApplicationUser/SignIn").
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const submitSignIn = () => {

    const _messageSignIn = clearErrorMessageDiv(document.querySelector("#messageSignIn"))

    validateSignIn(_messageSignIn)

    if (!isErrorMessageDivEmpty(_messageSignIn)) {
        return
    }

    toggleButtonProgressBar(document.querySelector("#navSignIn"), document.querySelector("#progressBarSignIn"))

    fetch("/ApplicationUser/SignIn", postOptions(serialize(document.querySelector("#formSignIn")))).
        then(handleError).
        then(() => {
            hidePopupForm()
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const checkOut = () => {
    window.location.assign("/OnlineStore/ShouldAuthenticateCustomer")
}

const showCartSummaryPopupButton = () => {

    const _cartSummaryPopup: HTMLDivElement = document.querySelector(".cart-summary-popup")

    centerCartSummaryPopup(_cartSummaryPopup)

    _cartSummaryPopup.classList.add("show-cart-summary-popup")
}

function centerCartSummaryPopup(cartSummaryPopup: HTMLDivElement) {

    if (!!cartSummaryPopup) {
        cartSummaryPopup.style.cssText = "top: 11px;right:0px;"
    }
}