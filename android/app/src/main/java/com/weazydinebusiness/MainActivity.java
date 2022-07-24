package com.weazydinebusiness;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
//import org.cboy.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {

   // if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      // only for gingerbread and newer versions
      SplashScreen.show(this);  // here
   // }




    super.onCreate(savedInstanceState);
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "weazydinebusiness";
  }
}