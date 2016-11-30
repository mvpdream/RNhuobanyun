package huoban.core;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import cn.reactnative.baidumap.BDMapPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.image.zoom.ReactImageZoom;
import com.rnfs.RNFSPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts; 
import com.skierkowski.WifiManager.*; 
import cn.reactnative.modules.jpush.JPushPackage;
import com.devstepbcn.wifi.AndroidWifiPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BDMapPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
             new ReactImageZoom(),
             new RNFSPackage(),
             new ReactNativeDialogsPackage(),
             new WebViewBridgePackage(),
             new ReactNativeContacts(),
             new WifiManager(),
              new JPushPackage(),
               new AndroidWifiPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
