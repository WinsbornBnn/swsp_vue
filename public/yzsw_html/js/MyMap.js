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
/* 设置区域 */
const url = ['./json/yangzhou_full.json','./json/yangzhou.json'];
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
              ).transform("EPSG:4326", "EPSG:3857"),
              name: 'area'
            });
          }
          areaFeature.setStyle(
            new ol.style.Style({
              fill: new ol.style.Fill({ color: "#4e98f440" }),
              stroke: new ol.style.Stroke({
                width: 2,
                // lineDash:[1,2,3,4,5,6,7,8],
                color: [0,255,0, .8]
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
    }else if (item === './json/yangzhou.json') { 
      // 市级
      ajax({
        url: item,
        type: 'get'
      }).then(res => {
        console.log(res);
        const areaGeo = res;
        areaGeo.features.forEach(item => {
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
              stroke: new ol.style.Stroke({
                width: 2,
                // lineDash:[0],
                color: [255,0,0, .8]
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
      address: axis[key].address == null?'':axis[key].address ,
      location: axis[key].location == null?'':axis[key].location ,
      design: axis[key].design,
      time:axis[key].time,
      plot: axis[key].plot ? axis[key].plot : '',
      company: axis[key].company ? axis[key].company : '',
      tank: axis[key].tank ? axis[key].tank : '',
      units: axis[key].units ? axis[key].units : '',
      dm:axis[key].dm ? axis[key].dm : '',
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
    jssfUrl: 'industrialEnterprise/industrialEnterprise/listjg', //节水示范项目
    tanksUrl: 'irrigationArea/irrigationArea/list',
    unitsUrl: 'serviceUnit/serviceUnit/list',
    schUrl: 'serviceUnit/serviceUnit/listsch',
    jdUrl: 'serviceUnit/serviceUnit/listjd'
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
  var gb_time = "";
  var dm = "";
  for (const key in url) {
    
    switch (key) {
      case 'jssfUrl':
        let jsxxList = getList(url[key], { pageSize: 10000 });
        jsxxList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          id = item.id;
          images = item.images ? item.images : null;
          gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
          gbdwjb = item.xmjb ? item.xmjb : '省级';
          title = item.qymc;
          gb_time = item.gbsj;
          dm = item.dm;
          address = item.qyszd;
          location = item.qydz;
          design = '节水减排示范项目';
          if(item.xmjb == "省级"){
            src = './icons/sj_xx.png';
          }else{
            src = './icons/sjxx.png';
          }
          plot = item;
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
            time:gb_time,
            design: design,
            plot: plot,
            dm:dm
          });
        });
        break;
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
          dm = item.dm;
          gb_time = item.gbsj;
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
            dez: item.dez ? item.dez : 0,
            time:gb_time
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
            time:gb_time,
            design: design,
            plot: plot,
            dm:dm
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
          dm = item.dm;
          gb_time = item.gbsj;
          address = item.qydz;
          location = item.qyszd;
          design = '企业';
          src = './icons/08.png';
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
            time:gb_time
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
            time:gb_time,
            design: design,
            company: company,
            dm:dm
          });
        });
        break;
      case 'tanksUrl':
        let tanksList = getList(url[key], { pageSize: 10000 });
        tanksList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          id = item.id;
          dm = item.dm;
          images = item.images ? item.images : null;
          gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
          gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
          title = item.gqmc;
          gb_time = item.gbsj;
          address = item.gqdz;
          location = item.gqszd;
          design = '灌区';
          src = './icons/0132.png';
          tanks = {
            gqgmlx: item.gqgmlx,
            zyzw: item.zyzw,
            sjysl: item.sjysl ? item.sjysl : 0,
            dwlzss: item.dwmjysl ? item.dwmjysl : 0,
            cztr: item.cztr ? item.cztr : 0,
            xmmc: item.xmmc ? item.xmmc : '暂无',
            jsjgtr: item.jsjgtr ? item.jsjgtr : 0,
            time:gb_time,
            ggsyxlyxs:item.ggsyxlyxs == null?'':item.ggsyxlyxs
            
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
            time:gb_time,
            design: design,
            tank: tanks,
            dm:dm
          });
        });
        break;
      case 'unitsUrl':
        let unitsList = getList(url[key], { pageSize: 10000 });
        unitsList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          id = item.id;
          dm = item.dm;
          images = item.images ? item.images : null;
          title = item.dwmc;
          gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
          gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
          address = item.dwdz;
          gb_time = item.gbsj;
          location = item.dwszd;
          design = '单位';
          src = './icons/03.png';
          switch (item.dwlx) {
            case '事业单位':
              src = './icons/03.png';
              break;
            case '学校':
              src = './icons/04.png';
              break;
            case '医院':
              src = './icons/01.png';
              break;
            case '宾馆':
              src = './icons/07.png';
              break;
            case '其他':
              src = './icons/06.png';
              break;
            case '行政机关':
              src = './icons/03.png';
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
            time:gb_time
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
            time:gb_time,
            design: design,
            units: units,
            dm:dm
          })
        });
        break;
      case 'schUrl':
        let schunitsList = getList(url[key], { pageSize: 10000 });
        schunitsList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          id = item.id;
          dm = item.dm;
          images = item.images ? item.images : null;
          title = item.dwmc;
          gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
          gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
          address = item.dwdz;
          gb_time = item.gbsj;
          location = item.dwszd;
          design = '学校';
          src = './icons/04.png';
          
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
            time:gb_time
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
            time:gb_time,
            design: design,
            units: units,
            dm:dm
          })
        });
        break;
        
      case 'jdUrl':
        let jdunitsList = getList(url[key], { pageSize: 10000 });
        jdunitsList.records.forEach(item => {
          t1 = item.xcoor ? item.xcoor : null;
          t2 = item.ycoor ? item.ycoor : null;
          id = item.id;
          dm = item.dm;
          images = item.images ? item.images : null;
          title = item.dwmc;
          gbdw = item.gbdw ? item.gbdw : '江苏省水利厅';
          gbdwjb = item.gbdwjb ? item.gbdwjb : '省级';
          address = item.dwdz;
          gb_time = item.gbsj;
          location = item.dwszd;
          design = '节水教育基地';
          src = './icons/09.png';

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
            time:gb_time
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
            time:gb_time,
            design: design,
            units: units,
            dm:dm
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
  debugger
  allObj.forEach(item => {
    addRandomFeature(item.axis, scale);
  });
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
  console.log(axis);
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
      address: axis[key].address == null?'':axis[key].address ,
      location: axis[key].location == null?'':axis[key].location ,
      design: axis[key].design,
      time:axis[key].time,
      plot: axis[key].plot ? axis[key].plot : '',
      company: axis[key].company ? axis[key].company : '',
      tank: axis[key].tank ? axis[key].tank : '',
      units: axis[key].units ? axis[key].units : '',
      dm:axis[key].dm ? axis[key].dm : '',
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
// 二次移除加载
const remove = () => {
  vectorSource.forEachFeature(function (e) {
    vectorSource.removeFeature(vectorSource.getFeatureById(e.getId()));
    map.removeLayer(vectorLayer);
    map.addLayer(vectorLayer);
  });
}

created();