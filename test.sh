#!/bin/bash

set -e

echo "Firefox-Addons test suite"

ADDONS=("mozcleaner" "bc-vc-shortener" "divel-notepad" "divfind" "divhttp" "divtranslate" "google-adsense-earnings" "google-share" "google-share-android" "no-mas-900" "send-to-mail" "the-super-clock")

for addon in ${ADDONS[@]}; do
	echo -e "\e[34mValidating $addon\e[0m"
	cd ${addon}/src
	jpm xpi
	addons-validator *.xpi
	cd ../..
done
