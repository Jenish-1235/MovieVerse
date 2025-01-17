package com.moviemania

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Initialize the splash screen with the theme resource ID
        RNBootSplash.init(this, R.style.BootSplashTheme)
        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String? {
        return "MovieMania" // Ensure this matches your project name
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun createRootView(): ReactRootView {
                return ReactRootView(this@MainActivity)
            }
        }
    }
}
