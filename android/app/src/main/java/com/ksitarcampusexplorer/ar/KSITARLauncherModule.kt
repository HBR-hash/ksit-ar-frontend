package com.ksitarcampusexplorer.ar

import android.content.Intent
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KSITARLauncherModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val pm: PackageManager = reactContext.packageManager

  override fun getName(): String = "KSITARLauncher"

  @ReactMethod
  fun isAppInstalled(packageName: String, promise: Promise) {
    try {
      // Use getApplicationInfo which works in both debug and release modes
      // This method doesn't require special permissions and works reliably
      pm.getApplicationInfo(packageName, 0)
      promise.resolve(true)
    } catch (e: PackageManager.NameNotFoundException) {
      promise.resolve(false)
    } catch (e: Exception) {
      // Log error for debugging
      android.util.Log.e("KSITARLauncher", "Error checking app installation", e)
      promise.resolve(false)
    }
  }

  @ReactMethod
  fun launchExperience(packageName: String, activityName: String, promise: Promise) {
    try {
      // Verify app is installed first
      try {
        pm.getApplicationInfo(packageName, 0)
      } catch (e: PackageManager.NameNotFoundException) {
        promise.reject("APP_NOT_INSTALLED", "AR app is not installed", e)
        return
      }

      // Create intent with explicit component
      val targetComponent = android.content.ComponentName(packageName, activityName)
      val intent = Intent().apply {
        component = targetComponent
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
      }

      // Verify the activity exists before launching
      val resolveInfo = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY)
      if (resolveInfo == null) {
        promise.reject("ACTIVITY_NOT_FOUND", "Activity $activityName not found in package $packageName")
        return
      }

      // Launch the activity
      val activity = currentActivity
      if (activity != null) {
        activity.startActivity(intent)
      } else {
        reactApplicationContext.startActivity(intent)
      }
      promise.resolve(null)
    } catch (e: Exception) {
      android.util.Log.e("KSITARLauncher", "Error launching AR experience", e)
      promise.reject("LAUNCH_ERROR", e.localizedMessage ?: "Unknown error", e)
    }
  }
}

