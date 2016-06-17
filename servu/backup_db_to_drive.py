#!/usr/bin/env python

from subprocess import call
import datetime

print str(datetime.date.today())

filename = "transacts" + str(datetime.date.today()) + ".csv"
asd = "mongoexport -h vituttaa.paitsiossa.net:27017 -d prod -c transactions -u prod -p prod -o" + filename + " --csv -f username,amount,pricePer,date,product"
call(asd, shell=True)
call("~/gdrive/drive push -no-prompt --destination Paitsio " + filename, shell=True)
