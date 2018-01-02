/**
 * Created by a on 2017/7/25.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Map from '../util/map'
import {transformDeviceType} from '../util/index'
import {getMapConfig} from '../util/network'

export default class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: "",
            map:{}
        }
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

    componentDidUpdate() {
        const {mapData, panLatlng, panCallFun} = this.props;
        this.initMap();
        if (panLatlng) {
            console.log('panLanlng:', panLatlng);
            this.state.map[mapData.id].mapPanTo(panLatlng);
            panCallFun && panCallFun();
        }
    }

    componentWillUnmount() {
        for (let key in this.state.map) {
            this.state.map[key].destroy();
        }
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
            this.state.map[mapData.id].updateMap({
                id: mapData.id,
                latlng: latlng
            }, option, mapCallFun);
            if (mapData.position && mapData.position.length) {
                let key = transformDeviceType(mapData.position[0]["device_type"]);
                this.state.map[mapData.id].updateMapDevice(mapData.position, {[key]: mapData.data}, markerCallFun)
            }
        }
    }

    renderMap(ref) {
        if (ref) {
            this.initMap();
        }
    }

    render() {
        const {className='', mapData} = this.props;
        return <div className={"map-view "+className} ref={this.renderMap} id={mapData && mapData.id}></div>
    }
}

MapView.propTypes = {
    mapData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        // latlng: PropTypes.shape({
        //     lat: PropTypes.number.isRequired,
        //     lng: PropTypes.number.isRequired,
        // })
    }).isRequired
}