// ==UserScript==
// @name        1000호대 저항제어 및 VVVF 정보 표시
// @namespace   d
// @include     https://smss.seoulmetro.co.kr/traininfo/traininfoUserView.do
// @version     1
// @grant       GM.xmlHttpRequest
// ==/UserScript==

var oDate = new Date();
var month = oDate.getMonth() + 1;
var day = oDate.getDate();
var sDate = oDate.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
var rheostatic = [], vvvf = [];

function fetchData(set, callback) {
	if(set < 101) set = 101;
	if(set > 116) return callback();
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://tabriz.kr/api/search_api.php?company=S&trainNumber=&setNumber=' + set + '&date_start=' + sDate + '&date_end=' + sDate + '&page=1&sort=1',
		onload: function onload(res) {
			var data = JSON.parse(res.responseText);
      with(data) {
				if(status_code == 1) for(var i=0; i<totalNum; i++)
					(info[i].setNumber >= 111 ? rheostatic : vvvf).push(info[i].trainNumber);
				fetchData(set + 1, callback);
			}
		}
	});
}

fetchData(101, function() {
	console.log('저항제어:', rheostatic);
	console.log('VVVF:', vvvf);
	var rl = rheostatic.length, vl = vvvf.length;
	var style = document.createElement('style');
	var css = '';
	for(var k=0; k<rl; k++)
		css += 'div[class^="1line_"] div[class^="T"][title^="S' + ('0000' + rheostatic[k]).slice(-4) + '열차"][data-statntcd] { border-radius: 6px; background-color: rgba(226, 139, 141, .5); }';
	for(var k=0; k<vl; k++)
		css += 'div[class^="1line_"] div[class^="T"][title^="S' + ('0000' + vvvf[k]).slice(-4) + '열차"][data-statntcd] { border-radius: 6px; background-color: rgba(109, 150, 216, .5); }';
	for(var k=0; k<rl; k++)
		css += 'div[class^="1line_"] div[class^="T"][title^="' + ('0000' + rheostatic[k]).slice(-4) + '열차"][data-statntcd] { border-radius: 6px; background-color: rgba(255, 169, 171, .5); }';
	for(var k=0; k<vl; k++)
		css += 'div[class^="1line_"] div[class^="T"][title^="' + ('0000' + vvvf[k]).slice(-4) + '열차"][data-statntcd] { border-radius: 6px; background-color: rgba(139, 180, 246, .5); }';
	style.innerHTML = css;
	document.querySelector('body').appendChild(style);
});

