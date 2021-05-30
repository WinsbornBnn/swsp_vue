(() => {
  const show = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate();
    day = day < 10 ? "0" + day : day;
    var week = date.getDay();
    week = "日一二三四五六".charAt(week);
    week = "星期" + week;
    var hour = date.getHours();
    hour = hour < 10 ? "0" + hour : hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? "0" + second : second;
    const Time = `${year}.${month}.${day} ${week} ${hour}:${minute}:${second}`
    $(".time").html(Time)
  }
  setInterval(() => {
    show();
  }, 1000);
})()