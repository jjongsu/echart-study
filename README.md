# Echarts 라이브러리 활용 과제

## 해결 과제

1. 총 8개의 그래프 그리기
2. 조직도, 이동현황 data는 각각 `sankey.json`, `treemap.json`파일을 참조할 것
3. 주어진 동영상 및 기획서를 통해 필요한 그래프 형태를 그릴 것
4. 영역별 드래그 앤 드롭으로 위치 이동 기능 구현
   (단, 큰 영역을 잡고 작은 영역으로 이동은 불가)
5. 그래프 확대 / 축소 기능 구현
6. 그래프 이미지 저장 기능 구현
7. 그래프 pdf 저장 기능 구현

---

## 폴더 구조

### createDataScripts

```
createDataScripts
 ┣ createBlood0Data.js
 ┣ createBlood2Data.js
 ┣ createBloodData.js
 ┣ createCTData.js
 ┣ createOperateData.js
 ┣ createPatientsData.js
 ┗ createVisitorData.js
```

각 그래프 별 필요한 더미 데이터 생성하는 script
해당 script에서 더미 데이터 생성 후 `public/jsonData` 폴더로 각 데이터 생성

### src

```
src
 ┣ assets
 ┃ ┗ style.css
 ┣ lib
 ┃ ┣ classes
 ┃ ┃ ┣ basicClass.js
 ┃ ┃ ┣ blood0Class.js
 ┃ ┃ ┣ blood1Class.js
 ┃ ┃ ┣ blood2Class.js
 ┃ ┃ ┣ companyOrgClass.js
 ┃ ┃ ┣ ctClass.js
 ┃ ┃ ┣ index.js
 ┃ ┃ ┣ operateClass.js
 ┃ ┃ ┣ patientsClass.js
 ┃ ┃ ┣ sankeyClass.js
 ┃ ┃ ┗ visitorClass.js
 ┃ ┗ utils
 ┃ ┃ ┗ helper.js
 ┣ controller.js
 ┗ main.js
```

-   `assets` : css, img 등 관련 파일 저장
-   `lib/classes` : 각 그래프별 class 생성
-   `lib/utils` : helper 관련 함수들 정의
-   `controller.js` : 각 그래프 그리기 및 이벤트들 관련한 controller기능을 담당하는 class
-   `main.js` : `controller.js`을 통해 실행하는 script

---

## 기본 구상 흐름

-   controller에서 각 그래프를 쉽게 다룰 수 있는 방법에 대한 고민에서 시작
-   그러기 위해서는 하나의 `basicClass`에서 확장해서 각 그래프의 특성에 맞게 정의해서 사용하면 어떨지 확장해서 생각
-   또한, 통일된 구조로 추가적인 그래프가 들어왔을 때도 유지 보수성 + 확장성에 대한 고민
-   결국 `basicClass`에서 공통적인 수행 관련한 것들을 추가하고 각 그래프의 상황에 맞게 class 내부 함수 정의 및 상수를 정의해서 사용하기로 생각

---

## 아쉬운 점 및 추가로 해야할 부분

1. 확대 및 축소된 형태에서 글자 크기 등을 동적으로 변경하는 방법
2. x축에서 시간이 지남에 따라서 참고 동영상과 비슷하게 애니메이션 필요
3. 지금 현재 라이브러리 내부의 SaveAsImage를 살펴보았는데,
   현재 이미지 저장 기능에서는 이미지 저장 시 browser가 Chrome, Firefox, New Edge일 때만 정상적으로 작동할 것으로 보이는데 SaveAsImage 구조 참고해서 수정
   browser check는 userAgent 기반에서 확인 필요
4. 드래그 앤 드롭에 따라서 DOM은 그대로이고 데이터만 변경되도록 하는 수정 필요
5. 외부에서 데이터를 통신해서 안으로 넣어보는 방법에 대한 고민
   => DOM에 이벤트 리스너를 통해 통신하는 방법? 다른 방법은?
6. Tooltip에 들어가는 그래프에 애니메이션 효과를 적용할 수 있는 방법 고민
7. 이미지 저장과 pdf 저장 시에 화면 크기에 영향을 받지 않고 항상 일정한 크기로 저장 되도록 수정 필요

```
SaveAsImage.prototype.onclick = function (ecModel, api) {
    var model = this.model;
    var title = model.get('name') || ecModel.get('title.0.text') || 'echarts';
    var isSvg = api.getZr().painter.getType() === 'svg';
    var type = isSvg ? 'svg' : model.get('type', true) || 'png';
    var url = api.getConnectedDataURL({
      type: type,
      backgroundColor: model.get('backgroundColor', true) || ecModel.get('backgroundColor') || '#fff',
      connectedBackgroundColor: model.get('connectedBackgroundColor'),
      excludeComponents: model.get('excludeComponents'),
      pixelRatio: model.get('pixelRatio')
    });
    var browser = env.browser;
    // Chrome, Firefox, New Edge
    if (typeof MouseEvent === 'function' && (browser.newEdge || !browser.ie && !browser.edge)) {
      var $a = document.createElement('a');
      $a.download = title + '.' + type;
      $a.target = '_blank';
      $a.href = url;
      var evt = new MouseEvent('click', {
        // some micro front-end framework， window maybe is a Proxy
        view: document.defaultView,
        bubbles: true,
        cancelable: false
      });
      $a.dispatchEvent(evt);
    }
    // IE or old Edge
    else {
      // @ts-ignore
      if (window.navigator.msSaveOrOpenBlob || isSvg) {
        var parts = url.split(',');
        // data:[<mime type>][;charset=<charset>][;base64],<encoded data>
        var base64Encoded = parts[0].indexOf('base64') > -1;
        var bstr = isSvg
        // should decode the svg data uri first
        ? decodeURIComponent(parts[1]) : parts[1];
        // only `atob` when the data uri is encoded with base64
        // otherwise, like `svg` data uri exported by zrender,
        // there will be an error, for it's not encoded with base64.
        // (just a url-encoded string through `encodeURIComponent`)
        base64Encoded && (bstr = window.atob(bstr));
        var filename = title + '.' + type;
        // @ts-ignore
        if (window.navigator.msSaveOrOpenBlob) {
          var n = bstr.length;
          var u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          var blob = new Blob([u8arr]); // @ts-ignore
          window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          var frame = document.createElement('iframe');
          document.body.appendChild(frame);
          var cw = frame.contentWindow;
          var doc = cw.document;
          doc.open('image/svg+xml', 'replace');
          doc.write(bstr);
          doc.close();
          cw.focus();
          doc.execCommand('SaveAs', true, filename);
          document.body.removeChild(frame);
        }
      } else {
        var lang = model.get('lang');
        var html = '' + '<body style="margin:0;">' + '<img src="' + url + '" style="max-width:100%;" title="' + (lang && lang[0] || '') + '" />' + '</body>';
        var tab = window.open();
        tab.document.write(html);
        tab.document.title = title;
      }
    }
  };
```
