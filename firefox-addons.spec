#RPM Build of Firefox Addons
#First create a tar.gz of the source code
#Second, copy the file to SPECS dir and the tar.gz to SOURCES
#Third, run rpmbuild -ba <SPEC file> or rpmbuild -bb <SPEC file>

Summary: A collaction of some addons useful for Firefox, Thunderbird and SeaMonkey
Name: Firefox-addons
Version: 1.0
Release: 1
License: GPLv2
Group: Applications/Internet
Source0: firefox-addons.tar.gz
Requires: firefox
URL: http://adrianarroyocalle.github.io/firefox-addons
%description
This package is a collection of some addons for Firefox, Thunderbird and SeaMonkey
created by Adrian Arroyo Calle
%prep
%setup -qn firefox-addons
%install
mkdir -p %{buildroot}/usr/share/mozilla/extensions
cp google-share/src/google-share.xpi %{buildroot}/usr/share/mozilla/extensions/
cp divel-notepad/src/divel-notepad.xpi %{buildroot}/usr/share/mozilla/extensions/
cp divfind/src/divfind.xpi %{buildroot}/usr/share/mozilla/extensions/
cp divhttp/src/divhttp.xpi %{buildroot}/usr/share/mozilla/extensions/
cp mozcleaner/src/mozcleaner.xpi %{buildroot}/usr/share/mozilla/extensions/
cp quick-bananabread/src/quick-bananabread.xpi %{buildroot}/usr/share/mozilla/extensions/
cp next-tuenti/src/next-tuenti.xpi %{buildroot}/usr/share/mozilla/extensions/
cp save-to-drive/src/save-to-g-drive.xpi %{buildroot}/usr/share/mozilla/extensions/
cp tuenti-share/bin/tuenti_share-1.0-sm+an+fx-windows.xpi %{buildroot}/usr/share/mozilla/extensions
cp el-tiempo-en-espana/bin/eltiempoespana-2.1.xpi %{buildroot}/usr/share/mozilla/extensions

%files
/usr/share/mozilla/extensions/*
%changelog
* Tue Aug 27 2013 Adrian Arroyo Calle <adrian.arroyocalle@gmail.com>
- Added Google+ Share
