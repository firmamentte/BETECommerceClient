using System;

namespace BETECommerceClient.BLL.DataContract
{
    public class LineItemReq
    {
        public Guid ItemDetailId { get; set; }
        public string PictureFileName { get; set; }
        public int Quantity { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PercentageDiscount { get; set; }
    }
}
