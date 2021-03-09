if(!self.__appxInited) {
self.__appxInited = 1;
require('@alipay/appx-compiler/lib/sjsEnvInit');

require('./config$');


      if( navigator.userAgent && (navigator.userAgent.indexOf('LyraVM') > 0 || navigator.userAgent.indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}

if(AFAppX.compilerConfig){ AFAppX.compilerConfig.component2 = true; }

function success() {
require('../../app');
require('../../component/myComponent/LpXmList/LpXmList?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../component/myComponent/getUserInfo/getUserInfo?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=d5af24e3c00038f5385f80cb9b57c9af0fde710d');
require('../../pages/message/message?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/mine/mine?hash=0e4cc0b8b964669a5a08012fdc5b695499f83ecb');
require('../../pages/LouPanList/LouPanList?hash=9a660d62c3ef850a072ad2549a973696022f3cec');
require('../../pages/louPanDetail/louPanDetail?hash=0e4cc0b8b964669a5a08012fdc5b695499f83ecb');
require('../../pages/zheYeList/zheYeList?hash=0e4cc0b8b964669a5a08012fdc5b695499f83ecb');
require('../../pages/chatDetail/chatDetail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/chooseCity/chooseCity?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/myReservation/myReservation?hash=0e4cc0b8b964669a5a08012fdc5b695499f83ecb');
require('../../pages/mySubscribePan/mySubscribePan?hash=9a660d62c3ef850a072ad2549a973696022f3cec');
require('../../pages/myCollectRasion/myCollectRasion?hash=0e4cc0b8b964669a5a08012fdc5b695499f83ecb');
require('../../pages/articleDetail/articleDetail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/articleList/articleList?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/YhLouPanList/YhLouPanList?hash=9a660d62c3ef850a072ad2549a973696022f3cec');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}