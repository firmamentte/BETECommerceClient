using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using BETECommerceClient.BLL.DataContract;
using BETECommerceClient.Models.OnlineStore;
using BETECommerceClient.Models.Reporting;
using BETECommerceClient.Models.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using SelectPdf;

namespace BETECommerceClient.Controllers
{
    public class ControllerHelper
    {
        public static class EnumHelper
        {
            public enum CurrencyCode
            {
                [Description("ZAR")]
                Code
            }

            public enum ItemPicturePlaceHolder
            {
                [Description("ItemPicturePlaceHolder.jpg")]
                PicturePlaceHolder
            }
            public static string GetEnumDescription(Enum enumValue)
            {
                return FirmamentUtilities.Utilities.GetEnumDescription(enumValue);
            }

            public enum MessageSymbol
            {
                [Description("i")]
                Information,
                [Description("x")]
                Error
            }
        }

        public static string GeneratePdfFile
        (IWebHostEnvironment webHostEnvironment, string webRootFolderName, string htmlString, PdfPageOrientation pdfPageOrientation = PdfPageOrientation.Portrait)
        {
            try
            {
                string _fileName = $"{Guid.NewGuid().ToString().Replace("-", "")}.pdf";

                HtmlToPdf _converter = new();
                _converter.Options.MarginTop = 20;
                _converter.Options.MarginRight = 20;
                _converter.Options.MarginBottom = 20;
                _converter.Options.MarginLeft = 20;
                _converter.Options.EmbedFonts = true;
                _converter.Options.KeepImagesTogether = true;
                _converter.Options.PdfPageOrientation = pdfPageOrientation;

                PdfDocument _doc = _converter.ConvertHtmlString(htmlString);
                _doc.Save(Path.Combine(webHostEnvironment.WebRootPath, webRootFolderName, _fileName));
                _doc.Close();

                return _fileName;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static class ItemHelper
        {
            public static async Task CreateItemPictureFromBase64String(IWebHostEnvironment webHostEnvironment, ItemResp itemResp)
            {
                try
                {
                    await CreateItemPictureFromBase64String(webHostEnvironment, itemResp.ItemPicture.PictureFileName, itemResp.ItemPicture.PictureBase64String);
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static async Task CreateItemPictureFromBase64String(IWebHostEnvironment webHostEnvironment, List<ItemResp> ItemResps)
            {
                try
                {
                    foreach (var itemResp in ItemResps)
                    {
                        await CreateItemPictureFromBase64String(webHostEnvironment, itemResp);
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            private static async Task CreateItemPictureFromBase64String(IWebHostEnvironment webHostEnvironment, string pictureName, string pictureBase64String)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(pictureName) && !string.IsNullOrWhiteSpace(pictureBase64String))
                    {
                        string _path = Path.Combine(webHostEnvironment.WebRootPath, "itemPictures", pictureName);

                        if (!File.Exists(_path))
                        {
                            await File.WriteAllBytesAsync(_path, Convert.FromBase64String(pictureBase64String));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static List<ItemGridModel> FillItemGridModel(List<ItemResp> listItemResps)
            {
                try
                {
                    listItemResps ??= new();

                    List<ItemGridModel> _listItemModel = new();

                    foreach (var _itemResp in listItemResps.OrderBy(item => item.ItemDescription))
                    {
                        _listItemModel.Add(new ItemGridModel()
                        {
                            CurrentSalePrice = _itemResp.CurrentSalePrice,
                            IsOnSale = _itemResp.IsOnSale,
                            ItemDescription = _itemResp.ItemDescription,
                            ItemDetailId = _itemResp.ItemDetailId,
                            PictureFileName = string.Format("/itemPictures/{0}", _itemResp.ItemPicture.PictureFileName),
                            SalePrice = _itemResp.SalePrice,
                            PercentageDiscount = _itemResp.PercentageDiscount
                        });
                    }

                    return _listItemModel;
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static ViewEditCartModel FillViewEditCartModel(List<LineItemGridSessionModel> listLineItemGridSessionModels)
            {
                try
                {
                    if (listLineItemGridSessionModels is null)
                        listLineItemGridSessionModels ??= new();

                    ViewEditCartModel _model = new()
                    {
                        LineItems = new List<LineItemGridSessionModel>()
                    };

                    _model.LineItems.AddRange(listLineItemGridSessionModels.OrderBy(lineItem => lineItem.ItemDescription));

                    return _model;
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static AddToCartModel FillAddToCartModel(ItemResp itemResp)
            {
                try
                {
                    if (itemResp is null)
                        return null;

                    return new AddToCartModel()
                    {
                        ItemDescription = itemResp.ItemDescription,
                        ItemDetailId = itemResp.ItemDetailId,
                        CurrentSalePrice = itemResp.CurrentSalePrice,
                        SalePrice = itemResp.SalePrice,
                        PercentageDiscount = itemResp.PercentageDiscount,
                        PictureFileName = string.Format("/itemPictures/{0}", itemResp.ItemPicture.PictureFileName)
                    };
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static LineItemGridSessionModel FillLineItemGridSessionModel(AddToCartModel model)
            {
                try
                {
                    return new LineItemGridSessionModel()
                    {
                        PictureFileName = model.PictureFileName,
                        ItemDescription = model.ItemDescription,
                        ItemDetailId = model.ItemDetailId,
                        PercentageDiscount = model.PercentageDiscount,
                        Quantity = model.Quantity,
                        SalePrice = model.SalePrice
                    };
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static void UpdateLineItemGridSessionModel(LineItemGridSessionModel model, int quantity)
            {
                try
                {
                    model.Quantity = quantity;
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static void UpdateAddToCartLineItemGridSessionModel(LineItemGridSessionModel model, int quantity)
            {
                try
                {
                    model.Quantity += quantity;
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static EditCartItemModel FillEditCartItemModel(LineItemGridSessionModel model)
            {
                try
                {
                    return new EditCartItemModel()
                    {
                        PictureFileName = model.PictureFileName,
                        ItemDetailId = model.ItemDetailId,
                        ItemDescription = model.ItemDescription,
                        PercentageDiscount = model.PercentageDiscount,
                        Quantity = model.Quantity,
                        SalePrice = model.SalePrice,
                    };
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static bool IsLineItemAddedToCart(LineItemGridSessionModel lineItemGridSessionModel1, LineItemGridSessionModel lineItemGridSessionModel2)
            {
                try
                {
                    return lineItemGridSessionModel1.ItemDetailId == lineItemGridSessionModel2.ItemDetailId;
                }
                catch (Exception)
                {

                    throw;
                }
            }

        }

        public static class ReportingHelper
        {
            public static PurchaseOrderReportModel FillPurchaseOrderReportModel(string username, IConfiguration configuration, PurchaseOrderSessionModel purchaseOrderSessionModel)
            {
                try
                {
                    PurchaseOrderReportModel _purchaseOrderReportModel = new()
                    {
                        AccountName = configuration["CompanyInformation:AccountName"],
                        AccountNumber = configuration["CompanyInformation:AccountNumber"],
                        BankName = configuration["CompanyInformation:BankName"],
                        BranchCode = configuration["CompanyInformation:BranchCode"],
                        BranchName = configuration["CompanyInformation:BranchName"],
                        CompanyName = configuration["CompanyInformation:CompanyName"],
                        RegistrationNumber = configuration["CompanyInformation:RegistrationNumber"],
                        VATNumber = configuration["CompanyInformation:VATNumber"],
                        CompanyAddress = configuration["CompanyInformation:CompanyAddress"],
                        CompanyEmailAddress = configuration["CompanyInformation:CompanyEmailAddress"],
                        CompanyFaxNumber = configuration["CompanyInformation:CompanyFaxNumber"],
                        CompanyMobileNumber = configuration["CompanyInformation:CompanyMobileNumber"],
                        CompanyTelephoneNumber = configuration["CompanyInformation:CompanyTelephoneNumber"],
                        CompanyWebsiteAddress = configuration["CompanyInformation:CompanyWebsiteAddress"],
                        ShipToEmailAddress = username,
                        PurchaseOrderDate = purchaseOrderSessionModel.PurchaseOrderDate,
                        PurchaseOrderNumber = purchaseOrderSessionModel.PurchaseOrderNumber,
                        PaymentStatus = purchaseOrderSessionModel.PaymentStatus,
                        ShippingStatus = purchaseOrderSessionModel.ShippingStatus,
                        AmountDue = purchaseOrderSessionModel.SubTotal
                    };

                    foreach (var lineItem in purchaseOrderSessionModel.LineItems.OrderBy(lineItem => lineItem.Quantity).ThenBy(lineItem => lineItem.ItemDescription))
                    {
                        _purchaseOrderReportModel.LineItems.Add(new PurchaseOrderLineItemModel()
                        {
                            ItemDescription = lineItem.ItemDescription,
                            Quantity = lineItem.Quantity,
                            SalePrice = lineItem.CurrentSalePrice,
                            SubTotal = lineItem.SubTotal
                        });
                    }

                    return _purchaseOrderReportModel;
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public static class SharedHelper
        {
            public static OkModel FillOkModel(string message, EnumHelper.MessageSymbol messageSymbol)
            {
                try
                {
                    return new OkModel() { OkMessage = message, MessageSymbol = EnumHelper.GetEnumDescription(messageSymbol) };
                }
                catch (Exception)
                {
                    throw;
                }
            }

        }
    }
}
