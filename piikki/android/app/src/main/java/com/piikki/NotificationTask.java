package com.piikki;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.widget.Toast;

  import com.facebook.react.HeadlessJsTaskService;
  import com.facebook.react.bridge.Arguments;
  import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class NotificationTask extends HeadlessJsTaskService {

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Toast.makeText(getApplicationContext(), "sercvice starting", Toast.LENGTH_SHORT).show();
		return super.onStartCommand(intent, flags, startId);
	}

	@Override protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
		Bundle extras = intent.getExtras();
		if (extras != null) {
			return new HeadlessJsTaskConfig("NotificationTask", Arguments.fromBundle(extras), 500); 
		} 
		return null;
	}
}

