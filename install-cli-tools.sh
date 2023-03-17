#!/bin/bash

echo Y | apt-get update;
echo Y | apt-get install apt-utils;
echo Y | apt-get install jq;
echo Y | apt-get install curl;
echo Y | apt-get install alien;
echo Y | apt-get install unzip;

if [[ "$ARCH" == "x86" ]];
  then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip -q awscliv2.zip && \
    ./aws/install \
    || exit 1;
fi
if [[ "$ARCH" == "arm" ]];
  then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
    unzip -q awscliv2.zip && \
    ./aws/install \
    || exit 1;
fi

echo Y | apt-get install dpkg || exit 1

if [[ "$ARCH" == "x86" ]];
  then 
    curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb" && \
    dpkg -i session-manager-plugin.deb \
    || exit 1;
fi
if [[ "$ARCH" == "arm" ]];
  then
    curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_arm64/session-manager-plugin.deb" -o "session-manager-plugin.deb" && \
    dpkg -i session-manager-plugin.deb \
    || exit 1;
fi