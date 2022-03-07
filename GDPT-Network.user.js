// ==UserScript==
// @name         自动登录
// @namespace    http://tampermonkey.net/
// @updateURL       https://cdn.jsdelivr.net/gh/bai-yumo/GDPT-Network@master/GDPT-Network.user.js
// @downloadURL     https://cdn.jsdelivr.net/gh/bai-yumo/GDPT-Network@master/GDPT-Network.user.js
// @version      0.5
// @description  gzy校园网自动登录
// @author       bai
// @match        http://10.110.141.3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=141.3
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
const username = ''; //学号
const password = ''; //密码

function login(vCode) {
    console.log("===开始登录===");
    let validcode='';
    if (vCode)validcode=vCode;
    console.log("[验证码]:"+validcode);
    const url = window.location.href;
    const patt = /index.jsp\?(.*)/g;
    const queryString = encodeURIComponent(patt.exec(url)[1]);
    const body = 'userId=' + username + '&password=' + password + '&service=&queryString=' + queryString + '&operatorPwd=&operatorUserId=&validcode='+validcode+'&passwordEncrypt=false';
    const httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
    httpRequest.open('POST', 'http://10.110.141.3/eportal/InterFace.do?method=login', true); //第二步：打开连接
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
    httpRequest.send(body);//发送请求 将情头体写在send中
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {//验证请求是否发送成功
            const resp = JSON.parse(httpRequest.responseText);//获取到服务端返回的数据
            console.log(resp);
            if (resp.result === 'fail') {
                setTip(resp.message);
            } else {
                setTip("连接成功！");
                window.location.href="http://10.110.141.3";
            }
        }
    };
}


function setTip(text) {
    if (!document.getElementById('tip')) {
        const createTip = document.createElement('div');
        createTip.id = 'tip';
        createTip.style.color = '#ff0000';
        document.body.insertBefore(createTip, document.body.firstElementChild);
    }
    const tip = document.getElementById('tip')
    tip.innerText = "自动连接提示:" + text;
}

function vCodeLogin() {
    const codeInput =document.getElementById('validCode');
    const code = codeInput.value;
    codeInput.onblur=function () {
        if (code!==''){
            login(codeInput.value);
        }
    }
}


function main() {
    if (document.title !== '上网认证') return;

    const isValidCode = document.getElementById('isDisplayValidCode').style.display !== 'none'
    if (!isValidCode) {
        login();
    } else {
        setTip('需要验证码，输入验证码后自动登录')
        vCodeLogin();
    }
}

main()
})();
