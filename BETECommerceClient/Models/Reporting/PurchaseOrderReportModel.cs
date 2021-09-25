using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BETECommerceClient.Models.Reporting
{
    public class PurchaseOrderReportModel
    {
        public string CompanyName { get; set; }
        public string RegistrationNumber { get; set; }
        public string VATNumber { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyTelephoneNumber { get; set; }
        public string CompanyMobileNumber { get; set; }
        public string CompanyFaxNumber { get; set; }
        public string CompanyEmailAddress { get; set; }
        public string CompanyWebsiteAddress { get; set; }
        public string ShipToEmailAddress { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public DateTime PurchaseOrderDate { get; set; }
        public string PaymentStatus { get; set; }
        public string ShippingStatus { get; set; }
        public decimal AmountDue { get; set; }
        public string BankName { get; set; }
        public string AccountName { get; set; }
        public string AccountNumber { get; set; }
        public string BranchName { get; set; }
        public string BranchCode { get; set; }
        public List<PurchaseOrderLineItemModel> LineItems { get; set; } = new List<PurchaseOrderLineItemModel>();
    }

}
