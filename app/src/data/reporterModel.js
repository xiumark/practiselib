/**
 * Created by Azrael on 2017/10/16
 */
export const TreeData = [
    /*{
        "id": "device",
        "name": "设备",
        "toggled": true,
        "active": true,
        "link": "/reporterManage/device",
        "level": 1,
        "children": [
            {
                "id": 'lc',
                "name": "单灯控制器",
                "class": "icon_lc",
                "active": true,
                "link": "/reporterManage/device"
            },
            {
                "id": 'gateway',
                "name": "网关",
                "class": "icon_gateway",
                "active": false,
                "link": "/reporterManage/device/gateway"
            }
        ]
    },*/
    {
        "id": "stat",
        "name": "统计",
        "toggled": false,
        "active": false,
        "link": "/reporterManage/stat",
        "level": 1,
        "children": [
            {
                "id": 'energy',
                "name": "能耗",
                "class": "icon_lc",
                "active": true,
                "link": "/reporterManage/stat"
            },
            {
                "id": "lighting",
                "name": "照明",
                "class": "icon_lc",
                "active": false,
                "link": "/reporterManage/stat/lighting"
            }
        ]
    },
]
