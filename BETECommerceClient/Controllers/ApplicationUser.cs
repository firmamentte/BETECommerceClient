using System;
using System.Threading.Tasks;
using BETECommerceClient.BLL;
using BETECommerceClient.BLL.DataContract;
using BETECommerceClient.Models.ApplicationUser;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BETECommerceClient.Controllers
{
    [ResponseCache(NoStore = true, Duration = 0, Location = ResponseCacheLocation.None, VaryByHeader = "*")]
    public class ApplicationUser : Controller
    {
        [HttpGet]
        public ActionResult SignUp()
        {
                return PartialView();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SignUp(SignUpModel model)
        {
                await BETECommerceClientBLL.ApplicationUserHelper.SignUp(new SignUpReq()
                {
                    EmailAddress = model.EmailAddress,
                    UserPassword = model.UserPassword
                });

                return PartialView("_Ok", ControllerHelper.SharedHelper.FillOkModel("Congrats...! You have Signed Up successful, Please use your Email Address and Password to Sign in", ControllerHelper.EnumHelper.MessageSymbol.Information));
        }

        [HttpGet]
        public ActionResult CheckOutSignUp()
        {
                return PartialView();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task CheckOutSignUp(SignUpModel model)
        {
                await BETECommerceClientBLL.ApplicationUserHelper.SignUp(new SignUpReq()
                {
                    EmailAddress = model.EmailAddress,
                    UserPassword = model.UserPassword
                });

                HttpContext.Session.SetString("Username", model.EmailAddress);
        }

        [HttpGet]
        public ActionResult SignIn()
        {
                return PartialView();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task SignIn(SignInModel model)
        {
                await BETECommerceClientBLL.ApplicationUserHelper.SignIn(new SignInReq()
                {
                    EmailAddress = model.EmailAddress,
                    UserPassword = model.UserPassword
                });

                HttpContext.Session.SetString("Username", model.EmailAddress);
        }

        [HttpGet]
        public ActionResult CheckOutSignIn()
        {
                return PartialView();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task CheckOutSignIn(SignInModel model)
        {
                await BETECommerceClientBLL.ApplicationUserHelper.SignIn(new SignInReq()
                {
                    EmailAddress = model.EmailAddress,
                    UserPassword = model.UserPassword
                });

                HttpContext.Session.SetString("Username", model.EmailAddress);
        }

        [HttpGet]
        public ActionResult UserSignOut()
        {
            HttpContext.Session.Clear();

            return RedirectToActionPermanent("Index", "OnlineStore");
        }
    }
}
