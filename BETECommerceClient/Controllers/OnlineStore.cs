using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using BETECommerceClient.BLL;
using BETECommerceClient.BLL.DataContract;
using BETECommerceClient.Models.OnlineStore;
using BETECommerceClient.Models.Reporting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace BETECommerceClient.Controllers
{
    [ResponseCache(NoStore = true, Duration = 0, Location = ResponseCacheLocation.None, VaryByHeader = "*")]
    public class OnlineStore : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;

        public OnlineStore(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _webHostEnvironment ??= webHostEnvironment;
            _configuration ??= configuration;
        }

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

        [NonAction]
        private void InitialisePurchaseOrderSessionModelIfNull()
        {
            if (HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel") is null)
            {
                HttpContext.Session.Set("PurchaseOrderSessionModel", new PurchaseOrderSessionModel()
                {
                    LineItems = new List<LineItemGridSessionModel>(),
                });
            }
        }

        [NonAction]
        private void InitialisePurchaseOrderSessionModel()
        {
            HttpContext.Session.Set("PurchaseOrderSessionModel", new PurchaseOrderSessionModel()
            {
                LineItems = new List<LineItemGridSessionModel>(),
            });
        }

        [NonAction]
        private void ClearSearchItem()
        {
            HttpContext.Session.Remove("ItemDescription");
        }

        public async Task<ActionResult> Index()
        {
            InitialisePurchaseOrderSessionModelIfNull();

            ItemPaginationResp _itemPaginationResp = await BETECommerceClientBLL.ItemHelper.GetItemsByCriteria(new GetItemsByCriteriaReq()
            {
                ItemDescription = HttpContext.Session.GetString("ItemDescription")
            });

            await ControllerHelper.ItemHelper.CreateItemPictureFromBase64String(_webHostEnvironment, _itemPaginationResp.Items);

            PartialView("MainItemGrid", ControllerHelper.ItemHelper.FillItemGridModel(_itemPaginationResp.Items));

            return View();
        }

        [HttpGet]
        public ActionResult CartSummary()
        {
            PurchaseOrderSessionModel _purchaseOrderSessionModel = HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel");

            return Json(new CartSummaryModel()
            {
                Quantity = _purchaseOrderSessionModel.LineItems.Sum(lineItem => lineItem.Quantity).ToString("N0"),
                SubTotal = $"{ ControllerHelper.EnumHelper.GetEnumDescription(ControllerHelper.EnumHelper.CurrencyCode.Code)} {_purchaseOrderSessionModel.LineItems.Sum(lineItem => lineItem.SubTotal):N}"
            });
        }

        [HttpGet]
        public async Task<ActionResult> GetMoreItemsByCriteria(int skip)
        {
            ItemPaginationResp _itemPaginationResp = await BETECommerceClientBLL.ItemHelper.GetItemsByCriteria(new GetItemsByCriteriaReq()
            {
                ItemDescription = HttpContext.Session.GetString("ItemDescription"),
                Skip = skip
            });

            await ControllerHelper.ItemHelper.CreateItemPictureFromBase64String(_webHostEnvironment, _itemPaginationResp.Items);

            return PartialView("ItemGrid", ControllerHelper.ItemHelper.FillItemGridModel(_itemPaginationResp.Items));
        }

        public ActionResult SearchItem()
        {
            return PartialView();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SearchItem(SearchItemModel model)
        {
            ItemPaginationResp _itemPaginationResp = await BETECommerceClientBLL.ItemHelper.GetItemsByCriteria(new GetItemsByCriteriaReq()
            {
                ItemDescription = model.ItemDescription
            });

            await ControllerHelper.ItemHelper.CreateItemPictureFromBase64String(_webHostEnvironment, _itemPaginationResp.Items);

            if (!_itemPaginationResp.Items.Any())
                ViewBag.GridViewMessage = "Items not found...";

            if (model.ItemDescription != null)
                HttpContext.Session.SetString("ItemDescription", model.ItemDescription);
            else
                HttpContext.Session.Remove("ItemDescription");

            await ControllerHelper.ItemHelper.CreateItemPictureFromBase64String(_webHostEnvironment, _itemPaginationResp.Items);

            return PartialView("SubItemGrid", ControllerHelper.ItemHelper.FillItemGridModel(_itemPaginationResp.Items));
        }

        [HttpGet]
        public ActionResult Welcome()
        {
            return PartialView("_Welcome");
        }

        [HttpPost]
        public void BuyNow(Guid itemDetailId)
        {
            HttpContext.Session.SetString("ApplicationValue", itemDetailId.ToString());
        }

        [HttpGet]
        public async Task<ActionResult> AddToCart()
        {
            if (Guid.TryParse(HttpContext.Session.GetString("ApplicationValue"), out Guid itemDetailId))
            {
                ItemResp _itemResp = await BETECommerceClientBLL.ItemHelper.GetItemByItemDetailId(itemDetailId);

                if (_itemResp != null)
                {
                    return View(ControllerHelper.ItemHelper.FillAddToCartModel(_itemResp));
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        [NonAction]
        private void AddLineItemToPurchaseOrder(AddToCartModel model)
        {
            model.ItemDetailId = Guid.Parse(HttpContext.Session.GetString("ApplicationValue"));

            PurchaseOrderSessionModel _purchaseOrderSessionModel = HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel");

            LineItemGridSessionModel _lineItemGridSessionModel =
            HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel").LineItems.
            Where(li => li.ItemDetailId == model.ItemDetailId).
            FirstOrDefault();

            if (_lineItemGridSessionModel is null)
            {
                _purchaseOrderSessionModel.LineItems.Add(ControllerHelper.ItemHelper.FillLineItemGridSessionModel(model));

                HttpContext.Session.Set("PurchaseOrderSessionModel", _purchaseOrderSessionModel);
            }
            else
            {
                List<LineItemGridSessionModel> _listLineItemGridSessionModel = new();

                foreach (var item in _purchaseOrderSessionModel.LineItems)
                {
                    if (!ControllerHelper.ItemHelper.IsLineItemAddedToCart(_lineItemGridSessionModel, item))
                    {
                        _listLineItemGridSessionModel.Add(item);
                    }
                }

                ControllerHelper.ItemHelper.UpdateAddToCartLineItemGridSessionModel(_lineItemGridSessionModel, model.Quantity);
                _listLineItemGridSessionModel.Add(_lineItemGridSessionModel);

                _purchaseOrderSessionModel.LineItems.Clear();
                _purchaseOrderSessionModel.LineItems.AddRange(_listLineItemGridSessionModel);

                HttpContext.Session.Set("PurchaseOrderSessionModel", _purchaseOrderSessionModel);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddToCart(AddToCartModel model)
        {
            AddLineItemToPurchaseOrder(model);

            return Json(new
            {
                RedirectToUrl = Url.Action("Index", "OnlineStore")
            });
        }

        [HttpGet]
        public ActionResult ItemPicturePopup(string picturePath)
        {
            return PartialView(new ItemImageModel() { ImagePath = picturePath });
        }

        [HttpGet]
        public ActionResult ViewCart()
        {
            ViewEditCartModel _model = new();
            _model.LineItems.AddRange(HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel").LineItems);

            return PartialView(_model);
        }

        [HttpPost]
        public ActionResult UpdateItemQuantity(Guid itemDetailId, int quantity)
        {
            PurchaseOrderSessionModel _purchaseOrderSessionModel = HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel");

            if (quantity <= 0)
            {
                _purchaseOrderSessionModel.LineItems.Remove(_purchaseOrderSessionModel.LineItems.
                Where(lineItem => lineItem.ItemDetailId == itemDetailId).
                FirstOrDefault());
            }
            else
            {
                List<LineItemGridSessionModel> _lineItemGridSessionModels = new();

                LineItemGridSessionModel _lineItemGridSessionModel = _purchaseOrderSessionModel.LineItems.
                Where(lineItem => lineItem.ItemDetailId == itemDetailId).
                FirstOrDefault();

                ControllerHelper.ItemHelper.UpdateLineItemGridSessionModel(_lineItemGridSessionModel, quantity);

                _lineItemGridSessionModels.Add(_lineItemGridSessionModel);

                foreach (var lineItem in _purchaseOrderSessionModel.LineItems)
                {
                    if (!ControllerHelper.ItemHelper.IsLineItemAddedToCart(_lineItemGridSessionModel, lineItem))
                    {
                        _lineItemGridSessionModels.Add(lineItem);
                    }
                }

                _purchaseOrderSessionModel.LineItems.Clear();

                _purchaseOrderSessionModel.LineItems.AddRange(_lineItemGridSessionModels);
            }

            if (!_purchaseOrderSessionModel.LineItems.Any())
                ViewBag.GridViewMessage = "Your Cart is empty";

            HttpContext.Session.Set("PurchaseOrderSessionModel", _purchaseOrderSessionModel);

            return PartialView("LineItemGrid", _purchaseOrderSessionModel.LineItems.OrderBy(lineItem => lineItem.ItemDescription).ToList());
        }

        [HttpGet]
        public ActionResult ShouldAuthenticateCustomer()
        {
            if (string.IsNullOrWhiteSpace(GetUsernameFromSession))
                return RedirectToAction("CustomerAuthentication");
            else
                return RedirectToAction("PurchaseOrderConfirmation");
        }

        public ActionResult CustomerAuthentication()
        {
            return View();
        }

        [NonAction]
        private async Task<PurchaseOrderResp> CreatePurchaseOrder()
        {
            List<LineItemReq> _lineItems = new();

            foreach (var item in HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel").LineItems)
            {
                _lineItems.Add(new LineItemReq()
                {
                    ItemDetailId = item.ItemDetailId,
                    PictureFileName = item.PictureFileName,
                    Quantity = item.Quantity,
                    SalePrice = item.SalePrice,
                    PercentageDiscount = item.PercentageDiscount
                });
            }

            return await BETECommerceClientBLL.PurchaseOrderHelper.CreatePurchaseOrder(GetUsernameFromSession, _lineItems);
        }

        [HttpGet]
        public async Task<ActionResult> PurchaseOrderConfirmation()
        {
            PurchaseOrderResp _purchaseOrderResp = await CreatePurchaseOrder();

            PurchaseOrderSessionModel _purchaseOrderSessionModel = HttpContext.Session.Get<PurchaseOrderSessionModel>("PurchaseOrderSessionModel");
            _purchaseOrderSessionModel.PurchaseOrderId = _purchaseOrderResp.PurchaseOrderId;
            _purchaseOrderSessionModel.PurchaseOrderNumber = _purchaseOrderResp.PurchaseOrderNumber;
            _purchaseOrderSessionModel.PaymentStatus = _purchaseOrderResp.PaymentStatus;
            _purchaseOrderSessionModel.ShippingStatus = _purchaseOrderResp.ShippingStatus;
            _purchaseOrderSessionModel.PurchaseOrderDate = _purchaseOrderResp.CreationDate;

            PurchaseOrderReportModel _purchaseOrderReportModel = ControllerHelper.ReportingHelper.FillPurchaseOrderReportModel(GetUsernameFromSession, _configuration, _purchaseOrderSessionModel);
            string _fileName = ControllerHelper.GeneratePdfFile(_webHostEnvironment, "purchaseOrders", await this.RenderViewAsync("_PurchaseOrderPdf", _purchaseOrderReportModel, true));

            ViewBag.Title = "THANK YOU FOR SHOPPING WITH US";
            ViewBag.ShipToEmailAddress = _purchaseOrderReportModel.ShipToEmailAddress;
            ViewBag.EmailBody = $"Your order has been placed successful.\n\nPLEASE USE PURCHASE ORDER NUMBER AS YOUR REFERENCE WHEN MAKING PAYMENT, EMAIL AN OFFICIAL PROOF OF PAYMENT WITHIN 24 HOURS TO {_configuration["CompanyInformation:CompanyEmailAddress"].ToUpper()}. EMAILING YOUR PROOF OF PAYMENT FROM INTERNET BANKING DIRECTLY WILL SPEED UP YOUR PURCHASE ORDER SHIPPING. THANK YOU.\n\nPlease find attached your Purchase Order.\n";

            string _htmlMailBody = await this.RenderViewAsync("_EmailPurchaseOrder", null);

            List<string> _emailAddressTo = new() { _purchaseOrderReportModel.ShipToEmailAddress };
            List<string> _attachemts = new() { Path.Combine(_webHostEnvironment.WebRootPath, "purchaseOrders", _fileName) };

            PurchaseOrderConfirmationModel _purchaseOrderConfirmationModel = new() 
            {
                AccountName = _configuration["CompanyInformation:AccountName"],
                AccountNumber = _configuration["CompanyInformation:AccountNumber"],
                BankName = _configuration["CompanyInformation:BankName"],
                BranchCode = _configuration["CompanyInformation:BranchCode"],
                BranchName = _configuration["CompanyInformation:BranchName"],
                AmountDue = _purchaseOrderSessionModel.SubTotal,
                PurchaseOrderNumber = _purchaseOrderSessionModel.PurchaseOrderNumber
            };

            InitialisePurchaseOrderSessionModel();

            BETECommerceClientBLL.SendEmailHelper.
            SendEmail(_emailAddressTo, $"{_configuration["CompanyInformation:CompanyName"]} - Purchase Order Placed Successful",
            _htmlMailBody, _attachemts, new List<LinkedResource>());

            return View(_purchaseOrderConfirmationModel);
        }
    }
}
