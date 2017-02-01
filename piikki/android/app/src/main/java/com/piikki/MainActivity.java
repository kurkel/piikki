package com.piikki;

import com.facebook.react.ReactActivity;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;
import android.os.Bundle;
import android.widget.ImageView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected void onCreate(Bundle savedInstanceState) {
	RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.FIT_XY);
	super.onCreate(savedInstanceState);
    }

    @Override
    protected String getMainComponentName() {
        return "piikki";
    }
}
