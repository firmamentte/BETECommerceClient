using System;

namespace BETECommerceClient.Models.OnlineStore
{
    public class EditCartItemModel
    {
        public string PictureFileName { get; set; }
        public Guid ItemDetailId { get; set; }
        public string ItemDescription { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PercentageDiscount { get; set; }
        public int Quantity { get; set; }

        public decimal Discount
        {
            get
            {
                return SalePrice * (PercentageDiscount / 100M);
            }
        }

        public decimal CurrentSalePrice
        {
            get
            {
                return SalePrice - Discount;
            }
        }
    }

}
