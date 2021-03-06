/**
 * Created by a on 2017/8/10.
 */
const express = require('express');
const router = express.Router();
const http = require('http');

const lodash = require('lodash');

// const host_ip = require('../util/index').host_ip;
const client =  require('../config').client;
const server = require('../config').server;

/* GET config listing. */
router.get('/', function (req, res, next) {
    const config = {
        host: client.HOST,
        port: client.PORT,
        path: client.PATH,
    }
    res.json(config);
});

router.get('/map', function (req, res, next) {
    res.json(client.map);
});

router.get('/model', function (req, res, next) {
   res.json(client.model);
});
router.get('/domain', function (req, res, next) {
    res.json(client.domain);
})

router.get('/module', function (req, res, next) {
    const userJson = req.query.user;
    if(userJson){
        const user = JSON.parse(req.query.user);

        let options = {
            host: client.HOST,
            port: client.PORT,
            path: client.PATH+"/users/"+user.userId,
            method: 'GET',
            headers: {
                // "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        }

        let httpReq = http.request(options, response=>{
            let body = '';
            response.on('data', data=>{
                body += data;
            })

            response.on('end', ()=>{
                // console.log('body:', body, JSON.parse(body).roleId);
                let modules = JSON.parse(body).modules;
                if(user.role=="admin"){
                    res.json(client.module);
                }else{

                    let moduList = [];

                    if(!modules){
                        moduList = [{"key": "asset", "title": "资产管理", "link": "/assetManage/manage"}];
                    }else{
                        modules.forEach(mod=>{
                            let curMod = lodash.find(client.module, modu=>{return modu.key == mod});
                            if(curMod){
                                moduList.push(curMod);
                            }
                        })
                    }

                    res.json(moduList);
                }
            })
        })

        httpReq.on('error', e=>{
            console.log("message:",e.message);
        })

        httpReq.end();
    }else{
        res.json("invalid params");
    }
});

router.get('/moduleDefault', function(req, res, next){
    res.json(client.moduleDefault);
})
router.get('/strategyDevice', function (req, res, next) {
    res.json(client.strategyDevice);
})

router.get('/lightLevel', function (req, res, next) {
    res.json(client.lightLevel);
})

router.get('/mediaPublish/preview', function (req, res, next) {
    res.json(server.preview);
})
module.exports = router;