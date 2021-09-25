namespace BETECommerceClient.BLL.DataContract
{
    public class GetItemsByCriteriaReq
    {
        public string ItemDescription { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
