layui.use(['layer', 'form', 'dropdown'], () => {
  let layer = layui.layer,
    dropdown = layui.dropdown,
    form = layui.form,
    $ = layui.jquery;
  layer.msg('欢迎来到扬州市节水型社会建设信息化平台');

  form.on('select(selectSearch)', function (obj) {
    var name = obj.elem[obj.value].innerHTML
    let data = getList("industrialEnterprise/industrialEnterprise/queryByName", { name: name });
    if (data.xcoor == undefined) {
      // layer.msg('没有数据');
      map.removeOverlay(pie);
    } else {
      map.getView().animate({ // 只设置需要的属性即可
        center: ol.proj.fromLonLat([data.xcoor, data.ycoor]), // 中心点
        zoom: 15, // 缩放级别
        rotation: undefined, // 缩放完成view视图旋转弧度
        duration: 1000 // 缩放持续时间，默认不需要设置
      })
      name_div_content.innerHTML = data.name;
      var pie = new ol.Overlay({
        position: ol.proj.fromLonLat([data.xcoor, data.ycoor]),
        positioning: 'center-top',
        element: name_div,
      });
      map.addOverlay(pie);

    }
  })

  // 获取所有的单位类型数据
  var pro_gy, pro_xx, pro_jd, pro_dw, pro_xq, pro_gq = null;
  var city_gy, city_xx, city_jd, city_dw, city_xq, city_gq = null;

  let alldata = getList('serviceUnit/serviceUnit/staticZtData', { type: 1 });
  alldata.forEach(item => {
    if (item.dwlx === "工业企业") {
      pro_gy = item.num
    } else if (item.dwlx === "学校") {
      pro_xx = item.num
    } else if (item.dwlx === "节水教育基地") {
      pro_jd = item.num
    } else if (item.dwlx === "单位") {
      pro_dw = item.num
    } else if (item.dwlx === "小区") {
      pro_xq = item.num
    } else if (item.dwlx === "灌区") {
      pro_gq = item.num
    }
  });
  // 获取所有市级类数目
  let allcitynum = getList('serviceUnit/serviceUnit/staticZtData', { type: 2 })
  var citynums;
  allcitynum.forEach(item => {
    if (item.dwlx === "工业企业") {
      city_gy = item.num
    } else if (item.dwlx === "学校") {
      city_xx = item.num
    } else if (item.dwlx === "节水教育基地") {
      city_jd = item.num
    } else if (item.dwlx === "单位") {
      city_dw = item.num
    } else if (item.dwlx === "小区") {
      city_xq = item.num
    } else if (item.dwlx === "灌区") {
      city_gq = item.num
    }
  });
  // 获取所有的单位类型数据
  var pro_num1, pro_num2, pro_num3, pro_num4, pro_num5 = 0;
  var city_num1, city_num2, city_num3, city_num4, city_num5 = 0;
  var value = ['机关', '事业单位', '医院', '宾馆', '其他'];
  // let url = 'serviceUnit/serviceUnit/list';
  const utilsnum = getList('serviceUnit/serviceUnit/staticData', { type: 1 })
  for (let i = 0; i < utilsnum.length; i++) {
    switch (utilsnum[i].dwlx) {
      case '机关':
        pro_num1 = utilsnum[i].num;
        break;
      case '事业单位':
        pro_num2 = utilsnum[i].num;
        break;
      case '医院':
        pro_num3 = utilsnum[i].num;
        break;
      case '宾馆':
        pro_num4 = utilsnum[i].num;
        break;
      case '其他':
        pro_num5 = utilsnum[i].num;
        break;
      default:
        break;
    }
  }

  const city_utilsnum = getList('serviceUnit/serviceUnit/staticData', { type: 2 })
  for (let i = 0; i < city_utilsnum.length; i++) {
    switch (city_utilsnum[i].dwlx) {
      case '机关':
        city_num1 = city_utilsnum[i].num;
        break;
      case '事业单位':
        city_num2 = city_utilsnum[i].num;
        break;
      case '医院':
        city_num3 = city_utilsnum[i].num;
        break;
      case '宾馆':
        city_num4 = city_utilsnum[i].num;
        break;
      case '其他':
        city_num5 = city_utilsnum[i].num;
        break;
      default:
        break;
    }
  }
  // 获取所有技改类数目
  let provincenum, citynum, athernum = null;
  let allnum = getList('industrialEnterprise/industrialEnterprise/countNum', {})
  // allnum.forEach(item => {
  //   if (item.name === '省级载体节水技改') {
  //     provincenum = item.num
  //   } else if (item.name === '市级单位节水技改') {
  //     citynum = item.num
  //   } else {
  //     athernum = item.num
  //   }
  // })
  provincenum = allnum.pro_num;
  citynum = allnum.city_num;
  const pro_children = [{
    title: `机关(${pro_num1}个)`, value: '机关'
    , id: 3
  }, {
    title: `事业单位(${pro_num2}个)`, value: '事业单位'
    , id: 3
  }, {
    title: `医院(${pro_num3}个)`, value: '医院'
    , id: 1
  },
  {
    title: `宾馆(${pro_num4}个)`,
    value: '宾馆',
    id: 6
  },
  {
    title: `其他(${pro_num5}个)`, value: '其他'
    , id: 7
  }];

  const city_children = [{
    title: `机关(${city_num1}个)`, value: '机关_市级'
    , id: 3
  }, {
    title: `事业单位(${city_num2}个)`, value: '事业单位_市级'
    , id: 3
  }, {
    title: `医院(${city_num3}个)`, value: '医院_市级'
    , id: 1
  },
  {
    title: `宾馆(${city_num4}个)`,
    value: '宾馆_市级',
    id: 6
  },
  {
    title: `其他(${city_num5}个)`, value: '其他_市级'
    , id: 7
  }];

  const child_sheng = [{
    title: `工业企业(${pro_gy}个)`, value: '工业企业', id: 8
  },
  {
    title: `单位(${pro_dw}个)`, value: '单位', id: 5, child: pro_children
  }, {
    title: `学校(${pro_xx}个)`, id: 4, value: '学校'
  }, {
    title: `小区（社区）(${pro_xq}个)`, id: 5, value: '小区'
  }, {
    title: `灌区(${pro_gq}个)`, value: '灌区', id: 132
  }, {
    title: `节水教育基地(${pro_jd}个)`, value: '节水教育基地', id: 9
  }];
  const city_sheng = [{
    title: `工业企业(${city_gy}个)`, value: '工业企业_市级', id: 8
  },
  {
    title: `单位(${city_dw}个)`, value: '单位_市级', id: 5, child: city_children
  }, {
    title: `学校(${city_xx}个)`, id: 4, value: '学校_市级'
  }, {
    title: `小区（社区）(${city_xq}个)`, id: 5, value: '小区_市级'
  }, {
    title: `灌区(${city_gq}个)`, value: '灌区_市级', id: 132
  }, {
    title: `节水教育基地(${city_jd}个)`, value: '节水教育基地_市级', id: 9
  }];
  dropdown.render({
    elem: '#select'
    , data: [
      {
        title: '节水型载体',
        value: '节水型载体',
        id: 110,
        child: [
          {
            title: `省级`,
            value: '省级_载体',
            id: 5,
            child: child_sheng
          },
          {
            title: `市级`,
            value: '市级_载体',
            id: 6,
            child: city_sheng
          }
        ]
      },
      {
        title: '节水减排示范项目',
        id: 120, value: '节水减排示范项目',
        child: [
          {
            title: `省级(${provincenum}个)`, value: '省级'
            , id: 50
          }, {
            title: `市级(${citynum}个)`, value: '市级'
            , id: 333
          }
        ]
      }
    ]
    , id: 'select'
    //菜单被点击的事件
    , click: (obj) => {
      let url = 'serviceUnit/serviceUnit/list';
      let type = '';
      let gbdwjb = '省级';
      // 省级无子集
      switch (obj.value) {
        case '工业企业':
          url = 'industrialEnterprise/industrialEnterprise/grouplist';
          removeRandomFeature();
          NoObject(obj, url, gbdwjb);
          break;
        case '学校':
          url = 'serviceUnit/serviceUnit/listsch';
          removeRandomFeature();
          NoObject(obj, url, gbdwjb);
          break;
        case '小区':
          url = 'residentialQuarters/residentialQuarters/list';
          removeRandomFeature();
          NoObject(obj, url, gbdwjb);
          break;
        case '灌区':
          url = 'irrigationArea/irrigationArea/list';
          removeRandomFeature();
          NoObject(obj, url, gbdwjb);
          break;
        case '节水教育基地':
          url = 'serviceUnit/serviceUnit/listjd';
          removeRandomFeature();
          NoObject(obj, url, gbdwjb);
          break;
        default:
          break;
      }
      // 市级无子集
      switch (obj.value) {
        case '工业企业_市级':
          url = 'industrialEnterprise/industrialEnterprise/grouplist';
          removeRandomFeature();
          NoObject(obj, url, "市级");
          break;
        case '学校_市级':
          url = 'serviceUnit/serviceUnit/listsch';
          removeRandomFeature();
          NoObject(obj, url, "市级");
          break;
        case '小区_市级':
          url = 'residentialQuarters/residentialQuarters/list';
          removeRandomFeature();
          NoObject(obj, url, "市级");
          break;
        case '灌区_市级':
          url = 'irrigationArea/irrigationArea/list';
          removeRandomFeature();
          NoObject(obj, url, "市级");
          break;
        case '节水教育基地_市级':
          url = 'serviceUnit/serviceUnit/listjd';
          removeRandomFeature();
          NoObject(obj, url, "市级");
          break;
        default:
          break;
      }
      // 省级有子集
      switch (obj.value) {
        case '机关':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '机关';
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '事业单位':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '单位';
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '医院':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '医院';
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '宾馆':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '宾馆';
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '其他':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '其他';
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        default:
          break;
      }
      // 市级有子集
      switch (obj.value) {
        case '机关_市级':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '机关';
          gbdwjb = "市级";
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '事业单位_市级':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '单位';
          gbdwjb = "市级";
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '医院_市级':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '医院';
          gbdwjb = "市级";
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '宾馆_市级':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '宾馆';
          gbdwjb = "市级";
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        case '其他_市级':
          url = 'serviceUnit/serviceUnit/grouplist';
          type = '其他';
          gbdwjb = "市级";
          removeRandomFeature();
          YesObject(obj, url, type, gbdwjb);
          break;
        default:
          break;
      }
      // 节水减排
      switch (obj.value) {
        case '省级':
          removeRandomFeature();
          allShengImprove();
          break;
        case '市级':
          removeRandomFeature();
          allShiImprove();
          break;
        default:
          break;
      }
    }
  });
  $("#back").on('click', () => {
    const token = getQueryVariable('token');
    window.location.href = './index.html?token=' + token;
  });
  // 点击按钮进入全屏或者退出全屏
  $("#goAll").on('click', () => {
    $("#goAll").css("display", "none");
    $("#exitAll").css("display", "block");
    var docElm = document.documentElement;
    //FireFox
    if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }
    //Chrome等 
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  });
  $("#exitAll").on('click', () => {
    $("#goAll").css("display", "block");
    $("#exitAll").css("display", "none");
    if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  });
  /**
   所有类
   */
  // 有子集菜单类
  function YesObject (obj, url, type, gbdwjb) {
    let data = null;
    data = getList(url, { pageSize: 10000, unit: type, gbdwjb: gbdwjb });
    let axis = [];
    data.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = item.dwmc;
      let dm = item.dm;
      let gb_time = item.gbsj;
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = item.dwdz;
      let location = item.dwszd;
      let design = type;
      let src = ''
      let units = {
        dwlx: item.dwlx,
        ysrs: item.ysrsz ? item.ysrsz : 0,
        sjysl: item.sjysl ? item.sjysl : 0,
        rjysl: item.yslz ? item.yslz : 0,
        cztr: item.cztr ? item.cztr : 0,
        dez: item.dez ? item.dez : 0,
        jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
        xmmc: item.xmmc ? item.xmmc : '暂无',
        ysldw: item.ysldw ? item.ysldw : ' m³/（人·a）',
        ysrsdw: item.ysrsdw ? item.ysrsdw : '人',
        time: gb_time
      };
      switch (obj.value) {
        case '机关':
          src = './icons/danwei.png'
          break;
        case '事业单位':
          src = './icons/danwei.png'
          break;
        case '医院':
          src = './icons/yiyuan.png'
          break;
        case '宾馆':
          src = './icons/binguan.png'
          break;
        case '其他':
          src = './icons/qita.png'
          break;
        default:
          break;
      }
      axis.push({
        zb: [t1, t2],
        Id: id,
        src: src,
        images: images,
        title: title,
        gbdw: gbdw,
        gbdwjb: gbdwjb,
        address: address,
        location: location,
        time: gb_time,
        design: design,
        units: units,
        dm: dm,
        cp: item.cp
      })
    });
    // 设置标识图标
    var scale = 1.5;
    let allObj = [];
    allObj.push({
      axis: axis
    });
    // 将图标放到地图对象
    allObj.forEach(item => {
      addRandomFeature(item.axis, scale);
    });
    // 模糊搜索
    var allSelectArr = allObj[0].axis
    var searchStr = ['<option value="0">直接选择或搜索选择</option>']
    for (let i = 1; i <= allSelectArr.length; i++) {
      searchStr.push(`<option value="${i}" id="select-${i}">${allSelectArr[i - 1].title}</option>`)
    }
    $("#layui-inline").html(searchStr.join())
    layui.form.render('select');
  }
  // 没有子集菜单类
  function NoObject (obj, url, gbdwjb) {
    let data = getList(url, { pageSize: 10000, gbdwjb: gbdwjb });
    let axis = [];
    let allObj = [];
    let dataList = data
    if (url !== 'industrialEnterprise/industrialEnterprise/grouplist') {
      dataList = data.records
    }
    dataList.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = '';
      let src = '';
      let gb_time = item.gbsj;
      let dm = item.dm;
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = '';
      let location = '';
      let design = '';
      let plot = {};
      let company = {};
      let tank = {};
      let units = null;
      switch (obj.value) {
        case '小区':
          title = item.xqmc;
          address = item.xqdz;
          location = item.xqszd;
          design = '小区';
          src = './icons/xiaoqu.png'
          plot = {
            zhrs: item.zhrs ? item.zhrs : 0,
            zhysl: item.zhysl ? item.zhysl : 0,
            rjys: item.rjys ? item.rjys : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            time: gb_time
          };
          break;
        case '工业企业':
          title = item.qymc;
          address = item.qydz;
          location = item.qyszd;
          design = '工业企业';
          src = './icons/qiye.png'
          company = {
            hyfl: item.hyfl,
            zycp: item.zycp,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwcpysdw: item.dwcpysdw ? item.dwcpysdw : 0,
            dwcpys: item.dwcpysz ? item.dwcpysz : 0,
            cflyl: item.cflyl ? item.cflyl : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            time: gb_time
          };
          break;
        case '灌区':
          title = item.gqmc;
          address = item.gqdz;
          location = item.gqszd;
          design = '灌区';
          src = './icons/guanqu.png'
          tank = {
            gqgmlx: item.gqgmlx,
            zyzw: item.zyzw,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwlzss: item.dwmjysl ? item.dwmjysl : 0,
            cztr: item.cztr ? item.cztr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            time: gb_time,
            ggsyxlyxs: item.ggsyxlyxs == null ? '' : item.ggsyxlyxs
          };
          break;
        case '学校':
          title = item.dwmc;
          address = item.dwdz;
          location = item.dwszd;
          design = '学校';
          src = './icons/xuexiao.png'
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m³/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人',
            time: gb_time
          };
          break;
        case '节水教育基地':
          title = item.dwmc;
          address = item.dwdz;
          location = item.dwszd;
          design = '节水教育基地';
          src = './icons/jidi.png'
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m³/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人',
            time: gb_time
          };
          break;
        default:
          break;
      }
      switch (obj.value) {
        case '小区_市级':
          title = item.xqmc;
          address = item.xqdz;
          location = item.xqszd;
          design = '小区';
          src = './icons/xiaoqu.png'
          plot = {
            zhrs: item.zhrs ? item.zhrs : 0,
            zhysl: item.zhysl ? item.zhysl : 0,
            rjys: item.rjys ? item.rjys : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0
          };
          break;
        case '工业企业_市级':
          title = item.qymc;
          address = item.qydz;
          location = item.qyszd;
          design = '工业企业';
          src = './icons/qiye.png'
          company = {
            hyfl: item.hyfl,
            zycp: item.zycp,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwcpysdw: item.dwcpysdw ? item.dwcpysdw : 0,
            dwcpys: item.dwcpysz ? item.dwcpysz : 0,
            cflyl: item.cflyl ? item.cflyl : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
          };
          break;
        case '灌区_市级':
          title = item.gqmc;
          address = item.gqdz;
          location = item.gqszd;
          design = '灌区';
          src = './icons/guanqu.png'
          tank = {
            gqgmlx: item.gqgmlx,
            zyzw: item.zyzw,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwlzss: item.dwmjysl ? item.dwmjysl : 0,
            cztr: item.cztr ? item.cztr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0
          };
          break;
        case '学校_市级':
          title = item.dwmc;
          address = item.dwdz;
          location = item.dwszd;
          design = '学校';
          src = './icons/xuexiao.png'
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m³/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
          };
          break;
        case '节水教育基地_市级':
          title = item.dwmc;
          address = item.dwdz;
          location = item.dwszd;
          design = '节水教育基地';
          src = './icons/jidi.png'
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m³/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
          };
          break;
        default:
          break;
      }
      axis.push({
        zb: [t1, t2],
        Id: id,
        src: src,
        images: images,
        title: title,
        gbdw: gbdw,
        gbdwjb: gbdwjb,
        address: address,
        location: location,
        design: design,
        time: gb_time,
        plot: design = '小区' ? plot : null,
        company: design = '工业企业' ? company : null,
        tank: design = '灌区' ? tank : null,
        units: units,
        dm: dm,
        cp: item.cp
      })
    });
    // 设置标识图标
    var scale = 1.5;
    allObj.push({
      axis: axis
    });
    // 将图标放到地图对象
    allObj.forEach(item => {
      addRandomFeature(item.axis, scale);
    });
    // 模糊搜索
    var allSelectArr = allObj[0].axis
    $("#layui-inline").html('')
    var str = ['<option value="0">直接选择或搜索选择</option>'];
    for (let i = 1; i <= allSelectArr.length; i++) {
      str.push(`<option value="${i}" id="select-${i}">${allSelectArr[i - 1].title}</option>`);
    }
    $("#layui-inline").html(str.join());
    layui.form.render('select');
  }

  /**
   技改类 
   * */
  // 所有省级技改类的数据
  function allShengImprove () {
    let jsxxList = getList('industrialEnterprise/industrialEnterprise/groupjglist', { pageSize: 10000, xmjb: '省级' });
    let t1 = null;
    let t2 = null;
    let axis = [];
    var src = '';
    let allObj = [];
    jsxxList.forEach(item => {
      t1 = item.xcoor ? item.xcoor : null;
      t2 = item.ycoor ? item.ycoor : null;
      src = './icons/sjxx.png';
      plot = item;
      axis.push({
        zb: [t1, t2],
        src: src,
        Id: item.id,
        images: item.images ? item.images : null,
        title: item.qymc,
        gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
        gbdwjb: item.xmjb ? item.xmjb : '省级',
        address: item.qyszd,
        location: item.qydz,
        design: '节水减排示范项目',
        plot: item,
        dm: item.dm,
        cp: item.cp
      });
    });
    // 设置标识图标
    var scale = 1.5;
    allObj.push({
      axis: axis
    });
    // 将图标放到地图对象
    allObj.forEach(item => {
      addRandomFeature(item.axis, scale);
    });
    // 模糊搜索
    var allSelectArr = allObj[0].axis
    var searchStr = ['<option value="0">直接选择或搜索选择</option>']
    for (let i = 1; i <= allSelectArr.length; i++) {
      searchStr.push(`<option value="${i}" id="select-${i}">${allSelectArr[i - 1].title}</option>`)
    }
    $("#layui-inline").html(searchStr.join())
    layui.form.render('select');
  }
  // 所有市级技改类的数据
  function allShiImprove () {
    let jsxxList = getList('industrialEnterprise/industrialEnterprise/listjg', { pageSize: 10000, xmjb: '市级' });
    let axis = [];

    let t1 = null;
    let t2 = null;
    let id = null;
    let images = null;
    let gbdw = '';
    let gbdwjb = '';
    let title = '';
    let address = '';
    let location = '';
    let design = '';
    var plot = {};
    var company = {};
    var tanks = {};
    var units = {};
    var src = '';
    jsxxList.records.forEach(item => {
      t1 = item.xcoor ? item.xcoor : null;
      t2 = item.ycoor ? item.ycoor : null;
      id = item.id;
      images = item.images ? item.images : null;
      gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      gbdwjb = item.xmjb ? item.xmjb : '省级';
      title = item.qymc;
      address = item.qyszd;
      location = item.qydz;
      design = '节水减排示范项目';
      src = './icons/sj_xx.png';

      let plot = {
        zhrs: item.zhrs ? item.zhrs : 0,
        zhysl: item.zhysl ? item.zhysl : 0,
        rjys: item.rjys ? item.rjys : 0,
        xmmc: item.xmmc ? item.xmmc : '暂无',
        jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
        cztr: item.cztr ? item.cztr : 0,
        dez: item.dez ? item.dez : 0
      };
      axis.push({
        zb: [t1, t2],
        src: src,
        Id: id,
        images: images,
        title: title,
        gbdw: gbdw,
        gbdwjb: gbdwjb,
        address: address,
        location: location,
        design: design,
        plot: plot
      });
    });


    let allObj = [];
    // 设置标识图标
    var scale = 1.5;
    allObj.push({
      axis: axis
    });
    // 将图标放到地图对象
    allObj.forEach(item => {
      addRandomFeature(item.axis, scale);
    });

    // 模糊搜索
    var allSelectArr = allObj[0].axis
    var searchStr = ['<option value="0">直接选择或搜索选择</option>']
    for (let i = 1; i <= allSelectArr.length; i++) {
      searchStr.push(`<option value="${i}" id="select-${i}">${allSelectArr[i - 1].title}</option>`)
    }
    $("#layui-inline").html(searchStr.join())
    layui.form.render('select');
  }
  // 创建弹窗
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  // 创建一个覆盖，以锚定弹出到地图
  var overlay = new ol.Overlay({
    element: container,
    //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    autoPan: true,
    autoPanAnimation: {
      //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
      duration: 250,
    }
  });
  map.addOverlay(overlay);
  // 鼠标经过弹窗显示
  map.on('pointermove', (evt) => {
    $("#popup").removeClass('addclass');
    //获取像素区域
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    var flag = false;
    map.forEachFeatureAtPixel(pixel, (feature) => {
      var data = feature.values_;
      if (data.name === 'icon') {
        map.removeOverlay(pie);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        var coodinate = evt.coordinate;
        overlay.setPosition(coodinate);
        //设置弹出框内容，可以HTML自定义
        var dm_url = "./icons/nothing.png";
        if (data.dm != '') {
          var dm_url = BaseUrl + "sys/common/static/" + data.dm;
        }
        if (data.design == "节水减排示范项目") {
          content.innerHTML = `
                   <div class="information">
                    <div> <img src="${dm_url}" style="height:120px; width: 100%"/></div>
                    <div style="margin-left:1.5rem;">基本信息</div>
                    
                    <div>企业名称：${data.title}</div>
                    <div>${data.design}地址：${data.location}</div>
                    <div>${data.design}所在地：${data.address}</div>
                    <div>项目级别：${data.gbdwjb}</div>
                    </div>
                   `;
        } else {

          if (data.time == null || data.time == "null") {
            content.innerHTML = `
                     <div class="information">
                      <div> <img src="${dm_url}" style="height:120px; width: 100%"/></div>
                      <div style="margin-left:1.5rem;">基本信息</div>
                      
                      <div>${data.design}名称：${data.title}</div>
                      <div>${data.design}地址：${data.address}</div>
                      <div>${data.design}所在地：${data.location}</div>
                      <div>公布单位：${data.gbdw}</div>
                      <div>公布单位级别：${data.gbdwjb}</div>
                      </div>
                     `;
          } else {
            content.innerHTML = `
                   <div class="information">
                    <div> <img src="${dm_url}" style="height:120px; width: 100%"/></div>
                    <div style="margin-left:1.5rem;">基本信息</div>
                    
                    <div>${data.design}名称：${data.title}</div>
                    <div>${data.design}地址：${data.address}</div>
                    <div>${data.design}所在地：${data.location}</div>
                    <div>公布单位：${data.gbdw}</div>
                    <div>公布单位级别：${data.gbdwjb}</div>
                    <div>公布时间：${data.time}</div>
                    </div>
                   `;
          }
        }
        flag = true;
      }
    });
    if (flag) {
      //显示overlay
      map.addOverlay(overlay);
    } else
      map.removeOverlay(overlay);
  });

  var name_div = document.getElementById('name_div');

  var name_div_content = document.getElementById('name_div_content');

  var pie = new ol.Overlay({
    element: name_div,
    //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    autoPan: true,
    autoPanAnimation: {
      //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
      duration: 250,
    }
  });


  $('#search').bind('keypress', function (event) {
    if (event.keyCode == "13") {
      let data = getList("industrialEnterprise/industrialEnterprise/queryByName", { name: $("#search").val() });

      if (data.xcoor == undefined) {
        layer.msg('没有数据');
      } else {
        map.getView().animate({ // 只设置需要的属性即可
          center: ol.proj.fromLonLat([data.xcoor, data.ycoor]), // 中心点
          zoom: 15, // 缩放级别
          rotation: undefined, // 缩放完成view视图旋转弧度
          duration: 1000 // 缩放持续时间，默认不需要设置
        })
        pie.setPosition(ol.proj.fromLonLat([data.xcoor, data.ycoor]));
        name_div_content.innerHTML = data.name;
        map.addOverlay(pie);
      }
    }
  });

  $('#search').on('input propertychange', function () {

    let data = getList("industrialEnterprise/industrialEnterprise/queryByName", { name: $("#search").val() });

    if (data.xcoor == undefined) {
      layer.msg('没有数据');
    } else {
      map.getView().animate({ // 只设置需要的属性即可
        center: ol.proj.fromLonLat([data.xcoor, data.ycoor]), // 中心点
        zoom: 15, // 缩放级别
        rotation: undefined, // 缩放完成view视图旋转弧度
        duration: 1000 // 缩放持续时间，默认不需要设置
      })
      pie.setPosition(ol.proj.fromLonLat([data.xcoor, data.ycoor]));
      name_div_content.innerHTML = data.name;
      map.addOverlay(pie);
    }

  });

});


function keyup_submit (e) {
  var evt = window.event || e;
  if (evt.keyCode == 13) {
    let data = getList("industrialEnterprise/industrialEnterprise/queryByName", { name: $("#search").val() });

    if (data.xcoor == undefined) {
      layer.msg('没有数据');
    } else {
      map.getView().animate({ // 只设置需要的属性即可
        center: ol.proj.fromLonLat([data.xcoor, data.ycoor]), // 中心点
        zoom: 15, // 缩放级别
        rotation: undefined, // 缩放完成view视图旋转弧度
        duration: 1000 // 缩放持续时间，默认不需要设置
      })
      var name_div = document.getElementById('name_div');
      var name_div_content = document.getElementById('name_div_content');
      name_div_content.innerHTML = data.name;

      var pie = new ol.Overlay({
        position: ol.proj.fromLonLat([data.xcoor, data.ycoor]),
        autoPan: true,
        autoPanAnimation: {
          //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
          duration: 250,
        },
        positioning: 'top-right'
      });
      map.addOverlay(pie);
    }

  }
}

function myInput () {

  let data = getList("industrialEnterprise/industrialEnterprise/queryByName", { name: $("#search").val() });

  if (data.xcoor == undefined) {
    layer.msg('没有数据');
  } else {
    map.getView().animate({ // 只设置需要的属性即可
      center: ol.proj.fromLonLat([data.xcoor, data.ycoor]), // 中心点
      zoom: 15, // 缩放级别
      rotation: undefined, // 缩放完成view视图旋转弧度
      duration: 1000 // 缩放持续时间，默认不需要设置
    })
    var name_div = document.getElementById('name_div');
    var name_div_content = document.getElementById('name_div_content');
    name_div_content.innerHTML = data.name;
    var pie = new ol.Overlay({
      position: ol.proj.fromLonLat([data.xcoor, data.ycoor]),
      positioning: 'center-top',
      element: name_div,
    });
    map.addOverlay(pie);

  }

}