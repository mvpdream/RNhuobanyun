package huoban.core;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.List;
import com.remobile.toast.*;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import android.content.Intent;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.image.zoom.ReactImageZoom;
import com.rnfs.RNFSPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.xiaobu.amap.AMapLocationReactPackage;
import com.devstepbcn.wifi.AndroidWifiPackage;
import cn.reactnative.modules.jpush.JPushPackage;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "RNhuobanyun";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new ReactNativeDialogsPackage(this),
            new ImagePickerPackage(this),
            new RCTToastPackage(),
            new JPushPackage(),
            new MainReactPackage(),
            new VectorIconsPackage(),
            new ReactNativeContacts(),
            new ReactImageZoom(),
            new RNFSPackage(),
            new WebViewBridgePackage(),
            new AndroidWifiPackage(),
            new AMapLocationReactPackage(),
            new AndroidKeyboardAdjustPackage(this)
        );
    }
}
