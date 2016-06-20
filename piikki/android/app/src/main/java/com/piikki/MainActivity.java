package com.piikki;

import com.smixx.reactnativeicons.ReactNativeIcons;
import com.facebook.react.ReactActivity;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactRootView;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "piikki";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected ReactRootView createRootView() {
        ReactRootView mReactRootView = super.createRootView();
        mReactRootView.setBackgroundColor(0xFF000000);
        return mReactRootView;
    }
    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new ReactNativeIcons()
        );
    }
}
