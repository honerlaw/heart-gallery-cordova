#!/bin/bash
if [ "$#" -eq 1 ]; then
  #keytool -genkey -v -keystore release-key.keystore -alias sevo_development -keyalg RSA -keysize 2048 -validity 10000
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore $1.apk sevo_development
  jarsigner -verify -verbose -certs $1.apk
  /usr/local/cellar/android-sdk/23.0.2/build-tools/21.1.2/zipalign -v 4 $1.apk $1-aligned.apk
else
  echo "Invalid usage: sign-apk.sh apk_name"
fi
