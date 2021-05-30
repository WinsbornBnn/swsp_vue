const flexible = ((window, document) => {
  const docEL = document.documentElement;
  const dpr = window.devicePixelRatio;
  // 调整正文字体大小
  const setBodyFontSize = () => {
    if (document.body) {
      document.body.style.fontSize = (10 * dpr) + 'px';
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize);
    }
  }
  setBodyFontSize();
  // 设置 1rem = viewWidth / 10
  const setRemUnit = () => {
    const rem = docEL.clientWidth / 20;
    docEL.style.fontSize = rem + 'px';
  }
  setRemUnit();
  // 重置页面大小上的rem单位
  window.addEventListener('resize', setRemUnit);
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setRemUnit();
    }
  })
  // 检测 0.5px是否支持
  if (dpr >= 2) {
    const fakeBody = document.createElement('body');
    const testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEL.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEL.classList.add('hairlines');
    }
    docEL.removeChild(fakeBody);
  }
})(window, document)