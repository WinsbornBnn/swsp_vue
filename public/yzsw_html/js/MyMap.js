/* 初始化地图 */
const map = new ol.Map({
  target: 'geo',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url:
          "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9cbba48c44cfa8c5d44b53e2bbd087a"
      })
    }),
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9cbba48c44cfa8c5d44b53e2bbd087a'
      })
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([119.397777, 32.377899]),
    zoom: 15,
    maxZoom: 19,
    minZoom: 4
  })
})
/* 获取扬州geo json数据 */
const url = './json/yangzhou.json';
ajax({
  url: url,
  type: 'get'
}).then(res => {
  const areaGeo = res;
  addArea(areaGeo);
}).catch(err => {
  return false;
})
/* 设置区域 */
const addArea = (geo = []) => {
  if (geo.length == 0) return false;
  let areaFeature = null;
  // 设置图层
  const areaLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    stopEvent: true
  });
  geo.features.forEach(item => {
    if (item.geometry.type === "MultiPolygon") {
      areaFeature = new ol.Feature({
        geometry: new ol.geom.MultiPolygon(
          item.geometry.coordinates
        ).transform("EPSG:4326", "EPSG:3857"),
        name: 'area'
      });
    }
    areaFeature.setStyle(
      new ol.style.Style({
        fill: new ol.style.Fill({ color: "#4e98f440" }),
        stroke: new ol.style.Stroke({
          width: 2,
          color: [255, 0, 0, .8]
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
  map.addLayer(areaLayer);
}
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
      address: axis[key].address,
      location: axis[key].location,
      design: axis[key].design,
      plot: axis[key].plot ? axis[key].plot : '',
      company: axis[key].company ? axis[key].company : '',
      tank: axis[key].tank ? axis[key].tank : '',
      units: axis[key].units ? axis[key].units : '',
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
  zIndex: 1500
});
map.addLayer(vectorLayer);
// 页面进入显示所有的图标
const created = () => {
  let url = {
    plotsUrl: 'residentialQuarters/residentialQuarters/list',
    companyUrl: 'industrialEnterprise/industrialEnterprise/list',
    tanksUrl: 'irrigationArea/irrigationArea/list',
    unitsUrl: 'serviceUnit/serviceUnit/list',
    shiUnitsUrl: 'cityServiceUnit/cityServiceUnit/list'
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
        let plotList = getList(url[key], { pageSize: 10000 });
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
        let companyList = getList(url[key], { pageSize: 10000 });
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
        let tanksList = getList(url[key], { pageSize: 10000 });
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
        let unitsList = getList(url[key], { pageSize: 10000 });
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
      case 'shiUnitsUrl':
        let shiUnitsList = getList(url[key], { pageSize: 10000 });
        shiUnitsList.records.forEach(item => {
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
          src = './icons/02.png';
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
  /* 标志方法 挂载到地图对象 */
  // 设置标识文字
  var scale = 1.5;
  var allObj = [];
  // 将图标放到地图对象
  allObj.push({
    axis: axis
  })
  allObj.forEach(item => {
    draw(item.axis, scale);
  });
}
created();
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
      geometry: new ol.geom.Point(axis[key].zb).transform("EPSG:4326", "EPSG:3857"),
      name: 'icon',
      id: axis[key].Id,
      images: axis[key].images,
      title: axis[key].title,
      gbdw: axis[key].gbdw,
      gbdwjb: axis[key].gbdwjb,
      address: axis[key].address,
      location: axis[key].location,
      design: axis[key].design,
      plot: axis[key].plot ? axis[key].plot : '',
      company: axis[key].company ? axis[key].company : '',
      tank: axis[key].tank ? axis[key].tank : '',
      units: axis[key].units ? axis[key].units : '',
    });
    rome.setId(axis[key].Id);
    rome.setStyle(LabelStyle(axis[key].src, scale));
    vectorSource1.addFeature(rome);
  }
  vectorLayer1 = new ol.layer.Vector({
    source: vectorSource1,
    zIndex: 2000
  });
  map.addLayer(vectorLayer1);
}