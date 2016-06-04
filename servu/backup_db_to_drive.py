#!/usr/bin/env python

from subprocess import call
import datetime

print str(datetime.date.today())

filename = "transacts" + str(datetime.date.today()) + ".csv"
asd = "mongoexport -h ds021671.mlab.com:21671 -d piikkidevv2 -c transactions -u dev -p dev -o" + filename + " --csv -f username,amount,pricePer,date,product"
call(asd, shell=True)
call("~/gdrive/drive push -no-prompt --destination Paitsio " + filename, shell=True)
