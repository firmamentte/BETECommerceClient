using System;

namespace BETECommerceClient.Models.OnlineStore
{
    public class AddToCartModel
    {
        public Guid ItemDetailId { get; set; }
        public string ItemDescription { get; set; }
        public int Quantity { get; set; }
        public decimal CurrentSalePrice { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PercentageDiscount { get; set; }
        public string PictureFileName { get; set; }
    }
}
