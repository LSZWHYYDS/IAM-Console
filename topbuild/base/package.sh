#!/bin/bash
set -e -x
#===============================================================================
#
#          FILE: package.sh
#
#
#   DESCRIPTION:  script to package iam, put all together
#
#       OPTIONS:  ---
#  REQUIREMENTS:  ---
#          BUGS:  ---
#         NOTES:  ---
#        AUTHOR:  Chen Xi
#       VERSION:  1.0
#       CREATED:  06/19/2019 20:12:43 AM CST
#      REVISION:  ---
#===============================================================================#
SCRIPT=$(readlink -f $0)
SCRIPTPATH=$(dirname ${SCRIPT})


# WORKBASE is output dir
declare -r WORKBASE="${SCRIPTPATH}/../target"
declare -r PROJECTBASE="${SCRIPTPATH}/../.."
declare -r APPNAME="iam-console"
function package(){
	rm -rf "${PROJECTBASE}"/build
	echo "remove build dir: "${PROJECTBASE}"/build"

	npm install --registry=https://registry.npm.taobao.org
	npm run-script build

	echo "remove package floder: ${WORKBASE}/${APPNAME}"
	rm -rf ${WORKBASE}/${APPNAME}
	mkdir -p ${WORKBASE}/${APPNAME}
	cd ${PROJECTBASE}
	cp -rf dist/* $WORKBASE/${APPNAME}

 	cd ${WORKBASE}/${APPNAME}
	echo `git rev-parse --short HEAD` > version
   local build_tar="${WORKBASE}/${APPNAME}.tar.gz"
   tar cvzfp ${build_tar} ./*
}

function clean_app_target() {
    [[ -d "${WORKBASE}" ]] && rm -rf "${WORKBASE}" 2>/dev/null
    echo "Clean up path: ${app_dir}"
}

################################ MAIN ROUTINE ##########################################
function main(){
    #package, put all together.
    package
    echo "Success!"
}

###### MAIN ENTRY ####
main "@"

