/**
 * Created by a on 2017/7/25.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Map from '../util/map'
import {transformDeviceType} from '../util/index'
import {getMapConfig} from '../util/network'

import lodash from 'lodash';
export default class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: "",
            map:{}
        }
        this.timeout = null;
        this.mapTimeOut = null;
        this.preMap = null;
        this.updatePreMap = this.updatePreMap.bind(this);
        this.initMap = this.initMap.bind(this);
        this.renderMap = this.renderMap.bind(this);
    }

    componentWillMount(){
        getMapConfig(response=>{
            this.setState({zoom:response.zoom})
        }, error=>{
            throw error;
        })
    }

    shouldComponentUpdate(){
        const {option, mapData} = this.props;
        if(this.state.map[mapData.id]
          && this.preMap
          && this.preMap.latlng
          && L.latLng(this.preMap.latlng)
          && this.preMap.zoom === option.zoom
          && L.latLng(this.preMap.latlng).equals(L.latLng(mapData.latlng))
          && lodash.isEqual(this.preMap.position, mapData.position)){
            return false;
        }

        this.updatePreMap();
        return true;
    }

    componentDidUpdate() {
      const {mapData, panLatlng, panCallFun} = this.props;
      this.initMap();
      if (panLatlng) {
        this.state.map[mapData.id].mapPanTo(panLatlng);
        panCallFun && panCallFun();
      }
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.mapTimeOut && clearTimeout(this.mapTimeOut);
        for (let key in this.state.map) {
            this.state.map[key].destroy();
        }
    }

    updatePreMap(){
        const {option, mapData} = this.props;
        this.preMap = {
            zoom:option.zoom,
            latlng:mapData.latlng,
            position: mapData.position
        };
    }

    initMap() {
        const {option, mapData, mapCallFun=null, markerCallFun=null} = this.props;
        const {zoom} = this.state;
        let {latlng={lat: null, lng: null}} = mapData;
        if( option && !option.zoom){
            option.zoom = zoom;
        }

        if (mapData) {
            if (!this.state.map[mapData.id]) {
                this.state.map[mapData.id] = new Map();
            }
            this.state.map[mapData.id].clearMarker();
            this.mapTimeOut && clearTimeout(this.mapTimeOut);
            // this.mapTimeOut = setTimeout(()=>{
                this.state.map[mapData.id].updateMap({
                    id: mapData.id,
                    latlng: latlng
                }, option, mapCallFun);
            // }, 33);

            if (mapData.position && mapData.position.length) {
                let deviceList = {};
                mapData.position.map(pos=>{
                    let key = transformDeviceType(pos["device_type"]);
                    if(!deviceList[key]){
                        deviceList[key] = [];
                    }

                    const deviceData = lodash.find(mapData.data, dd=>{ return dd.id == pos["device_id"] })

                    deviceData && deviceList[key].push(deviceData);
                })


                this.timeout && clearTimeout(this.timeout);
                this.timeout = setTimeout(()=>{
                    this.state.map[mapData.id].updateMapDevice(mapData.position, deviceList, markerCallFun)
                }, 33)
            }
        }
    }

    renderMap(ref) {
        if (ref) {
            this.initMap();
        }
    }

    render() {
        const {className='', mapData, mapIcon=false} = this.props;
        return <div className={"map-view "+(mapIcon?"map-icon ":" ")+className} ref={this.renderMap} id={mapData && mapData.id}></div>
    }
}

/*
MapView.propTypes = {
    mapData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        // latlng: PropTypes.shape({
        //     lat: PropTypes.number.isRequired,
        //     lng: PropTypes.number.isRequired,
        // })
    }).isRequired
}*/
