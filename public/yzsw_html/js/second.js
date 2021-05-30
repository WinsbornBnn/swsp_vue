layui.use(['layer', 'form', 'dropdown'], () => {
  let layer = layui.layer,
    dropdown = layui.dropdown,
    form = layui.form,
    $ = layui.jquery;
    layer.msg('欢迎来到扬州市节水型载体可视化平台');
    // 获取所有节水载体数目
    var allplot, allunits, allcompany, alltanks = null;
    let alldata = getList('industrialEnterprise/industrialEnterprise/staticNum', { type: 1 });
    alldata.forEach(item => {
      if (item.name === "企业") {
        allcompany = item.num
      } else if (item.name === "灌区") {
        alltanks = item.num
      } else if (item.name === "小区") {
        allplot = item.num
      } else {
        allunits = item.num
      }
    });
    // 获取所有的企业数据
    var num1, num2, num3, num4, num5 = null;
    var value = ['机关（单位）', '学校', '医院', '宾馆', '其他'];
    let url = 'serviceUnit/serviceUnit/list';
    for (let i = 0; i < value.length; i++) {
      switch (value[i]) {
        case '机关（单位）':
          let res1 = getList(url, { pageSize: 10000, dwlx: '行政机关' });
          let res2 = getList(url, { pageSize: 10000, dwlx: '事业单位' });
          let res3 = getList(url, { pageSize: 10000, dwlx: '机关' });
          num1 = res1.total + res2.total + res3.total;
          break;
        case '学校':
          let data = getList(url, { pageSize: 10000, dwlx: '学校' });
          num2 = data.total;
          break;
        case '医院':
          let data1 = getList(url, { pageSize: 10000, dwlx: '医院' });
          num3 = data1.total;
          break;
        case '宾馆':
          let data2 = getList(url, { pageSize: 10000, dwlx: '宾馆' });
          num4 = data2.total;
          break;
        case '其他':
          let data3 = getList(url, { pageSize: 10000, dwlx: '其他' });
          num5 = data3.total;
          break;
        default:
          break;
      }
    }
    const children = [{
      title: '全部', value: '全部'
      , id: 3
    }, {
      title: `机关（单位）（${num1}个）`, value: '机关（单位）'
      , id: 3
    }, {
      title: `学校（${num2}个）`, value: '学校'
      , id: 4
    }, {
      title: `医院（${num3}个）`, value: '医院'
      , id: 1
    }, {
      title: `宾馆（${num4}个）`, value: '宾馆'
      , id: 6
    }, {
      title: `其他（${num5}个）`, value: '其他'
      , id: 7
    }];
    // 获取所有市级类数目
    let allcitynum = getList('cityServiceUnit/cityServiceUnit/list', { pageSize: 10000 })
    // 获取所有技改类数目
    let provincenum, citynum, athernum = null;
    let allnum = getList('industrialEnterprise/industrialEnterprise/staticData1', { type: 1 })
    allnum.forEach(item => {
      if (item.name === '省级载体节水技改') {
        provincenum = item.num
      } else if (item.name === '市级单位节水技改') {
        citynum = item.num
      } else {
        athernum = item.num
      }
    })
    dropdown.render({
      elem: '#select'
      , data: [
        {
          title: '节水型载体',
          value: '节水型载体',
          id: 110,
          child: [
            {
              title: `全部节水型载体（${allcompany + alltanks + allplot + allunits + allcitynum.total}个）`,
              value: '全部节水型载体',
              id: 5
            },
            {
              title: `省级节水型小区（${allplot}个）`,
              value: '省级节水型小区',
              id: 5
            }, {
              title: `省级节水型单位（${allunits}个）`,
              id: 33,
              value: '省级节水型单位',
              child: children
            }, {
              title: `省级节水型工业企业（${allcompany}个）`,
              id: 8,
              value: '省级节水型工业企业'
            }, {
              title: `省级节水型灌区（${alltanks}个）`, value: '省级节水型灌区'
              , id: 132
            }, {
              title: `市级节水型单位（${allcitynum.total}个）`, value: '市级节水型单位'
              , id: 2
            }
          ]
        },
        {
          title: '节水技改类项目',
          id: 120, value: '节水技改类项目',
          child: [
            {
              title: `全部技改项目（${provincenum + citynum + athernum}个）`, value: '全部技改项目'
              , id: 50
            }, {
              title: `省级载体中的技改项目（${provincenum}个）`, value: '省级载体中的技改项目'
              , id: 333
            }, {
              title: `市级载体中的技改项目（${citynum}个）`, value: '市级载体中的技改项目'
              , id: 83
            }, {
              title: `其他技改项目（${athernum}个）`, value: '其他技改项目'
              , id: 23
            }
          ]
        }
      ]
      , id: 'select'
      //菜单被点击的事件
      , click: (obj) => {
        let url = 'serviceUnit/serviceUnit/list';
        let type = '';
        switch (obj.value) {
          case '全部节水型载体':
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            break;
          case '省级节水型小区':
            url = 'residentialQuarters/residentialQuarters/list';
            removeRandomFeature();
            NoObject(obj, url);
            break;
          case '省级节水型工业企业':
            url = 'industrialEnterprise/industrialEnterprise/list';
            removeRandomFeature();
            NoObject(obj, url);
            break;
          case '省级节水型灌区':
            url = 'irrigationArea/irrigationArea/list';
            removeRandomFeature();
            NoObject(obj, url);
            break;
          case '市级节水型单位':
            url = 'cityServiceUnit/cityServiceUnit/list';
            removeRandomFeature();
            ShiObject(url);
            break;
          default:
            break;
        }
        switch (obj.value) {
          case '全部':
            removeRandomFeature();
            YesObject(obj, url);
            break;
          case '机关（单位）':
            type = '行政机关';
            removeRandomFeature();
            for (let i = 0; i < 3; i++) {
              if (type === '行政机关') {
                YesObject(obj, url, type);
                type = '事业单位';
              } else if (type === '事业单位') {
                YesObject(obj, url, type);
                type = '机关';
              } else if (type === '机关') {
                YesObject(obj, url, type);
              }
            }
            break;
          case '学校':
            type = '学校';
            url = 'serviceUnit/serviceUnit/staticData1';
            removeRandomFeature();
            SchoolType(obj, url, type);
            break;
          case '医院':
            type = '医院';
            removeRandomFeature();
            YesObject(obj, url, type);
            break;
          case '宾馆':
            type = '宾馆';
            removeRandomFeature();
            YesObject(obj, url, type);
            break;
          case '其他':
            type = '其他';
            removeRandomFeature();
            YesObject(obj, url, type);
            break;
          default:
            break;
        }
        switch (obj.value) {
          case '全部技改项目':
            removeRandomFeature();
            allShengImprove();
            allShiImprove();
            allAtherImprove();
            break;
          case '省级载体中的技改项目':
            removeRandomFeature();
            allShengImprove();
            break;
          case '市级载体中的技改项目':
            removeRandomFeature();
            allShiImprove();
            break;
          case '其他技改项目':
            removeRandomFeature();
            allAtherImprove();
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
  // 查询学校类
  function SchoolType (obj, url, type) {
    let data = getList(url, { pageSize: 10000, dwlx: type });
    let axis = [];
    data.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = item.dwmc;
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = item.dwdz;
      let location = item.dwszd;
      let design = '单位';
      var src = `./icons/0${obj.id}.png`;
      let units = {
        dwlx: item.dwlx,
        ysrs: item.ysrs ? item.ysrs : 0,
        sjysl: item.sjysl ? item.sjysl : 0,
        rjysl: item.rjysl ? item.rjysl : 0,
        cztr: item.cztr ? item.cztr : 0,
        dez: item.dez ? item.dez : 0,
        jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
        xmmc: item.xmmc ? item.xmmc : '暂无',
        ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
        ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
      };
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
        units: units
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
  }
  // 有子集菜单类
  function YesObject (obj, url, type) {
    let data = getList(url, { pageSize: 10000, dwlx: type });
    let axis = [];
    data.records.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = item.dwmc;
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = item.dwdz;
      let location = item.dwszd;
      let design = '单位';
      let units = {
        dwlx: item.dwlx,
        ysrs: item.ysrs ? item.ysrs : 0,
        sjysl: item.sjysl ? item.sjysl : 0,
        rjysl: item.rjysl ? item.rjysl : 0,
        cztr: item.cztr ? item.cztr : 0,
        dez: item.dez ? item.dez : 0,
        jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
        xmmc: item.xmmc ? item.xmmc : '暂无',
        ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
        ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
      };
      axis.push({
        zb: [t1, t2],
        Id: id,
        src: `./icons/0${obj.id}.png`,
        images: images,
        title: title,
        gbdw: gbdw,
        gbdwjb: gbdwjb,
        address: address,
        location: location,
        design: design,
        units: units
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
  }
  // 没有子集菜单类
  function NoObject (obj, url) {
    let data = getList(url, { pageSize: 10000 });
    let axis = [];
    let allObj = [];
    data.records.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = '';
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = '';
      let location = '';
      let design = '';
      let plot = {};
      let company = {};
      let tank = {};
      switch (obj.value) {
        case '省级节水型小区':
          title = item.xqmc;
          address = item.xqdz;
          location = item.xqszd;
          design = '小区';
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
        case '省级节水型工业企业':
          title = item.qymc;
          address = item.qydz;
          location = item.qyszd;
          design = '企业';
          company = {
            hyfl: item.hyfl,
            zycp: item.zycp,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwcpysdw: item.dwcpysdw ? item.dwcpysdw : 0,
            dwcpys: item.dwcpys ? item.dwcpys : 0,
            cflyl: item.cflyl ? item.cflyl : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
          };
          break;
        case '省级节水型灌区':
          title = item.gqmc;
          address = item.gqdz;
          location = item.gqszd;
          design = '灌区';
          tank = {
            gqgmlx: item.gqgmlx,
            zyzw: item.zyzw,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwlzss: item.dwlzss ? item.dwlzss : 0,
            cztr: item.cztr ? item.cztr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0
          };
          break;
        default:
          break;
      }
      axis.push({
        zb: [t1, t2],
        Id: id,
        src: `./icons/0${obj.id}.png`,
        images: images,
        title: title,
        gbdw: gbdw,
        gbdwjb: gbdwjb,
        address: address,
        location: location,
        design: design,
        plot: design = '小区' ? plot : null,
        company: design = '企业' ? company : null,
        tank: design = '灌区' ? tank : null
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
  }
  // 所有市级类
  function ShiObject (url) {
    let shiUnitsList = getList(url, { pageSize: 10000 });
    let axis = [];
    let allObj = [];
    shiUnitsList.records.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = item.dwmc;
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = item.dwdz;
      let location = item.dwszd;
      let design = '单位';
      let src = './icons/02.png';
      let shiUnits = {
        dwlx: item.dwlx,
        ysrs: item.ysrs ? item.ysrs : 0,
        sjysl: item.sjysl ? item.sjysl : 0,
        rjysl: item.rjysl ? item.rjysl : 0,
        cztr: item.cztr ? item.cztr : 0,
        dez: item.dez ? item.dez : 0,
        jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
        xmmc: item.xmmc ? item.xmmc : '暂无',
        ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
        ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
      };
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
        units: shiUnits
      })
    })
    // 设置标识图标
    var scale = 1.5;
    allObj.push({
      axis: axis
    });
    // 将图标放到地图对象
    allObj.forEach(item => {
      addRandomFeature(item.axis, scale);
    });
  }
  /**
   技改类 
   * */
  // 所有省级技改类的数据
  function allShengImprove () {
    let url = {
      plotsUrl: 'residentialQuarters/residentialQuarters/staticData2',
      companyUrl: 'industrialEnterprise/industrialEnterprise/staticData2',
      tanksUrl: 'irrigationArea/irrigationArea/staticData2',
      unitsUrl: 'serviceUnit/serviceUnit/staticData2',
    }
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
    for (const key in url) {
      switch (key) {
        case 'plotsUrl':
          let plotList = getList(url[key], { pageSize: 10000, type: 1 });
          plotList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            gbdw = item.gbdw;
            gbdwjb = item.gbdwjb;
            title = item.xqmc;
            address = item.xqdz;
            location = item.xqszd;
            design = '小区';
            src = './icons/05.png';
            plot = {
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
          break;
        case 'companyUrl':
          let companyList = getList(url[key], { pageSize: 10000, type: 1 });
          companyList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            gbdw = item.gbdw;
            gbdwjb = item.gbdwjb;
            title = item.qymc;
            address = item.qydz;
            location = item.qyszd;
            design = '企业';
            src = './icons/08.png';
            company = {
              hyfl: item.hyfl,
              zycp: item.zycp,
              sjysl: item.sjysl ? item.sjysl : 0,
              dwcpysdw: item.dwcpysdw ? item.dwcpysdw : 0,
              dwcpys: item.dwcpys ? item.dwcpys : 0,
              cflyl: item.cflyl ? item.cflyl : 0,
              jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
              cztr: item.cztr ? item.cztr : 0,
              dez: item.dez ? item.dez : 0,
              xmmc: item.xmmc ? item.xmmc : '暂无',
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
              company: company
            });
          });
          break;
        case 'tanksUrl':
          let tanksList = getList(url[key], { pageSize: 10000, type: 1 });
          tanksList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            gbdw = item.gbdw;
            gbdwjb = item.gbdwjb;
            title = item.gqmc;
            address = item.gqdz;
            location = item.gqszd;
            design = '灌区';
            src = './icons/0132.png';
            tanks = {
              gqgmlx: item.gqgmlx,
              zyzw: item.zyzw,
              sjysl: item.sjysl ? item.sjysl : 0,
              dwlzss: item.dwlzss ? item.dwlzss : 0,
              cztr: item.cztr ? item.cztr : 0,
              xmmc: item.xmmc ? item.xmmc : '暂无',
              jsjgtr: item.jsjgtr ? item.jsjgtr : 0
            };
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
              tank: tanks
            });
          });
          break;
        case 'unitsUrl':
          let unitsList = getList(url[key], { pageSize: 10000, type: 1 });
          unitsList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            title = item.dwmc;
            gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
            gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
            address = item.dwdz;
            location = item.dwszd;
            design = '单位';
            src = './icons/03.png';
            units = {
              dwlx: item.dwlx,
              ysrs: item.ysrs ? item.ysrs : 0,
              sjysl: item.sjysl ? item.sjysl : 0,
              rjysl: item.rjysl ? item.rjysl : 0,
              cztr: item.cztr ? item.cztr : 0,
              dez: item.dez ? item.dez : 0,
              jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
              xmmc: item.xmmc ? item.xmmc : '暂无',
              ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
              ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
            };
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
              units: units
            })
          });
          break;
        default:
          break;
      }
    }
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
  }
  // 所有市级技改类的数据
  function allShiImprove () {
    let shiUnitsList = getList('cityServiceUnit/cityServiceUnit/staticData2', { pageSize: 10000, type: 1 });
    let axis = [];
    shiUnitsList.records.forEach(item => {
      let t1 = item.xcoor ? item.xcoor : null;
      let t2 = item.ycoor ? item.ycoor : null;
      let id = item.id;
      let images = item.images ? item.images : null;
      let title = item.dwmc;
      let gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
      let gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
      let address = item.dwdz;
      let location = item.dwszd;
      let design = '单位';
      let src = './icons/02.png';
      let units = {
        dwlx: item.dwlx,
        ysrs: item.ysrs ? item.ysrs : 0,
        sjysl: item.sjysl ? item.sjysl : 0,
        rjysl: item.rjysl ? item.rjysl : 0,
        cztr: item.cztr ? item.cztr : 0,
        dez: item.dez ? item.dez : 0,
        jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
        xmmc: item.xmmc ? item.xmmc : '暂无',
        ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
        ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
      };
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
        units: units
      })
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
  }
  // 所有其他技改类的数据
  function allAtherImprove () {
    let url = {
      plotsUrl: 'residentialQuarters/residentialQuarters/staticData2',
      companyUrl: 'industrialEnterprise/industrialEnterprise/staticData2',
      tanksUrl: 'irrigationArea/irrigationArea/staticData2',
      unitsUrl: 'serviceUnit/serviceUnit/staticData2',
    }
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
    for (const key in url) {
      switch (key) {
        case 'plotsUrl':
          let plotList = getList(url[key], { pageSize: 10000, type: 3 });
          plotList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
            gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
            title = item.xqmc;
            address = item.xqdz;
            location = item.xqszd;
            design = '小区';
            src = './icons/07.png';
            plot = {
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
          break;
        case 'companyUrl':
          let companyList = getList(url[key], { pageSize: 10000, type: 3 });
          companyList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
            gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
            title = item.qymc;
            address = item.qydz;
            location = item.qyszd;
            design = '企业';
            src = './icons/07.png';
            company = {
              hyfl: item.hyfl,
              zycp: item.zycp,
              sjysl: item.sjysl ? item.sjysl : 0,
              dwcpys: item.dwcpys ? item.dwcpys : 0,
              cflyl: item.cflyl ? item.cflyl : 0,
              jscs: item.jscs ? item.jscs : ''
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
              company: company
            });
          });
          break;
        case 'tanksUrl':
          let tanksList = getList(url[key], { pageSize: 10000, type: 3 });
          tanksList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
            gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
            title = item.gqmc;
            address = item.gqdz;
            location = item.gqszd;
            design = '灌区';
            src = './icons/07.png';
            tanks = {
              gqgmlx: item.gqgmlx,
              zyzw: item.zyzw,
              sjysl: item.sjysl ? item.sjysl : 0,
              dwlzss: item.dwlzss ? item.dwlzss : 0,
              cztr: item.cztr ? item.cztr : 0,
              xmmc: item.xmmc ? item.xmmc : '暂无',
              jsjgtr: item.jsjgtr ? item.jsjgtr : 0
            };
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
              tank: tanks
            });
          });
          break;
        case 'unitsUrl':
          let unitsList = getList(url[key], { pageSize: 10000, type: 3 });
          unitsList.records.forEach(item => {
            t1 = item.xcoor ? item.xcoor : null;
            t2 = item.ycoor ? item.ycoor : null;
            id = item.id;
            images = item.images ? item.images : null;
            title = item.dwmc;
            gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
            gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
            address = item.dwdz;
            location = item.dwszd;
            design = '单位';
            src = './icons/07.png';
            units = {
              dwlx: item.dwlx,
              ysrs: item.ysrs ? item.ysrs : 0,
              sjysl: item.sjysl ? item.sjysl : 0,
              rjysl: item.rjysl ? item.rjysl : 0,
              cztr: item.cztr ? item.cztr : 0,
              dez: item.dez ? item.dez : 0,
              jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
              xmmc: item.xmmc ? item.xmmc : '暂无',
              ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
              ysrsdw: item.ysrsdw ? item.ysrsdw : '人'
            };
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
              units: units
            })
          });
          break;
        default:
          break;
      }
    }
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
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        var coodinate = evt.coordinate;
        overlay.setPosition(coodinate);
        //设置弹出框内容，可以HTML自定义
        content.innerHTML = `
               <div class="information">
                <div style="margin-left:1.5rem;">基本信息</div>
                <div>公布单位：${data.gbdw}</div>
                <div>公布单位级别：${data.gbdwjb}</div>
                <div>${data.design}名称：${data.title}</div>
                <div>${data.design}地址：${data.address}</div>
                <div>${data.design}所在地：${data.location}</div>
                </div>
               `;
        flag = true;
      }
    });
    if (flag) {
      //显示overlay
      map.addOverlay(overlay);
    } else
      map.removeOverlay(overlay);
  });
});