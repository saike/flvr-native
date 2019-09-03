const geolocation = require("nativescript-geolocation");
const Accuracy = require("tns-core-modules/ui/enums").Accuracy;
const application = require("tns-core-modules/application");
const device = require("tns-core-modules/platform");
const utils = require("tns-core-modules/utils/utils");

let watchID;
let service;

function clearWatch() {
    if (watchID) {
        geolocation.clearWatch(watchID);
        watchID = null;
    }
}

function startWatch() {
    console.log("starting watch??");
    clearWatch();
    watchID = geolocation.watchLocation(
        function (loc) {
            console.log("repeat?");
            if (loc) {
                console.log("Background location: " + loc.latitude + ", " + loc.longitude);
            }
        },
        function (err) {
            console.log(err);
        }, {
            desiredAccuracy: Accuracy.high,
            updateDistance: 5,
            updateTime: 1000
        }
    );
}

application.on(application.exitEvent, clearWatch);

if (application.android) {
    android.app.job.JobService.extend("com.nativescript.location.BackgroundService26", {
        onStartJob() {
            console.log("service onStartJob");
            geolocation.isEnabled().then((enabled) => {
                if(enabled) {
                    startWatch();
                }
            })
            return true;
        },
        onStopJob(jobParams) {
            console.log("service onStopJob");
            this.jobFinished(jobParams, false);
            clearWatch();
            return false;
        },
    });

}

application.on(application.suspendEvent, args => {

    // background recording segment
    if (application.android) {
      var context = utils.ad.getApplicationContext();
      var component = new android.content.ComponentName(context, com.nativescript.location.BackgroundService26.class);
      var builder = new android.app.job.JobInfo.Builder(1, component);
      builder.setRequiredNetworkType(android.app.job.JobInfo.NETWORK_TYPE_ANY);
      builder.setOverrideDeadline(0);
      //builder.setPeriodic(30);
      const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
      service = jobScheduler.schedule(builder.build());
      console.log(`Job Scheduled: ${jobScheduler.schedule(builder.build())}`);
      // var intent = new android.content.Intent(context, com.oa.location.BackgroundService26.class);
      // context.startService(intent);
    }

      console.log("suspended");
  });


application.on(application.resumeEvent, args => {
  if (args.android && service) {
    //geolocation.clearWatch(watchID);
    console.log("resumed");
    // remove background recording
    var context = utils.ad.getApplicationContext();
    const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
    jobScheduler.cancel(service);
    console.log("Canceled " + service);
    service = null;
  }
});