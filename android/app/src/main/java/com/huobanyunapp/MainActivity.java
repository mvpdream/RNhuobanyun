package huoban.core;

import com.facebook.react.ReactActivity;
import cn.reactnative.modules.jpush.JPushPackage;
import android.os.Bundle;
import com.baidu.mapapi.SDKInitializer;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SDKInitializer.initialize(this.getApplicationContext());
    }
    @Override
    protected String getMainComponentName() {
        return "HuoBanYunApp";
    }
}
