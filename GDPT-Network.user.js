// ==UserScript==
// @name         自动登录
// @namespace    https://github.com/bai-yumo/GDPT-Network/
// @updateURL       https://cdn.jsdelivr.net/gh/bai-yumo/GDPT-Network@master/GDPT-Network.user.js
// @downloadURL     https://cdn.jsdelivr.net/gh/bai-yumo/GDPT-Network@master/GDPT-Network.user.js
// @version      0.7
// @description  gzy校园网自动登录
// @author       bai_yumo
// @match        http://10.110.141.3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=141.3
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const username = ""; //在""之间输入学号
    const password = ""; //在""之间输入密码

    function login(vCode) {
        console.log("===开始登录===");
        let validcode = '';
        if (vCode) validcode = vCode;
        console.log("[验证码]:" + validcode);
        const url = window.location.href;
        const patt = /index.jsp\?(.*)/g;
        const queryString = encodeURIComponent(patt.exec(url)[1]);
        const body = 'userId=' + username + '&password=' + password + '&service=&queryString=' + queryString + '&operatorPwd=&operatorUserId=&validcode=' + validcode + '&passwordEncrypt=false';
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
                    setTip(getErrMsg(resp.message));
                } else {
                    setTip("连接成功！");
                    window.location.href = "http://10.110.141.3";
                }
            }
        };
    }

    function getErrMsg(s) {
        if (/^运营商/g.test(s)) return "运营商用户认证失败或非可用网络时间段";
        if (/^用户不存在/g.test(s) || /^学号密码错误/g.test(s)) return s + "\n请检查配置学号密码";
        if (/^验证码错误/g.test(s)) return s + "\n刷新页面后重新输入";
        return s
    }

    function setTip(text) {
        const tip = document.getElementById('errorInfo_center')
        tip.innerText = "自动连接提示:" + text;
    }

    function vCodeLogin() {
        const codeInput = document.getElementById('validCode');
        codeInput.addEventListener('blur', function () {
            console.log("blur：" + codeInput.value)
            if (codeInput.value !== '') {
                login(codeInput.value);
            }
        })
    }


    function main() {
        if (document.title !== '上网认证') return;
        if (username === '' && password === '') {
            setTip('请在配置文件输入学号和密码,配置后刷新页面');
            return;
        }
        const isValidCode = document.getElementById('isDisplayValidCode').style.display !== 'none'
        if (!isValidCode) {
            login();
        } else {
            setTip('需要验证码，输入验证码后点击空白处自动登录')
            vCodeLogin();
        }
    }

    main()
})();
