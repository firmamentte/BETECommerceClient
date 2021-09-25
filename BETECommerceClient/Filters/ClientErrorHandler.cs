using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BETECommerceClient.Filters
{
    public class ClientErrorHandler : IAsyncExceptionFilter
    {
        public async Task OnExceptionAsync(ExceptionContext filterContext)
        {
            var response = filterContext.HttpContext.Response;
            response.StatusCode = 500;
            response.ContentType = MediaTypeNames.Text.Plain;
            await response.WriteAsync(filterContext.Exception.Message.Replace("\n", "<br />"));
            filterContext.ExceptionHandled = true;
        }
    }
}
