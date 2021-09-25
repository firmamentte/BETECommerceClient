using System.Collections.Generic;

namespace BETECommerceClient.BLL.DataContract
{
    public class ItemPaginationResp
    {
        public PaginationMeta Meta { get; set; }
        public List<ItemResp> Items { get; set; } = new List<ItemResp>();
    }
}
