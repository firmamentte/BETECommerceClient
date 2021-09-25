using System;

namespace BETECommerceClient.BLL.DataContract
{
    public class PurchaseOrderResp
    {
        public Guid PurchaseOrderId { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string PaymentStatus { get; set; }
        public string ShippingStatus { get; set; }
        public decimal AmountDue { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
