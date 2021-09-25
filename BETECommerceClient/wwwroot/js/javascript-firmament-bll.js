
window.onscroll = (e) => {

    e.preventDefault()

    toggleScrollTopButton()
    reCenterPopupFormProgressBar()

    if (isInViewport(document.querySelector("#moreItemIcon")) && isVisible(document.querySelector("#moreItemIcon"))) {
        getMoreItems()
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const _cartSummary = document.querySelector(".cart-summary")

    _cartSummary.addEventListener("click", () => {

        if (parseInt(removeWhiteSpaceAndComma(cartSummary.querySelector(".lblQuantity").textContent.trim())) > 0) {
            viewCart()
        }
    })
})

const viewCart = () => {
    fetch("/OnlineStore/ViewCart", showPopupFormProgressBar()).
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const showItemImage = (pictureControl) => {

    fetch(`/OnlineStore/ItemPicturePopup?picturePath=${pictureControl.src}`, showPopupFormProgressBar()).
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const loadCartSummary = () => {

    fetch("/OnlineStore/CartSummary").
        then(handleError).
        then(jsonDataType).
        then((data) => {

            document.querySelector(".cart-summary-popup .cart-label-qty .lblQuantity").textContent = data.quantity
            document.querySelector(".cart-summary-popup .cart-label-sub-total .lblSubTotal").textContent = data.subTotal

            showCartSummaryPopupButton()

            document.querySelector(".loader").classList.add("hide-loader")
        }).
        catch((error) => {
            document.querySelector(".loader").classList.add("hide-loader")

            showErrorPopupForm(error)
        })
}

const showMoreProgressBar = (moreIcon, moreProgressBar, moreError) => {
    moreIcon.classList.add("hide-more-icon")
    moreProgressBar.classList.add("show-get-more-text")
    moreError.classList.remove("show-get-more-error")
}

const hideMoreProgressBar = (moreIcon, moreProgressBar, moreError) => {
    moreIcon.classList.remove("hide-more-icon")
    moreProgressBar.classList.remove("show-get-more-text")
    moreError.classList.remove("show-get-more-error")
}

const hideMoreIcon = (moreIcon, moreProgressBar, moreError) => {
    moreIcon.classList.add("hide-more-icon")
    moreError.classList.remove("show-get-more-error")
    moreProgressBar.classList.remove("show-get-more-text")
}

const showMoreError = (moreIcon, moreProgressBar, moreError) => {
    moreIcon.classList.add("hide-more-icon")
    moreError.classList.add("show-get-more-error")
    moreProgressBar.classList.remove("show-get-more-text")
}

const showCartSummaryPopupButton = () => {

    const _cartSummaryPopup = document.querySelector(".cart-summary-popup")

    centerCartSummaryPopup(_cartSummaryPopup, null)

    _cartSummaryPopup.classList.add("show-cart-summary-popup")
}

function centerCartSummaryPopup(cartSummaryPopup, cartSummaryPopupNoProfileIcon) {

    if (!!cartSummaryPopup) {
        cartSummaryPopup.style.cssText = "top: 11px;right:0px;"
    }

    if (!!cartSummaryPopupNoProfileIcon) {
        cartSummaryPopupNoProfileIcon.style.cssText = "top: 11px;right:0px;"
    }
}

const reCenterCartSummaryPopup = () => {

    const _cartSummaryPopup = document.querySelector(".cart-summary-popup"),
        _cartSummaryPopupNoProfileIcon = document.querySelector(".cart-summary-popup-no-profile-icon")

    if (isVisible(_cartSummaryPopup)) {
        centerCartSummaryPopup(_cartSummaryPopup, null)
    }

    if (isVisible(_cartSummaryPopupNoProfileIcon)) {
        centerCartSummaryPopup(null, _cartSummaryPopupNoProfileIcon)
    }
}

const customerAccount = () => {

    fetch("/Shared/CustomerAccount", showPopupFormProgressBar()).
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const index = () => {
    window.location.assign("/OnlineStore/Index")
}

const signOut = () => {
    window.location.assign("/ApplicationUser/UserSignOut")
}

function validateSignIn(messageSignInDiv) {
    if (!(!!document.querySelector("#Username").value.trim())) {
        appendErrorMessage(messageSignInDiv, "Username required")
    }

    if (!(!!document.querySelector("#UserPassword").value.trim())) {
        appendErrorMessage(messageSignInDiv, "Password required")
    }
}

const signIn = () => {

    fetch("/ApplicationUser/SignIn",
        toggleButtonProgressBar(document.querySelector("#navWelcome"), document.querySelector("#progressBarWelcome"))).
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

    fetch("/ApplicationUser/SignIn",
        postOptions(serialize(document.querySelector("#formSignIn"))),
        toggleButtonProgressBar(document.querySelector("#navSignIn"), document.querySelector("#progressBarSignIn"))).
        then(handleError).
        then(jsonDataType).
        then((data) => {
            window.location.replace(data.redirectToUrl)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const checkOutSignIn = () => {

    fetch("/ApplicationUser/CheckOutSignIn", showPopupFormProgressBar()).
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

    fetch("/ApplicationUser/CheckOutSignIn",
        postOptions(serialize(document.querySelector("#formCustomerSignIn"))),
        toggleButtonProgressBar(document.querySelector("#navCustomerSignIn"), document.querySelector("#progressBarCustomerSignIn"))).
        then(handleError).
        then(() => {
            window.location.assign("/OnlineStore/Shipping")
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

function validateSignUp(messageDiv) {
    if (!(!!document.querySelector("#FirstName").value.trim())) {
        appendErrorMessage(messageDiv, "First Name required")
    }

    if (!(!!document.querySelector("#LastName").value.trim())) {
        appendErrorMessage(messageDiv, "Last Name required")
    }

    const _mobileCode = document.querySelector("#MobileCode")
    if (!(!!_mobileCode.value.trim())) {
        appendErrorMessage(messageDiv, "Mobile Code required")
    } else {
        if (isNaN(parseInt(_mobileCode.value.trim()))) {
            appendErrorMessage(messageDiv, "Numeric Mobile Code required")
        }
    }

    if (!(!!document.querySelector("#MobileNumber").value.trim())) {
        appendErrorMessage(messageDiv, "Mobile Number required")
    }

    const _alternateMobileCode = document.querySelector("#AlternateMobileCode")
    if (!(!!_alternateMobileCode.value.trim())) {
        appendErrorMessage(messageDiv, "Alternate Mobile Code required")
    } else {
        if (isNaN(parseInt(_alternateMobileCode.value.trim()))) {
            appendErrorMessage(messageDiv, "Numeric Alternate Mobile Code required")
        }
    }

    if (!(!!document.querySelector("#AlternateMobileNumber").value.trim())) {
        appendErrorMessage(messageDiv, "Alternate Mobile Number required")
    }

    const _emailAddress = document.querySelector("#EmailAddress"),
        _repeatEmailAddress = document.querySelector("#RepeatEmailAddress")

    if (!(!!_emailAddress.value.trim())) {
        appendErrorMessage(messageDiv, "Email Address required")
    }
    else {
        if (!isValidEmailAddress(_emailAddress.value.trim())) {
            appendErrorMessage(messageDiv, "Invalid Email Address")
        }
    }

    if (!(!!_repeatEmailAddress.value.trim())) {
        appendErrorMessage(messageDiv, "Repeat Email Address required")
    }
    else {
        if (_repeatEmailAddress.value.trim() != _emailAddress.value.trim()) {
            appendErrorMessage(messageDiv, "Invalid Repeat Email Address")
        }
    }

    if (!(!!document.querySelector("#AddressLine1").value.trim())) {
        appendErrorMessage(messageDiv, "Street Address required")
    }

    if (!(!!document.querySelector("#StateOrProvince").value.trim())) {
        appendErrorMessage(messageDiv, "State or Province required")
    }

    if (!(!!document.querySelector("#CityOrTown").value.trim())) {
        appendErrorMessage(messageDiv, "City or Town required")
    }

    if (!(!!document.querySelector("#SuburbOrTownship").value.trim())) {
        appendErrorMessage(messageDiv, "Suburb or Township required")
    }

    const _postalCode = document.querySelector("#PostalCode")

    if (!(!!_postalCode.value.trim())) {
        appendErrorMessage(messageDiv, "Postal Code required")
    }
    else {
        if (isNaN(_postalCode.value.trim())) {
            appendErrorMessage(messageDiv, "Numeric Postal Code required")
        }
    }

    if (!(!!document.querySelector("#CountryName").value.trim())) {
        appendErrorMessage(messageDiv, "We currently do not courier to your current country")
    }
}

const signUp = () => {

    fetch("/ApplicationUser/SignUp",
        toggleButtonProgressBar(document.querySelector("#navWelcome"), document.querySelector("#progressBarWelcome"))).
        then(handleError).
        then(htmlDataType).
        then((signUpResp) => {
            showPopupFormHtml(signUpResp)

            const _mobileCode = getMobileCode(),
                _countryName = getCountryName()

            document.querySelector("#MobileCode").value = _mobileCode
            document.querySelector("#AlternateMobileCode").value = _mobileCode

            let _parameters =
                `?countryName=${_countryName}`

            fetch(`/OnlineStore/IsCountryNameExisting${removeLineBreaks(_parameters)}`).
                then(handleError).
                then(jsonDataType).
                then((isCountryNameExistingResp) => {

                    if (isCountryNameExistingResp) {
                        fillCountryDropDown([{
                            countryName: _countryName
                        }], document.querySelector("#CountryName"))
                    } else {
                        initialiseDropDown(document.querySelector("#CountryName"), getCountryNameNotExistingMessage())
                    }
                }).
                catch((error) => {
                    showErrorPopupForm(error)
                })
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const checkOutSignUp = () => {

    fetch("/ApplicationUser/CheckOutSignUp", showPopupFormProgressBar()).
        then(handleError).
        then(htmlDataType).
        then((checkOutSignUpResp) => {
            showPopupFormHtml(checkOutSignUpResp)


            const _mobileCode = getMobileCode(),
                _countryName = getCountryName()

            document.querySelector("#MobileCode").value = _mobileCode
            document.querySelector("#AlternateMobileCode").value = _mobileCode

            let _parameters =
                `?countryName=${_countryName}`

            fetch(`/OnlineStore/IsCountryNameExisting${removeLineBreaks(_parameters)}`).
                then(handleError).
                then(jsonDataType).
                then((isCountryNameExistingResp) => {

                    if (isCountryNameExistingResp) {
                        fillCountryDropDown([{
                            countryName: _countryName
                        }], document.querySelector("#CountryName"))
                    } else {
                        initialiseDropDown(document.querySelector("#CountryName"), getCountryNameNotExistingMessage())
                    }
                }).
                catch((error) => {
                    showErrorPopupForm(error)
                })
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

    fetch("/ApplicationUser/SignUp",
        postOptions(serialize(document.querySelector("#formSignUp"))),
        toggleButtonProgressBar(document.querySelector("#navSignUp"), document.querySelector("#progressBarSignUp"))).
        then(handleError).
        then(htmlDataType).
        then((data) => {
            showPopupFormHtml(data)
        }).
        catch((error) => {

            if (error == "Error: Email Address already existing") {
                appendErrorMessage(_messageSignUp, "Email Address already existing, you can Sign In as a Member or use another Email Address.")
                toggleButtonProgressBar(document.querySelector("#navSignUp"), document.querySelector("#progressBarSignUp"))
            }
            else {
                if (error == "Error: Failure sending mail.") {
                    showErrorPopupForm("Congrats...! You have Signed Up successful, but we could not send you an Email, you can use Forgot Password to get your Sign In credentials.")
                }
                else {
                    showErrorPopupForm(error)
                }
            }
        })
}

const submitCheckOutSignUp = () => {

    const _messageSignUp = clearErrorMessageDiv(document.querySelector("#messageSignUp"))

    validateSignUp(_messageSignUp);

    if (!isErrorMessageDivEmpty(_messageSignUp)) {
        return
    }

    fetch("/ApplicationUser/CheckOutSignUp",
        postOptions(serialize(document.querySelector("#formSignUp"))),
        toggleButtonProgressBar(document.querySelector("#navSignUp"), document.querySelector("#progressBarSignUp"))).
        then(handleError).
        then(() => {
            window.location.assign("/OnlineStore/Shipping")
        }).
        catch((error) => {

            if (error == "Error: Message: Email Address already existing.") {
                toggleButtonProgressBar(document.querySelector("#navSignUp"), document.querySelector("#progressBarSignUp"))
                showErrorPopupForm("Email Address already existing, please use another Email Address.")
            }
            else {
                window.location.assign("/OnlineStore/Shipping")
            }
        })
}

const addToCartCrosssellItem = (itemDetailId) => {

    fetch("/OnlineStore/BuyNow", postOptions(`itemDetailId=${itemDetailId}`), showPopupFormProgressBar()).
        then(handleError).
        then(() => {
            window.location.assign("/OnlineStore/AddToCart")
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

            document.querySelectorAll(".cart-label-qty .lblQuantity").forEach((lblQuantity) => {
                lblQuantity.textContent = data.quantity
            })

            document.querySelectorAll(".cart-label-sub-total .lblSubTotal").forEach((lblSubTotal) => {
                lblSubTotal.textContent = data.subTotal
            })

            reCenterCartSummaryPopup()
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const updateCartItemQuantity = (itemDetailId, quantity, brandName, sizeName, colourName) => {

    const _parameters =
        `itemDetailId=${itemDetailId}
         &quantity=${quantity}
         &brandName=${brandName}
         &sizeName=${sizeName}
         &colourName=${colourName}`

    fetch("/OnlineStore/UpdateItemQuantity", postOptions(removeLineBreaks(_parameters)), showPopupFormProgressBar()).
        then(handleError).
        then(htmlDataType).
        then((data) => {

            document.querySelector("#divLineItemGrid").innerHTML = data

            updateCartSummary();

            hidePopupFormProgressBar()
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const editCartItem = (itemDetailId, brandName, sizeName, colourName) => {

    const _parameters =
        `?itemDetailId=${itemDetailId}
         &brandName=${brandName}
         &sizeName=${sizeName}
         &colourName=${colourName}`

    fetch(`/OnlineStore/EditCartItem${removeLineBreaks(_parameters)}`, showPopupFormProgressBar()).
        then(handleError).
        then(htmlDataType).
        then((data) => {

            showPopupFormHtml(data)

            document.querySelector("#SizeName").addEventListener("input", colourInput)
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const submitEditCartItem = () => {

    const _messageEditCartItem = clearErrorMessageDiv(document.querySelector("#messageEditCartItem"))

    const _sizeName = document.querySelector("#SizeName")
    if (!(!!_sizeName.value.trim())) {
        appendErrorMessage(_messageEditCartItem, "Size required")
    }

    const _colourName = document.querySelector("#ColourName")
    if (!(!!_colourName.value.trim())) {
        appendErrorMessage(_messageEditCartItem, "Colour required")
    }

    const _quantity = document.querySelector("#Quantity")
    if (!(!!_quantity.value.trim())) {
        appendErrorMessage(_messageEditCartItem, "Quantity required")
    }
    else {
        if (isNaN(_quantity.value.trim())) {
            appendErrorMessage(_messageEditCartItem, "Numeric Quantity required")
        }
        else {
            if (parseInt(_quantity.value.trim()) <= 0) {
                appendErrorMessage(_messageEditCartItem, "Invalid Quantity")
            }
        }
    }

    if (!isErrorMessageDivEmpty(_messageEditCartItem)) {
        return
    }

    fetch("/OnlineStore/EditCartItem", postOptions(serialize(document.querySelector("#formEditCartItem"))),
        toggleButtonProgressBar(document.querySelector("#navEditCartItem"), document.querySelector("#progressBarEditCartItem"))).
        then(handleError).
        then(htmlDataType).
        then((data) => {

            showPopupFormHtml(data)

            updateCartSummary();
        }).
        catch((error) => {
            showErrorPopupForm(error)
        })
}

const checkOut = () => {
    window.location.assign("/OnlineStore/ShouldAuthenticateCustomer")
}

