using System;

namespace BETECommerceClient.BLL.DataContract
{
    public class ItemResp
    {
        public Guid ItemDetailId { get; set; }
        public string ItemDescription { get; set; }
        public ItemPictureResp ItemPicture { get; set; }
        public decimal CurrentSalePrice { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PercentageDiscount { get; set; }
        public bool IsOnSale { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
