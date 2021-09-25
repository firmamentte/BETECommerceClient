namespace BETECommerceClient.Models.OnlineStore
{
    public class PurchaseOrderConfirmationModel
    {
        public string PurchaseOrderNumber { get; set; }
        public decimal AmountDue { get; set; }
        public string AccountName { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string BranchName { get; set; }
        public string BranchCode { get; set; }
    }
}