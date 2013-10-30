function UnityReady()
{

}
if(window.external!=undefined && window.external.getUnityObject!=undefined)
{
	var Unity=external.getUnityObject(1.0);
	Unity.init({name: "firefox-addons",
            iconUrl: "/tiny.jpg",
            onInit: UnityReady});
}
