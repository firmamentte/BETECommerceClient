using System;
using BETECommerceClient.Models.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BETECommerceClient.Controllers
{
    public class Shared : Controller
    {
        private string GetUsernameFromSession
        {
            get
            {
                return HttpContext.Session.GetString("Username") ?? null;
            }
        }

        [HttpGet]
        public ActionResult CustomerAccount()
        {
            if (!string.IsNullOrWhiteSpace(GetUsernameFromSession))
            {
                return PartialView("_CustomerAccount");
            }
            else
            {
                return PartialView("_Welcome");
            }
        }

        [HttpGet]
        public ActionResult Ok(string okMessage, string messageSymbol)
        {
            return PartialView("_Ok", new OkModel() { OkMessage = okMessage, MessageSymbol = messageSymbol });
        }
    }
}
