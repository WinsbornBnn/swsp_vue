/* 初始化地图 */
var osm = new ol.layer.Tile({
  source: new ol.source.XYZ({
    // url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
    url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=388fdb5931aa34690dcc3827821ae14e'
  }),
});
var cva = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=388fdb5931aa34690dcc3827821ae14e'
  }),
});
var bing = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: 'As1HiMj1PvLPlqc_gtM7AqZfBL8ZL3VrjaS3zIb22Uvb9WKhuJObROC-qUpa81U5',
    imagerySet: 'AerialWithLabels',

  })
});
var view = new ol.View({
  center: [119.397777, 32.377899],
  projection: 'EPSG:4326',
  zoom: 14,
  maxZoom: 18,
  minZoom: 4
})
var map = new ol.Map({
  target: 'geo',
  layers: [osm, cva],
  view: view
});

/* 获取扬州geo json数据 */
/* 设置区域 */
const url = ['./json/yangzhou_full.json', './json/yangzhou.json'];
let areaFeature = null;
// 设置图层
const areaLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [],
  }),
  stopEvent: true
});
url.forEach(item => {
  if (item === './json/yangzhou_full.json') {
    // 区级
    ajax({
      url: item,
      type: 'get'
    }).then(res => {
      const areaGeo = res;
      areaGeo.features.forEach(item => {
        if (item.geometry.type === "MultiPolygon") {
          areaFeature = new ol.Feature({
            geometry: new ol.geom.MultiPolygon(
              item.geometry.coordinates
            ).transform("EPSG:4326", "EPSG:4326"),
            name: 'area'
          });
        }
        areaFeature.setStyle(
          new ol.style.Style({
            fill: new ol.style.Fill({ color: "#4e98f440" }),
            stroke: new ol.style.Stroke({
              width: 2,
              // lineDash:[1,2,3,4,5,6,7,8],
              color: [0, 255, 0, .8]
            }),
            text: new ol.style.Text({ //文本样式
              font: '0.25rem Calibri,sans-serif',
              fill: new ol.style.Fill({
                color: '#f00'
              }),
              text: item.properties.name,
              stroke: new ol.style.Stroke({
                color: '#fff',
                width: 1
              })
            })
          })
        );
        areaLayer.getSource().addFeatures([areaFeature]);
      });
    }).catch(err => {
      return false;
    })
  } else if (item === './json/yangzhou.json') {
    // 市级
    ajax({
      url: item,
      type: 'get'
    }).then(res => {
      const areaGeo = res;
      areaGeo.features.forEach(item => {
        if (item.geometry.type === "MultiPolygon") {
          areaFeature = new ol.Feature({
            geometry: new ol.geom.MultiPolygon(
              item.geometry.coordinates
            ).transform("EPSG:4326", "EPSG:4326"),
            name: 'area'
          });
        }
        areaFeature.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              width: 2,
              // lineDash:[0],
              color: [255, 0, 0, .8]
            })
          })
        );
        areaLayer.getSource().addFeatures([areaFeature]);
      });
    }).catch(err => {
      return false;
    })
  }
});
map.addLayer(areaLayer);

//添加遮罩
function addconver (url) {
  $.getJSON(url, function (data) {
    var converLayer = null;
    var mystyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(28, 28, 52, 1)",
      })
    });
    converLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: mystyle
    });
    var fts = new ol.format.GeoJSON().readFeatures(data);
    var ft = fts[0];
    var converGeom = erase(ft.getGeometry());

    var convertFt = new ol.Feature({
      geometry: converGeom
    })
    converLayer.getSource().addFeature(convertFt);
    map.addLayer(converLayer);
  })
}

// 擦除操作,生产遮罩范围
function erase (geom) {
  var extent = [-180, -90, 180, 90];
  var polygonRing = ol.geom.Polygon.fromExtent(extent);
  var coords = geom.getCoordinates();
  coords.forEach(coord => {
    var linearRing = new ol.geom.LinearRing(coord[0]);
    polygonRing.appendLinearRing(linearRing);
  })
  return polygonRing;
}
var dataURL = './json/yangzhou.json'
addconver(dataURL);

/* 在地图上标点 */
// 封装函数，矢量标注样式函数，设置image为图标 Icon
const LabelStyle = (icon, scale) => {
  return (new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.96],
      crossOrigin: 'anonymous',
      src: icon,
      scale: scale //图标大小
    })
  }));
}
/* 添加标注 */
// // 创建空的矢量容器
var vectorSource = new ol.source.Vector({});
var iconFeature = null;
var vectorLayer = null;
const draw = (axis, scale) => {
  // 设置要素点
  for (const key in axis) {
    //创建图标特性
    iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(axis[key].zb).transform("EPSG:4326", "EPSG:3857"),
      name: 'icon',
      id: axis[key].Id,
      images: axis[key].images,
      title: axis[key].title,
      gbdw: axis[key].gbdw,
      gbdwjb: axis[key].gbdwjb,
      address: axis[key].address == null ? '' : axis[key].address,
      location: axis[key].location == null ? '' : axis[key].location,
      design: axis[key].design,
      time: axis[key].time,
      plot: axis[key].plot ? axis[key].plot : '',
      company: axis[key].company ? axis[key].company : '',
      tank: axis[key].tank ? axis[key].tank : '',
      units: axis[key].units ? axis[key].units : '',
      dm: axis[key].dm ? axis[key].dm : '',
      cp: axis[key].cp ? axis[key].cp : '',
    });
    iconFeature.setId(axis[key].Id);
    //设置图标样式
    iconFeature.setStyle(
      LabelStyle(axis[key].src, scale)
    );
    //将图标特性添加进矢量中
    vectorSource.addFeature(iconFeature);
  }
}
//创建矢量层
vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  zIndex: 1000
});
map.addLayer(vectorLayer);
// 页面进入显示所有的图标
const created = () => {
  let url = {
    plotsUrl: 'residentialQuarters/residentialQuarters/list',
    companyUrl: 'industrialEnterprise/industrialEnterprise/grouplist',
    jssfUrl: 'industrialEnterprise/industrialEnterprise/groupjglist', //节水示范项目
    tanksUrl: 'irrigationArea/irrigationArea/list',
    unitsUrl: 'serviceUnit/serviceUnit/grouplist',
    schUrl: 'serviceUnit/serviceUnit/listsch',
    jdUrl: 'serviceUnit/serviceUnit/listjd',
  }
  let axis = [];
  let t1 = null;
  let t2 = null;
  let design = '';
  var plot = {};
  var tanks = {};
  var units = {};
  var src = '';
  for (const key in url) {
    switch (key) {
      case 'jssfUrl':
        let jsxxList = getList(url[key], { pageSize: 10000 });
        jsxxList.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          if (item.xmjb === "省级") {
            src = './icons/sj_xx.png';
          } else {
            src = './icons/sjxx.png';
          }
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
            time: item.gbsj,
            design: '节水减排示范项目',
            plot: plot,
            dm: item.dm,
            cp: item.cp
          });
        });
        break;
      case 'plotsUrl':
        let plotList = getList(url[key], { pageSize: 10000 });
        plotList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          src = './icons/xiaoqu.png';
          axis.push({
            zb: [t1, t2],
            src: src,
            Id: item.id,
            images: item.images ? item.images : null,
            title: item.xqmc,
            gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
            gbdwjb: item.gbdwjb ? item.gbdwjb : '省级',
            address: item.xqdz,
            location: item.xqszd,
            time: item.gbsj,
            design: '小区',
            plot: item,
            dm: item.dm,
            cp: item.cp
          });
        });
        break;
      case 'companyUrl':
        let companyList = getList(url[key], { pageSize: 10000 });
        companyList.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          src = './icons/qiye.png';
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
            time: item.gbsj
          };
          axis.push({
            zb: [t1, t2],
            src: src,
            Id: item.id,
            images: item.images ? item.images : null,
            title: item.qymc,
            gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
            gbdwjb: item.gbdwjb ? item.gbdwjb : '省级',
            address: item.qydz,
            location: item.qyszd,
            time: item.gbsj,
            design: '工业企业',
            company: item,
            dm: item.dm,
            cp: item.cp
          });
        });
        break;
      case 'tanksUrl':
        let tanksList = getList(url[key], { pageSize: 10000 });
        tanksList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          src = './icons/guanqu.png';
          tanks = {
            gqgmlx: item.gqgmlx,
            zyzw: item.zyzw,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwlzss: item.dwmjysl ? item.dwmjysl : 0,
            cztr: item.cztr ? item.cztr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            time: item.gbsj,
            ggsyxlyxs: item.ggsyxlyxs == null ? '' : item.ggsyxlyxs

          };
          axis.push({
            zb: [t1, t2],
            Id: item.id,
            src: src,
            images: item.images ? item.images : null,
            title: item.gqmc,
            gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
            gbdwjb: item.gbdwjb ? item.gbdwjb : '省级',
            address: item.gqdz,
            location: item.gqszd,
            time: item.gbsj,
            design: '灌区',
            tank: tanks,
            dm: item.dm,
            cp: item.cp
          });
        });
        break;
      case 'unitsUrl':
        let unitsList = getList(url[key], { pageSize: 10000 });
        unitsList.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          src = './icons/danwei.png';
          design = '单位'
          switch (item.dwlx) {
            case '事业单位':
              src = './icons/danwei.png';
              design = '事业单位';
              break;
            case '学校':
              src = './icons/xuexiao.png';
              design = '学校';
              break;
            case '医院':
              src = './icons/yiyuan.png';
              design = '医院';
              break;
            case '宾馆':
              src = './icons/binguan.png';
              design = '宾馆';
              break;
            case '其他':
              src = './icons/qita.png';
              design = '其他';
              break;
            case '行政机关':
              src = './icons/danwei.png';
              design = '机关';
              break;
            default:
              break;
          }
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人',
            time: item.gbsj
          };
          axis.push({
            zb: [t1, t2],
            Id: item.id,
            src: src,
            images: item.images ? item.images : null,
            title: item.dwmc,
            gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
            gbdwjb: item.gbdwjb ? item.gbdwjb : '省级',
            address: item.dwdz,
            location: item.dwszd,
            time: item.gbsj,
            design: design,
            units: item,
            dm: item.dm,
            cp: item.cp
          })
        });
        break;
      case 'schUrl':
        let schunitsList = getList(url[key], { pageSize: 10000 });
        schunitsList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          src = './icons/xuexiao.png';
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人',
            time: item.gbsj
          };
          axis.push({
            zb: [t1, t2],
            Id: item.id,
            src: src,
            images: item.images ? item.images : null,
            title: item.dwmc,
            gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
            gbdwjb: item.gbdwjb ? item.gbdwjb : '省级',
            address: item.dwdz,
            location: item.dwszd,
            time: item.gbsj,
            design: '学校',
            units: units,
            dm: item.dm,
            cp: item.cp
          })
        });
        break;
      case 'jdUrl':
        let jdunitsList = getList(url[key], { pageSize: 10000 });
        jdunitsList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          src = './icons/jidi.png';
          units = {
            dwlx: item.dwlx,
            ysrs: item.ysrsz ? item.ysrsz : 0,
            sjysl: item.sjysl ? item.sjysl : 0,
            rjysl: item.yslz ? item.yslz : 0,
            cztr: item.cztr ? item.cztr : 0,
            dez: item.dez ? item.dez : 0,
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            ysldw: item.ysldw ? item.ysldw : ' m3/（人·a）',
            ysrsdw: item.ysrsdw ? item.ysrsdw : '人',
            time: item.gbsj
          };
          axis.push({
            zb: [t1, t2],
            Id: item.id,
            src: src,
            images: item.images ? item.images : null,
            title: item.dwmc,
            gbdw: item.gbdw ? item.gbdw : '江苏省水利厅',
            gbdwjb: item.gbdwjb ? item.gbdwjb : '省级',
            address: item.dwdz,
            location: item.dwszd,
            time: item.gbsj,
            design: '节水教育基地',
            units: units,
            dm: item.dm,
            cp: item.cp
          })
        });
        break;
      default:
        break;
    }
  }
  /* 标志方法 挂载到地图对象 */
  // 设置标识文字
  var scale = 1.5;
  var allObj = [];
  // 将图标放到地图对象
  allObj.push({
    axis: axis
  })
  // map.removeLayer(vectorLayer);
  // map.removeLayer(vectorLayer1);
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

var vectorSource1 = new ol.source.Vector({});
var vectorLayer1 = null;
// 5.删除点，需要先从Feature里移除icon，然后再移除图层，如果不从Feature里移除icon而直接移除图层，
// 则同一个实例化方法中icon一直存在，只是由于图层不存在而未在地图上显示出来。
const removeRandomFeature = () => {
  vectorSource1.forEachFeature(function (e) {
    vectorSource1.removeFeature(vectorSource1.getFeatureById(e.getId()));
    map.removeLayer(vectorLayer1);
    map.addLayer(vectorLayer1);
  });
}
const addRandomFeature = (axis, scale) => {
  map.removeLayer(vectorLayer);
  map.removeLayer(vectorLayer1);
  for (const key in axis) {
    var rome = new ol.Feature({
      geometry: new ol.geom.Point(axis[key].zb).transform("EPSG:4326", "EPSG:4326"),
      name: 'icon',
      id: axis[key].Id,
      images: axis[key].images,
      title: axis[key].title,
      gbdw: axis[key].gbdw,
      gbdwjb: axis[key].gbdwjb,
      address: axis[key].address == null ? '' : axis[key].address,
      location: axis[key].location == null ? '' : axis[key].location,
      design: axis[key].design,
      time: axis[key].time,
      plot: axis[key].plot ? axis[key].plot : '',
      company: axis[key].company ? axis[key].company : '',
      tank: axis[key].tank ? axis[key].tank : '',
      units: axis[key].units ? axis[key].units : '',
      dm: axis[key].dm ? axis[key].dm : '',
      cp: axis[key].cp ? axis[key].cp : '',
    });
    rome.setId(axis[key].Id);
    rome.setStyle(LabelStyle(axis[key].src, scale));
    vectorSource1.addFeature(rome);
  }
  vectorLayer1 = new ol.layer.Vector({
    source: vectorSource1,
    zIndex: 1500
  });
  map.addLayer(vectorLayer1);
}
// 二次移除加载
const remove = () => {
  vectorSource.forEachFeature(function (e) {
    vectorSource.removeFeature(vectorSource.getFeatureById(e.getId()));
    map.removeLayer(vectorLayer);
    map.addLayer(vectorLayer);
  });
}

created();