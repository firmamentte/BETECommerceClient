
using System.Text.Json;

namespace Microsoft.AspNetCore.Http
{
    public static class SessionExtensions
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonSerializer.Serialize(value));
        }

        public static T Get<T>(this ISession session, string key)
        {
            var _value = session.GetString(key);
            return _value == null ? default : JsonSerializer.Deserialize<T>(_value);
        }
    }
}
