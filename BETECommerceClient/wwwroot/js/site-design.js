var shouldHidePopupBackground = true;
window.onresize = function (e) {
    e.preventDefault();
    reCenterPopupFormSmall();
    reCenterPopupFormProgressBar();
    reCenterScrollTopButton();
    reCenterCartSummaryPopup();
};
document.addEventListener("DOMContentLoaded", function () {
    var _images = document.querySelectorAll("img");
    _images.forEach(function (image) {
        image.addEventListener("contextmenu", disableContextmenuMousedown);
    });
    _images.forEach(function (image) {
        image.addEventListener("mousedown", disableContextmenuMousedown);
    });
    document.querySelector(".scroll-top").addEventListener("click", function (e) {
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
        e.preventDefault();
    });
});
var removeLineBreaks = function (string) {
    return string.replace(/\s{2,}/g, "");
};
var removeWhiteSpaceAndComma = function (string) {
    var _result = string.replace(/\,/g, '');
    _result = _result.replace(",", "");
    return _result;
};
var disableContextmenuMousedown = function (e) {
    e.preventDefault();
};
var disableImgContextMenu = function (images) {
    images.forEach(function (image) {
        image.addEventListener("contextmenu", disableContextmenuMousedown);
    });
    images.forEach(function (image) {
        image.addEventListener("mousedown", disableContextmenuMousedown);
    });
};
var handleError = function (response) {
    if (!response.ok) {
        return response.text().
            then(function (error) {
            throw Error(error);
        });
    }
    return response;
};
var htmlDataType = function (response) {
    return response.text();
};
var jsonDataType = function (response) {
    return response.json();
};
var postOptions = function (body) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: body
    };
};
var isInViewport = function (element) {
    if (!!element) {
        var _bounding = element.getBoundingClientRect();
        return (_bounding.top >= 0 &&
            _bounding.left >= 0 &&
            _bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            _bounding.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
    else {
        return false;
    }
};
var isVisible = function (element) {
    if (!!element) {
        var _style = window.getComputedStyle(element);
        return (_style.opacity !== "0" &&
            _style.display !== "none" &&
            _style.visibility !== "hidden");
    }
    else {
        return false;
    }
};
var isValidEmailAddress = function (emailAddress) {
    var _re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return _re.test(emailAddress.trim());
};
var isErrorMessageDivEmpty = function (errorMessageDiv) {
    if (!!errorMessageDiv.innerHTML) {
        return false;
    }
    else {
        return true;
    }
};
var serialize = function (form) {
    var _serialized = [];
    for (var i = 0; i < form.elements.length; i++) {
        var _field = form.elements[i];
        if (!_field.name ||
            _field.type === "file" ||
            _field.type === "reset" ||
            _field.type === "submit" ||
            _field.type === "button")
            continue;
        if (_field.type === "select-multiple") {
            for (var n = 0; n < _field.options.length; n++) {
                if (!_field.options[n].selected)
                    continue;
                _serialized.push(encodeURIComponent(_field.name) + "=" + encodeURIComponent(_field.options[n].value.trim()));
            }
        }
        else if (_field.type !== "checkbox" && _field.type !== "radio") {
            _serialized.push(encodeURIComponent(_field.name) + "=" + encodeURIComponent(_field.value.trim()));
        }
        else if (_field.checked) {
            _serialized.push(encodeURIComponent(_field.name) + "=" + encodeURIComponent(_field.checked));
        }
    }
    return _serialized.join("&");
};
var clearErrorMessageDiv = function (errorMessageDiv) {
    errorMessageDiv.innerHTML = "";
    return errorMessageDiv;
};
var appendErrorMessage = function (errorMessageDiv, errorMessageText) {
    errorMessageDiv.insertAdjacentHTML("beforeend", "&#8594; " + errorMessageText + "<br />");
};
var show = function (element) {
    element.style.display = "block";
};
var hide = function (element) {
    element.style.display = "none";
};
var toggle = function (element) {
    if (window.getComputedStyle(element).display === "block") {
        hide(element);
    }
    else {
        show(element);
    }
};
var showPopupFormProgressBar = function () {
    var _backgroundPopup = document.querySelector(".background-popup"), _popupFormProgressBar = document.querySelector(".popup-form-progress-bar");
    _popupFormProgressBar.classList.remove("hide-popup-form-progress-bar");
    _popupFormProgressBar.classList.add("show-popup-form-progress-bar");
    centerPopupFormProgressBar(_popupFormProgressBar);
    if (isVisible(_backgroundPopup)) {
        shouldHidePopupBackground = false;
        _backgroundPopup.style.cssText = "z-index:6";
    }
    else {
        shouldHidePopupBackground = true;
        showPopupBackground();
    }
};
var hidePopupFormProgressBar = function () {
    var _popupFormProgressBar = document.querySelector(".popup-form-progress-bar");
    _popupFormProgressBar.classList.remove("show-popup-form-progress-bar");
    _popupFormProgressBar.classList.add("hide-popup-form-progress-bar");
    if (shouldHidePopupBackground) {
        hidePopupBackground();
    }
    else {
        document.querySelector(".background-popup").style.cssText = "z-index:3";
    }
};
var showPopupForm = function () {
    hidePopupFormProgressBar();
    var _popupForm;
    if (!!document.querySelector(".popup-form-small")) {
        _popupForm = document.querySelector(".popup-form-small");
        centerPopupFormSmall(_popupForm);
    }
    else {
        if (!!document.querySelector(".popup-form-medium")) {
            _popupForm = document.querySelector(".popup-form-medium");
            _popupForm.style.cssText = "top:" + window.pageYOffset + "px";
        }
        if (!!document.querySelector(".popup-form-large")) {
            _popupForm = document.querySelector(".popup-form-large");
            _popupForm.style.cssText = "top:" + window.pageYOffset + "px";
        }
        if (!!document.querySelector(".popup-form-image")) {
            _popupForm = document.querySelector(".popup-form-image");
            _popupForm.style.cssText = "top:" + window.pageYOffset + "px";
        }
    }
    if (!!_popupForm) {
        var _images = _popupForm.querySelectorAll("img");
        _images.forEach(function (image) {
            image.addEventListener("contextmenu", disableContextmenuMousedown);
        });
        _images.forEach(function (image) {
            image.addEventListener("mousedown", disableContextmenuMousedown);
        });
        showPopupBackground();
        _popupForm.classList.remove("hide-popup-form");
        _popupForm.classList.add("show-popup-form");
    }
};
var showPopupFormHtml = function (data) {
    document.querySelector("#popupFormToShow").innerHTML = data;
    hidePopupFormProgressBar();
    var _popupForm;
    if (!!document.querySelector(".popup-form-small")) {
        _popupForm = document.querySelector(".popup-form-small");
        centerPopupFormSmall(_popupForm);
    }
    else {
        if (!!document.querySelector(".popup-form-medium")) {
            _popupForm = document.querySelector(".popup-form-medium");
            _popupForm.style.cssText = "top:" + window.pageYOffset + "px";
        }
        if (!!document.querySelector(".popup-form-large")) {
            _popupForm = document.querySelector(".popup-form-large");
            _popupForm.style.cssText = "top:" + window.pageYOffset + "px";
        }
        if (!!document.querySelector(".popup-form-image")) {
            _popupForm = document.querySelector(".popup-form-image");
            _popupForm.style.cssText = "top:" + window.pageYOffset + "px";
        }
    }
    if (!!_popupForm) {
        var _images = _popupForm.querySelectorAll("img");
        _images.forEach(function (image) {
            image.addEventListener("contextmenu", disableContextmenuMousedown);
        });
        _images.forEach(function (image) {
            image.addEventListener("mousedown", disableContextmenuMousedown);
        });
        showPopupBackground();
        _popupForm.classList.remove("hide-popup-form");
        _popupForm.classList.add("show-popup-form");
    }
};
var hidePopupForm = function () {
    var _popupForm;
    if (!!document.querySelector(".popup-form-small")) {
        _popupForm = document.querySelector(".popup-form-small");
    }
    if (!!document.querySelector(".popup-form-medium")) {
        _popupForm = document.querySelector(".popup-form-medium");
    }
    if (!!document.querySelector(".popup-form-large")) {
        _popupForm = document.querySelector(".popup-form-large");
    }
    if (!!document.querySelector(".popup-form-image")) {
        _popupForm = document.querySelector(".popup-form-image");
    }
    if (!!_popupForm) {
        _popupForm.classList.remove("show-popup-form");
        _popupForm.classList.add("hide-popup-form");
        hidePopupBackground();
    }
};
var toggleButtonProgressBar = function (buttonGroup, progressBar) {
    buttonGroup.classList.toggle("hide-button-progress-bar");
    progressBar.classList.toggle("show-button-progress-bar");
};
var toggleScrollTopButton = function () {
    if (window.pageYOffset >= 180) {
        var _scrollTop = document.querySelector(".scroll-top");
        if (!!_scrollTop) {
            if (!_scrollTop.classList.contains("show-scroll-top")) {
                centerScrollTopButton(_scrollTop);
                _scrollTop.classList.remove("hide-scroll-top");
                _scrollTop.classList.add("show-scroll-top");
            }
        }
    }
    else {
        var _scrollTop = document.querySelector(".scroll-top");
        if (!!_scrollTop) {
            if (!_scrollTop.classList.contains("hide-scroll-top")) {
                if (_scrollTop.classList.contains("show-scroll-top")) {
                    _scrollTop.classList.remove("show-scroll-top");
                    _scrollTop.classList.add("hide-scroll-top");
                }
            }
        }
    }
};
var reCenterPopupFormProgressBar = function () {
    var _popupForm = document.querySelector(".popup-form-progress-bar");
    if (isVisible(_popupForm)) {
        centerPopupFormProgressBar(_popupForm);
    }
};
var reCenterPopupFormSmall = function () {
    var _popupForm = document.querySelector(".popup-form-small");
    if (isVisible(_popupForm)) {
        centerPopupFormSmall(_popupForm);
    }
};
var reCenterScrollTopButton = function () {
    var _scrollTop = document.querySelector(".scroll-top");
    if (isVisible(_scrollTop)) {
        centerScrollTopButton(_scrollTop);
    }
};
var reCenterCartSummaryPopup = function () {
    var _cartSummaryPopup = document.querySelector(".cart-summary-popup");
    if (isVisible(_cartSummaryPopup)) {
        centerCartSummaryPopup(_cartSummaryPopup);
    }
};
function hidePopupBackground() {
    var _backgroundPopup = document.querySelector(".background-popup");
    _backgroundPopup.classList.remove("show-popup-background");
    _backgroundPopup.classList.add("hide-popup-background");
}
function showPopupBackground() {
    var _backgroundPopup = document.querySelector(".background-popup");
    _backgroundPopup.classList.remove("hide-popup-background");
    _backgroundPopup.classList.add("show-popup-background");
}
function centerPopupFormProgressBar(popupForm) {
    var _windowWidth = document.documentElement.clientWidth, _popupWidth = popupForm.clientWidth;
    popupForm.style.cssText =
        "top:" + (window.pageYOffset + 6) + "px;left:" + (_windowWidth / 2 - _popupWidth / 2) + "px";
}
function centerPopupFormSmall(popupForm) {
    var _windowWidth = document.documentElement.clientWidth, _popupWidth = popupForm.clientWidth;
    popupForm.style.cssText =
        "top:" + (window.pageYOffset + 10) + "px;left:" + (_windowWidth / 2 - _popupWidth / 2) + "px";
}
function centerScrollTopButton(scrollTopElement) {
    scrollTopElement.style.cssText = "bottom:0px; right:0px";
}
//# sourceMappingURL=site-design.js.map