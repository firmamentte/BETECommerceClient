namespace BETECommerceClient.Models.Reporting
{
    public class PurchaseOrderLineItemModel
    {
        public string ItemDescription { get; set; }
        public decimal SalePrice { get; set; }
        public decimal SubTotal { get; set; }
        public int Quantity { get; set; }
    }
}
