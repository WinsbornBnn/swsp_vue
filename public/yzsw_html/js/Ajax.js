function getQueryVariable (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

const ajax = (options) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: options.url,
      type: options.methods || 'get',
      data: options.data || {},
      dataType:'json',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success: res => {
        resolve(res);
      },
      error: err => {
        reject(err);
      }
    })
  })
}
<<<<<<< .mine
const BaseUrl = 'http://192.168.2.13:8080/swsp/'
||||||| .r68
const BaseUrl = 'http://127.0.0.1:8080/swsp/'
=======
const BaseUrl = 'http://219.142.250.239:8089/swsp/'
>>>>>>> .r70
const getList = (url, params) => {
  const token = getQueryVariable('token');
  var data = "";
  $.ajax({
    type: "get",
    url: BaseUrl + url,
    data: params,
    async: false,
    headers: {
      'X-Access-Token': token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    success: res => {
      data = res.result;
    },
    error: err => {
      console.log(err);
    }
  })
  return data;
}