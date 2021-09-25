using System.Collections.Generic;

namespace BETECommerceClient.Models.OnlineStore
{
    public class ViewEditCartModel
    {
        public List<LineItemGridSessionModel> LineItems { get; set; } = new List<LineItemGridSessionModel>();
    }
}
