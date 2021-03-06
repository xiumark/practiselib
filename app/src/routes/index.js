import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../app/container/index';
import Login from '../login/container/Login';
import AssetManage from '../assetManage/container/index';
import DomainManage from '../domainManage/container/index';
import PermissionManage from '../permissionManage/container/index';
import SystemOperation from '../systemOperation/container/index';
import SmartLightManage from '../smartLightManage/container/index';
import LightManage from '../lightManage/container/index';
import ReporterManage from '../reporterManage';
import MediaPublish from '../mediaPublishProject/container/index';

import { isAuthenticated, isAdmined, isLogged, hasAsset, hasDomain, hasPermission, hasMaintenance, hasLight, hasReport, hasPublish} from '../authentication/authWrapper';
const Authenticated = isAuthenticated(props => props.children);
const Admined = isAdmined(props => props.children);
const Logged = isLogged(props => props.children);
const Asset = hasAsset(props => props.children);
const Domain = hasDomain(props => props.children);
const Permission = hasPermission(props => props.children);
const Maintenance = hasMaintenance(props => props.children);
const Light = hasLight(props => props.children);
const Report = hasReport(props => props.children);
const Publish = hasPublish(props => props.children);

export default (
  <Route>
    <Route component={Logged}>
      <Route path="/login" component={Login}></Route>
    </Route>
    <Route component={Authenticated}>
      <Route path="/" component={App}></Route>
      <Route component={Asset}>
        <Route path="/assetManage" component={AssetManage}>
          <Route path="model">
            <Route path=":asset" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../assetManage/container/AssetDevice').default);
              }, 'starriverpro.assetmanage.asset');
            }} />

          </Route>
          <Route path="statistics">
            <Route path=":asset" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../assetStatistics/container/AssetStatistics').default);
              }, 'starriverpro.assetmanage.assetStatistics');
            }} />
          </Route>
        </Route>
      </Route>      
      <Route component={Domain}>
        <Route path="/domainManage" component={DomainManage}>
          <Route path="domainEdit">
            <Route path="list" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../domainManage/container/DomainEditList').default);
              }, 'starriverpro.domainmanage.domainEditList');
            }} />
            <Route path="topology" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../domainManage/container/DomainEditTopology').default);
              }, 'starriverpro.domainmanage.domainEditTopology');
            }} />
          </Route>
          <Route path="mapPreview" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../domainMapPreview/container/MapPreview').default);
            }, 'starriverpro.domainmappreview.mappreview');
          }} />
        </Route>
      </Route>      
      <Route component={Permission}>
        <Route path="/permissionManage" component={PermissionManage}></Route>
      </Route>
      <Route component={Maintenance}>
        <Route path="/systemOperation" component={SystemOperation}>
          <Route path="config">
            <Route path=":asset" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../systemOperation/container/DeviceConfig').default);
              }, 'starriverpro.systemoperation.asset');
            }}/>
          </Route>
          <Route path="strategy">
            <Route path="timeTable" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../controlStrategy/container/TimeStrategy').default);
              }, 'starriverpro.controlstrategy.timestrategy');
            }} />
            <Route path="sensor" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../controlStrategy/container/SensorStrategy').default);
              }, 'starriverpro.controlstrategy.sensortrategy');
            }} />
            <Route path="latlng" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../controlStrategy/container/LatlngStrategy').default);
              }, 'starriverpro.controlstrategy.latlngtrategy');
            }} />
          </Route>
          <Route path="serviceMonitor">
            <Route path="systemRunningState" getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../serviceMonitoring/container/SystemRunningState').default);
              }, 'starriverpro.serviceMonitoring.systemRunningState');
            }} />
            <Route path="serviceState" getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../serviceMonitoring/container/ServiceState').default);
              }, 'starriverpro.serviceMonitoring.serviceState');
            }} />
          </Route>
          <Route path="systemConfig">
            <Route path="sysConfigSmartLight" getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../systemConfig/container/sysConfigSmartLight').default);
              }, 'starriverpro.systemconfig.sysConfigSmartLight');
            }} />
            <Route path="sysConfigScene" getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../systemConfig/container/sysConfigScene').default);
              }, 'starriverpro.systemconfig.sysConfigScene');
            }} />
          </Route>
          <Route path="deviceMonitor">
            <Route path="deviceTopology" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../deviceMonitor/container/DeviceTopology').default);
              }, 'starriverpro.deviceMonitor.deviceTopology');
            }} />
            <Route path="deviceState" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../deviceMonitor/container/DeviceStateChart').default);
              }, 'starriverpro.deviceMonitor.deviceStateChart');
            }} />
          </Route>
          {/* <Route path="deviceMaintenance">
            <Route path="deviceReplace" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../deviceMaintenance/container/DeviceReplace').default);
              }, 'starriverpro.deviceMaintenance.deviceReplace');
            }} />
            <Route path="deviceUpdate" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../deviceMaintenance/container/DeviceUpdate').default);
              }, 'starriverpro.deviceMaintenance.deviceUpdate');
            }} />
          </Route> */}
          <Route path="faultManagement">
            {/* <Route path="alarm" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../faultManagement/container/Alarm').default);
              }, 'starriverpro.faultManagement.alarm');
            }} />
            <Route path="fault" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../faultManagement/container/Fault').default);
              }, 'starriverpro.faultManagement.fault');
            }} /> */}
            <Route path=":fault" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../faultManagement/container/index').default);
              }, 'starriverpro.faultManagement.fault');
            }}/>
          </Route>
        </Route>
      </Route>
      
      <Route path="/smartLight" component={SmartLightManage}>
        <Route path="map" getComponent={(nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../smartLightManage/container/SmartLightMap').default);
          }, 'starriverpro.smartLightManage.smartLightMap');
        }} />
        <Route path="list">
          {<IndexRoute getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightList/containers/SingleLampCon').default);
            }, 'starriverpro.smartLightList.SingleLampCon');
          }} />}
          <Route path=":gateway" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightList/containers/Gateway').default);
            }, 'starriverpro.smartLightList.Gateway');
          }} />
          <Route path="sensor" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightList/containers/Sensor').default);
            }, 'starriverpro.smartLightList.Sensor');
          }} />
          <Route path="screen" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightList/containers/Screen').default);
            }, 'starriverpro.smartLightList.Screen');
          }} />
          <Route path="chargePole" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightList/containers/ChargePole').default);
            }, 'starriverpro.smartLightList.ChargePole');
          }} />
          <Route path="xes" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightList/containers/Xes').default);
            }, 'starriverpro.smartLightList.Xes');
          }} />
        </Route>
        <Route path="control">
          <Route path="scene" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightControl/container/Scene').default);
            }, 'starriverpro.smartLightControl.scene');
          }} />
          <Route path="strategy" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../smartLightControl/container/Strategy').default);
            }, 'starriverpro.smartLightControl.strategy');
          }} />
        </Route>
      </Route>

      <Route component={Light}>
        <Route path="/light" component={LightManage}>
          <Route path="statistics" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../lightManage/container/lightStatistics').default);
            }, 'starriverpro.lightManage.lightStatistics');
          }} />
          <Route path="map" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../lightManage/container/lightMap').default);
            }, 'starriverpro.lightManage.lightMap');
          }} />
          <Route path="list">
            <Route path="ssslc" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../lightList/containers/SingleLampCon').default);
              }, 'starriverpro.lightList.SingleLampCon');
            }} />
            <Route path="ssgw" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../lightList/containers/Gateway').default);
              }, 'starriverpro.lightList.Gateway');
            }} />
          </Route>
          <Route path="control">
            {/* <Route path="scene" getComponent={(nextState, cb) => {
                          require.ensure([], (require) => {
                              cb(null, require('../lightControl/container/Scene').default)
                          }, 'starriverpro.lightControl.scene')
                      }} />
                      <Route path="strategy" getComponent={(nextState, cb) => {
                          require.ensure([], (require) => {
                              cb(null, require('../lightControl/container/Strategy').default)
                          }, 'starriverpro.lightControl.strategy')
                      }} /> */}
            <Route path="timeStrategy" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../lightControl/container/TimeStrategy').default);
              }, 'starriverpro.lightControl.timeStrategy');
            }} />
            <Route path="latlngStrategy" getComponent={(nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../lightControl/container/LatlngStrategy').default);
              }, 'starriverpro.lightControl.latlngStrategy');
            }} />
          </Route>
        </Route>
      </Route>
      
      <Route component={Report}>
        <Route path="/reporterManage" component={ReporterManage}>
          {/* <Route path="device">
            <IndexRoute getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../reporterManage/container/device/lc').default);
              }, 'starriverpro.reporterManage.device.lc');
            }} />
            <Route path="gateway" getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../reporterManage/container/device/gateway').default);
              }, 'starriverpro.reporterManage.device.gateway');
            }} />
          </Route> */}
          <Route path="stat">
            <IndexRoute getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../reporterManage/container/stat/energy').default);
              }, 'starriverpro.reporterManage.stat.energy');
            }} />
            <Route path='lighting' getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('../reporterManage/container/stat/lighting').default);
              }, 'starriverpro.reporterManage.stat.lighting');
            }}>
            </Route>
          </Route>
        </Route>
      </Route>
      
      <Route component={Publish}>
        <Route path="/mediaPublish" component={MediaPublish}>
          <Route path="statistics" getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublishStatistics/container/index').default);
            }, 'starriverpro.mediaPublishStatistics.container.statistics')
          }} />
          <Route path="map" getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublishMap/container/index').default);
            }, 'starriverpro.mediaPublishMap.container.map');
          }}>
          </Route>
          <Route path="screen" getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublishScreen/container/index').default);
            }, 'starriverpro.mediaPublishScreen.container.screen');
          }}>
          </Route>
          <Route path="playProject" getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublish/container/PlayerList').default);
            }, 'starriverpro.mediaPublishProject.container.PlayerList');
          }}>
          </Route>
          <Route path="playerProject" getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublishProject/container/PlayerList').default);
            }, 'starriverpro.mediaPublishProject.container.PlayerList');
          }}>
          </Route>
        </Route>
        <Route path="/mediaPublish/playerProject/:project">
          <IndexRoute getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublish/container/PlayerArea').default);
            }, 'starriverpro.mediaPublish.container.PlayArea');
          }} />
        </Route>
        <Route path="/mediaPublish/playProject/:project">
          <IndexRoute getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublishProject/container/PlayProject').default);
            }, 'starriverpro.mediaPublishProject.container.PlayProject');
          }} />
        </Route>
        <Route path="/mediaPublish/playProject/:project/:plan">
          <IndexRoute getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('../mediaPublishProject/container/PlayPlan').default);
            }, 'starriverpro.mediaPublishProject.container.PlayPlan');
          }} />
        </Route>
      </Route>      
    </Route>
    <Route path="*" getComponent={(nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../common/containers/NoMatch').default);
      }, 'nomatch');
    }} />
  </Route>
);

/*   cb(null, require('../mediaPublish/container/PlayerList').default);
 }, 'starriverpro.mediaPublish.container.PlayerList');*/

/*<Route path="/home" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/Home').default)
 }, 'home')
 } }/>
 <Route path="/about" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/About').default)
 }, 'about')
 } }/>
 <Route path="/course" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/Course').default)
 }, 'about')
 } }/>*/
