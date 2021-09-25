let shouldHidePopupBackground = true

window.onresize = (e: Event) => {

    e.preventDefault()

    reCenterPopupFormSmall()
    reCenterPopupFormProgressBar()
    reCenterScrollTopButton()
    reCenterCartSummaryPopup()
}

document.addEventListener("DOMContentLoaded", () => {

    const _images: NodeListOf<HTMLImageElement> = document.querySelectorAll("img")
    _images.forEach((image) => {
        image.addEventListener("contextmenu", disableContextmenuMousedown)
    })

    _images.forEach((image) => {
        image.addEventListener("mousedown", disableContextmenuMousedown)
    })

    document.querySelector(".scroll-top").addEventListener("click", (e: Event) => {
        window.scroll({ top: 0, left: 0, behavior: "smooth" })
        e.preventDefault()
    })
})

const removeLineBreaks = (string: string) => {
    return string.replace(/\s{2,}/g, "")
}

const removeWhiteSpaceAndComma = (string: string) => {
    let _result = string.replace(/\,/g, '')
    _result = _result.replace(",", "")
    return _result
}

const disableContextmenuMousedown = (e: Event) => {
    e.preventDefault()
}

const disableImgContextMenu = (images: NodeListOf<HTMLImageElement>) => {

    images.forEach((image) => {
        image.addEventListener("contextmenu", disableContextmenuMousedown)
    })

    images.forEach((image) => {
        image.addEventListener("mousedown", disableContextmenuMousedown)
    })
}

const handleError = (response) => {
    if (!response.ok) {
        return response.text().
            then((error) => {
                throw Error(error)
            })
    }
    return response
}

const htmlDataType = (response) => {
    return response.text()
}

const jsonDataType = (response) => {
    return response.json()
}

const postOptions = (body) => {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: body
    }
}

const isInViewport = (element) => {

    if (!!element) {

        const _bounding = element.getBoundingClientRect()

        return (
            _bounding.top >= 0 &&
            _bounding.left >= 0 &&
            _bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            _bounding.right <= (window.innerWidth || document.documentElement.clientWidth))
    }
    else {
        return false
    }
}

const isVisible = (element) => {

    if (!!element) {

        const _style = window.getComputedStyle(element)

        return (
            _style.opacity !== "0" &&
            _style.display !== "none" &&
            _style.visibility !== "hidden")
    }
    else {
        return false
    }
}

const isValidEmailAddress = (emailAddress: string) => {

    const _re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return _re.test(emailAddress.trim())
}

const isErrorMessageDivEmpty = (errorMessageDiv: HTMLDivElement) => {

    if (!!errorMessageDiv.innerHTML) {
        return false
    }
    else {
        return true
    }
}

const serialize = (form) => {

    const _serialized = []

    for (let i = 0; i < form.elements.length; i++) {

        const _field = form.elements[i]

        if (!_field.name ||
            _field.type === "file" ||
            _field.type === "reset" ||
            _field.type === "submit" ||
            _field.type === "button")
            continue

        if (_field.type === "select-multiple") {

            for (let n = 0; n < _field.options.length; n++) {

                if (!_field.options[n].selected)
                    continue

                _serialized.push(`${encodeURIComponent(_field.name)}=${encodeURIComponent(_field.options[n].value.trim())}`)
            }
        }
        else if (_field.type !== "checkbox" && _field.type !== "radio") {
            _serialized.push(`${encodeURIComponent(_field.name)}=${encodeURIComponent(_field.value.trim())}`)
        } else if (_field.checked) {
            _serialized.push(`${encodeURIComponent(_field.name)}=${encodeURIComponent(_field.checked)}`)
        }
    }

    return _serialized.join("&")
}

const clearErrorMessageDiv = (errorMessageDiv: HTMLDivElement) => {
    errorMessageDiv.innerHTML = ""
    return errorMessageDiv
}

const appendErrorMessage = (errorMessageDiv: HTMLDivElement, errorMessageText: string) => {
    errorMessageDiv.insertAdjacentHTML("beforeend", `&#8594; ${errorMessageText}<br />`)
}

const show = (element) => {
    element.style.display = "block"
}

const hide = (element) => {
    element.style.display = "none"
}

const toggle = (element) => {

    if (window.getComputedStyle(element).display === "block") {
        hide(element)
    }
    else {
        show(element)
    }
}

const showPopupFormProgressBar = () => {
    const _backgroundPopup: HTMLDivElement = document.querySelector(".background-popup"),
        _popupFormProgressBar: HTMLDivElement = document.querySelector(".popup-form-progress-bar")

    _popupFormProgressBar.classList.remove("hide-popup-form-progress-bar")
    _popupFormProgressBar.classList.add("show-popup-form-progress-bar")

    centerPopupFormProgressBar(_popupFormProgressBar)

    if (isVisible(_backgroundPopup)) {
        shouldHidePopupBackground = false
        _backgroundPopup.style.cssText = "z-index:6"
    }
    else {
        shouldHidePopupBackground = true;
        showPopupBackground()
    }
}

const hidePopupFormProgressBar = () => {

    const _popupFormProgressBar: HTMLDivElement = document.querySelector(".popup-form-progress-bar")

    _popupFormProgressBar.classList.remove("show-popup-form-progress-bar")
    _popupFormProgressBar.classList.add("hide-popup-form-progress-bar")

    if (shouldHidePopupBackground) {
        hidePopupBackground()
    }
    else {
        (document.querySelector(".background-popup") as HTMLDivElement).style.cssText = "z-index:3"
    }
}

const showPopupForm = () => {

    hidePopupFormProgressBar()

    let _popupForm: HTMLDivElement

    if (!!document.querySelector(".popup-form-small")) {
        _popupForm = document.querySelector(".popup-form-small")

        centerPopupFormSmall(_popupForm)
    }
    else {
        if (!!document.querySelector(".popup-form-medium")) {
            _popupForm = document.querySelector(".popup-form-medium")

            _popupForm.style.cssText = `top:${window.pageYOffset}px`
        }

        if (!!document.querySelector(".popup-form-large")) {
            _popupForm = document.querySelector(".popup-form-large")

            _popupForm.style.cssText = `top:${window.pageYOffset}px`
        }

        if (!!document.querySelector(".popup-form-image")) {
            _popupForm = document.querySelector(".popup-form-image")

            _popupForm.style.cssText = `top:${window.pageYOffset}px`
        }
    }

    if (!!_popupForm) {

        const _images: NodeListOf<HTMLImageElement> = _popupForm.querySelectorAll("img")
        _images.forEach((image) => {
            image.addEventListener("contextmenu", disableContextmenuMousedown)
        })

        _images.forEach((image) => {
            image.addEventListener("mousedown", disableContextmenuMousedown)
        })

        showPopupBackground()

        _popupForm.classList.remove("hide-popup-form")
        _popupForm.classList.add("show-popup-form")
    }
}

const showPopupFormHtml = (data) => {

    document.querySelector("#popupFormToShow").innerHTML = data

    hidePopupFormProgressBar()

    let _popupForm: HTMLDivElement

    if (!!document.querySelector(".popup-form-small")) {
        _popupForm = document.querySelector(".popup-form-small")

        centerPopupFormSmall(_popupForm)
    }
    else {
        if (!!document.querySelector(".popup-form-medium")) {
            _popupForm = document.querySelector(".popup-form-medium")

            _popupForm.style.cssText = `top:${window.pageYOffset}px`
        }

        if (!!document.querySelector(".popup-form-large")) {
            _popupForm = document.querySelector(".popup-form-large")

            _popupForm.style.cssText = `top:${window.pageYOffset}px`
        }

        if (!!document.querySelector(".popup-form-image")) {
            _popupForm = document.querySelector(".popup-form-image")

            _popupForm.style.cssText = `top:${window.pageYOffset}px`
        }
    }

    if (!!_popupForm) {

        const _images: NodeListOf<HTMLImageElement> = _popupForm.querySelectorAll("img")
        _images.forEach((image) => {
            image.addEventListener("contextmenu", disableContextmenuMousedown)
        })

        _images.forEach((image) => {
            image.addEventListener("mousedown", disableContextmenuMousedown)
        })

        showPopupBackground()

        _popupForm.classList.remove("hide-popup-form")
        _popupForm.classList.add("show-popup-form")
    }
}

const hidePopupForm = () => {

    let _popupForm: HTMLDivElement

    if (!!document.querySelector(".popup-form-small")) {
        _popupForm = document.querySelector(".popup-form-small")
    }

    if (!!document.querySelector(".popup-form-medium")) {
        _popupForm = document.querySelector(".popup-form-medium")
    }

    if (!!document.querySelector(".popup-form-large")) {
        _popupForm = document.querySelector(".popup-form-large")
    }

    if (!!document.querySelector(".popup-form-image")) {
        _popupForm = document.querySelector(".popup-form-image")
    }

    if (!!_popupForm) {

        _popupForm.classList.remove("show-popup-form")
        _popupForm.classList.add("hide-popup-form")

        hidePopupBackground()
    }
}

const toggleButtonProgressBar = (buttonGroup: HTMLTableElement, progressBar: HTMLButtonElement) => {

    buttonGroup.classList.toggle("hide-button-progress-bar")
    progressBar.classList.toggle("show-button-progress-bar")
}

const toggleScrollTopButton = () => {

    if (window.pageYOffset >= 180) {

        const _scrollTop: HTMLDivElement = document.querySelector(".scroll-top")
        if (!!_scrollTop) {
            if (!_scrollTop.classList.contains("show-scroll-top")) {

                centerScrollTopButton(_scrollTop)

                _scrollTop.classList.remove("hide-scroll-top")
                _scrollTop.classList.add("show-scroll-top")
            }
        }
    }
    else {

        const _scrollTop: HTMLDivElement = document.querySelector(".scroll-top")
        if (!!_scrollTop) {
            if (!_scrollTop.classList.contains("hide-scroll-top")) {

                if (_scrollTop.classList.contains("show-scroll-top")) {

                    _scrollTop.classList.remove("show-scroll-top")
                    _scrollTop.classList.add("hide-scroll-top")
                }
            }
        }
    }
}

const reCenterPopupFormProgressBar = () => {

    const _popupForm: HTMLDivElement = document.querySelector(".popup-form-progress-bar")
    if (isVisible(_popupForm)) {
        centerPopupFormProgressBar(_popupForm)
    }
}

const reCenterPopupFormSmall = () => {

    const _popupForm: HTMLDivElement = document.querySelector(".popup-form-small")

    if (isVisible(_popupForm)) {
        centerPopupFormSmall(_popupForm)
    }
}

const reCenterScrollTopButton = () => {

    const _scrollTop: HTMLDivElement = document.querySelector(".scroll-top")
    if (isVisible(_scrollTop)) {
        centerScrollTopButton(_scrollTop)
    }
}

const reCenterCartSummaryPopup = () => {

    const _cartSummaryPopup: HTMLDivElement = document.querySelector(".cart-summary-popup")

    if (isVisible(_cartSummaryPopup)) {
        centerCartSummaryPopup(_cartSummaryPopup)
    }
}

function hidePopupBackground() {

    const _backgroundPopup: HTMLDivElement = document.querySelector(".background-popup")

    _backgroundPopup.classList.remove("show-popup-background")
    _backgroundPopup.classList.add("hide-popup-background")
}

function showPopupBackground() {

    const _backgroundPopup: HTMLDivElement = document.querySelector(".background-popup")

    _backgroundPopup.classList.remove("hide-popup-background")
    _backgroundPopup.classList.add("show-popup-background")
}

function centerPopupFormProgressBar(popupForm: HTMLDivElement) {

    const _windowWidth = document.documentElement.clientWidth,
        _popupWidth = popupForm.clientWidth

    popupForm.style.cssText =
        `top:${window.pageYOffset + 6}px;left:${_windowWidth / 2 - _popupWidth / 2}px`
}

function centerPopupFormSmall(popupForm: HTMLDivElement) {

    const _windowWidth = document.documentElement.clientWidth,
        _popupWidth = popupForm.clientWidth

    popupForm.style.cssText =
        `top:${window.pageYOffset + 10}px;left:${_windowWidth / 2 - _popupWidth / 2}px`
}

function centerScrollTopButton(scrollTopElement: HTMLDivElement) {
    scrollTopElement.style.cssText = "bottom:0px; right:0px"
}

