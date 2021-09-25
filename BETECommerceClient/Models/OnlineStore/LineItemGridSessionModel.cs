using System;

namespace BETECommerceClient.Models.OnlineStore
{
    public class LineItemGridSessionModel
    {
        public Guid ItemDetailId { get; set; }
        public string PictureFileName { get; set; }
        public int Quantity { get; set; }
        public string ItemDescription { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PercentageDiscount { get; set; }

        public decimal Discount
        {
            get
            {
                return SalePrice * (PercentageDiscount / 100M);
            }
        }

        public virtual decimal CurrentSalePrice
        {
            get
            {
                return SalePrice - Discount;
            }
        }

        public virtual decimal SubTotal
        {
            get
            {
                return CurrentSalePrice * Quantity;
            }
        }
    }
}
