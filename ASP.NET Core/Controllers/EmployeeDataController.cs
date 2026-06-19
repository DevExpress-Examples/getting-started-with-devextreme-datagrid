using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace ASP_NET_Core.Controllers;

public class EmployeeDataController : Controller {

    [HttpGet]
    public object Get(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(EmployeeData.Employees, loadOptions);
    }

}
