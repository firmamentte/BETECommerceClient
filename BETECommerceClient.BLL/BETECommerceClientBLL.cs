using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Threading.Tasks;
using BETECommerceClient.BLL.DataContract;
using Microsoft.Extensions.Configuration;

namespace BETECommerceClient.BLL
{
    public static class BETECommerceClientBLL
    {
        private static MediaTypeWithQualityHeaderValue MediaTypeWithQualityHeaderValue
        {
            get
            {
                return new MediaTypeWithQualityHeaderValue("application/json");
            }
        }

        private static string AccessToken { get; set; }

        private static string AddressSendFrom { get; set; }

        private static string AddressSendFromPassword { get; set; }

        private static string EmailClientHost { get; set; }

        private static int? SendEmailPort { get; set; }

        private static string BETECommerceAPIBaseAddress { get; set; }

        private static IHttpClientFactory HttpClientFactory { get; set; }

        public static void InitializeAppSettings(IConfiguration configuration)
        {
            try
            {
                BETECommerceAPIBaseAddress ??= configuration["AppSettings:Urls:BETECommerceAPIBaseAddress"];
                AccessToken ??= configuration["AppSettings:ApiKeys:AccessToken"];
                AddressSendFrom ??= configuration["AppSettings:AddressSendFrom"];
                AddressSendFromPassword ??= configuration["AppSettings:Passwords:AddressSendFromPassword"];
                EmailClientHost ??= configuration["AppSettings:Urls:EmailClientHost"];
                SendEmailPort ??= Convert.ToInt32(configuration["AppSettings:Ports:SendEmailPort"]);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static void InitializeHttpClientFactory(IHttpClientFactory httpClientFactory)
        {
            try
            {
                HttpClientFactory ??= httpClientFactory;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string ConstructClientError(ApiErrorResp apiErrorResp)
        {
            try
            {
                int _counter = apiErrorResp.Errors.Count();
                string _errorMessage = "\n";

                foreach (string error in apiErrorResp.Errors)
                {
                    if (_counter > 1)
                        _errorMessage += $"→ {error}.\n";
                    else
                        _errorMessage += $"{error}.\n";
                }

                return _errorMessage;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private static HttpClient CreateHttpClient()
        {
            try
            {
                HttpClient _httpClient = HttpClientFactory.CreateClient();
                _httpClient.BaseAddress = new Uri(BETECommerceAPIBaseAddress);
                _httpClient.Timeout = TimeSpan.FromMilliseconds(-1);
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Accept.Add(MediaTypeWithQualityHeaderValue);
                _httpClient.DefaultRequestHeaders.Add("AccessToken", AccessToken);

                return _httpClient;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static class SendEmailHelper
        {
            public static void SendEmail(List<string> emailAddressTo, string subject, string htmlMailBody, List<string> attachemts, List<LinkedResource> listLinkedResources)
            {
                try
                {
                    FirmamentUtilities.Utilities.EmailHelper.SendEmail
                    (emailAddressTo, AddressSendFrom, AddressSendFromPassword, EmailClientHost, (int)SendEmailPort, false, false, subject, htmlMailBody, attachemts, listLinkedResources);
                }
                catch (SmtpException)
                {
                    throw;
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public static class ApplicationUserHelper
        {
            public static async Task SignUp(SignUpReq signUpReq)
            {
                try
                {
                    HttpClient _httpClient = CreateHttpClient();
                    _httpClient.DefaultRequestHeaders.Add("EmailAddress", signUpReq.EmailAddress);
                    _httpClient.DefaultRequestHeaders.Add("UserPassword", signUpReq.UserPassword);

                    using HttpResponseMessage _httpResponseMessage = await _httpClient.PostAsJsonAsync("api/ApplicationUser/V1/SignUp", string.Empty);

                    if (!_httpResponseMessage.IsSuccessStatusCode)
                        throw new Exception(ConstructClientError(await _httpResponseMessage.Content.ReadAsAsync<ApiErrorResp>()));
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static async Task SignIn(SignInReq signInReq)
            {
                try
                {
                    HttpClient _httpClient = CreateHttpClient();
                    _httpClient.DefaultRequestHeaders.Add("EmailAddress", signInReq.EmailAddress);
                    _httpClient.DefaultRequestHeaders.Add("UserPassword", signInReq.UserPassword);

                    using HttpResponseMessage _httpResponseMessage = await _httpClient.PostAsJsonAsync("api/ApplicationUser/V1/SignIn", string.Empty);

                    if (!_httpResponseMessage.IsSuccessStatusCode)
                        throw new Exception(ConstructClientError(await _httpResponseMessage.Content.ReadAsAsync<ApiErrorResp>()));
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public static class ItemHelper
        {
            public static async Task<ItemResp> GetItemByItemDetailId(Guid itemDetailId)
            {
                try
                {
                    string _parameters = "?itemDetailId=" + itemDetailId;

                    using HttpResponseMessage _httpResponseMessage = await CreateHttpClient().GetAsync($"api/Item/V1/GetItemByItemDetailId{_parameters}");

                    if (!_httpResponseMessage.IsSuccessStatusCode)
                        throw new Exception(ConstructClientError(await _httpResponseMessage.Content.ReadAsAsync<ApiErrorResp>()));

                    return await _httpResponseMessage.Content.ReadAsAsync<ItemResp>();
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static async Task<ItemPaginationResp> GetItemsByCriteria(GetItemsByCriteriaReq getItemsByCriteriaReq)
            {
                try
                {
                    string _parameters = "?itemDescription=" + getItemsByCriteriaReq.ItemDescription +
                                         "&skip=" + getItemsByCriteriaReq.Skip;

                    using HttpResponseMessage _httpResponseMessage = await CreateHttpClient().GetAsync($"api/Item/V1/GetItemsByCriteria{_parameters}");

                    if (!_httpResponseMessage.IsSuccessStatusCode)
                        throw new Exception(ConstructClientError(await _httpResponseMessage.Content.ReadAsAsync<ApiErrorResp>()));

                    return await _httpResponseMessage.Content.ReadAsAsync<ItemPaginationResp>();
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public static class PurchaseOrderHelper
        {
            public static async Task<PurchaseOrderResp> CreatePurchaseOrder(string emailAddress, List<LineItemReq> lineItemReqs)
            {
                try
                {
                    HttpClient _httpClient = CreateHttpClient();
                    _httpClient.DefaultRequestHeaders.Add("EmailAddress", emailAddress);

                    using HttpResponseMessage _httpResponseMessage = await _httpClient.PostAsJsonAsync("api/PurchaseOrder/V1/CreatePurchaseOrder", lineItemReqs);

                    if (!_httpResponseMessage.IsSuccessStatusCode)
                        throw new Exception(ConstructClientError(await _httpResponseMessage.Content.ReadAsAsync<ApiErrorResp>()));

                    return await _httpResponseMessage.Content.ReadAsAsync<PurchaseOrderResp>();
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }
    }
}
