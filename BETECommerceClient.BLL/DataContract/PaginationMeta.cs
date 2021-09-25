namespace BETECommerceClient.BLL.DataContract
{
    public class PaginationMeta
    {
        public string OrderedBy { get; set; }
        public int Taken { get; set; }
        public int NextSkip { get; set; }
    }
}
