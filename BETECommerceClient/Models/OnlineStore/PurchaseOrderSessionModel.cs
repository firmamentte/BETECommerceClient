using System;
using System.Collections.Generic;
using System.Linq;

namespace BETECommerceClient.Models.OnlineStore
{
    public class PurchaseOrderSessionModel
    {
        public PurchaseOrderSessionModel()
        {
        }

        public Guid PurchaseOrderId { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string PaymentStatus { get; set; }
        public string ShippingStatus { get; set; }
        public DateTime PurchaseOrderDate { get; set; }
        public List<LineItemGridSessionModel> LineItems { get; set; }
        public decimal SubTotal
        {
            get
            {
                return LineItems.Sum(lineItem => lineItem.SubTotal);
            }
        }
    }
}
