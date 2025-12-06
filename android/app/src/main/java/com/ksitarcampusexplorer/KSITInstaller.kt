package com.ksitarcampusexplorer

import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.content.FileProvider
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

class KSITInstaller(private val reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "KSITInstaller"

    @ReactMethod
    fun installARApp() {
        try {
            // Read APK from raw resources
            val inputStream = reactContext.resources.openRawResource(R.raw.ksit_ar)
            
            // Use external files directory (works on Android 10-14)
            val externalFilesDir = reactContext.getExternalFilesDir(null)
                ?: reactContext.filesDir
            
            // Ensure directory exists
            externalFilesDir.mkdirs()
            
            val outputFile = File(externalFilesDir, "ksit_ar.apk")
            
            // Delete existing file if present
            if (outputFile.exists()) {
                outputFile.delete()
            }

            // Copy APK to external files directory
            inputStream.use { input ->
                FileOutputStream(outputFile).use { output ->
                    input.copyTo(output)
                    output.flush()
                }
            }

            // Get URI using FileProvider with correct authority
            val authority = "${reactContext.packageName}.provider"
            val apkUri = FileProvider.getUriForFile(
                reactContext,
                authority,
                outputFile
            )

            // Create intent with proper flags for Android 12+
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                // Required flags for Android 12+
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                // Additional flag for Android 7.0+
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
                }
            }

            // Start activity - this will open the package installer
            val chooser = Intent.createChooser(intent, "Install AR App")
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(chooser)

        } catch (e: Exception) {
            e.printStackTrace()
            // Log error for debugging
            android.util.Log.e("KSITInstaller", "Failed to install AR app", e)
        }
    }
}
