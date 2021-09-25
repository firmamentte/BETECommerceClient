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
                try
                {
                    return HttpContext.Session.GetString("Username") ?? null;
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        [HttpGet]
        public ActionResult CustomerAccount()
        {
            try
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
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        public ActionResult Ok(string okMessage, string messageSymbol)
        {
            return PartialView("_Ok", new OkModel() { OkMessage = okMessage, MessageSymbol = messageSymbol });
        }
    }
}
