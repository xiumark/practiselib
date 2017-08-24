/**
 * Created by a on 2017/7/3.
 */
import React, { Component } from 'react'
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {onToggle} from '../common/actions/treeView'

import {getLanguage} from '../util/index'
export class TreeView extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: getLanguage()
        },

        this.renderTree = this.renderTree.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node){
        const {actions} = this.props
        actions && actions.onToggle(node)
        this.props.onToggle && this.props.onToggle(node);
    }

    renderTree(datalist, index, toggled){
        if(!datalist){
            return null;
        }
        let curIndex = index;
        let nextIndex = index + 1;
        let style = {"height":index>1 ? (toggled ? datalist.length*40+'px':'0'):'auto'};
        return <ul className={"tree-"+curIndex} style={style}>
            {
                datalist.map((node, index)=> {
                    let count = this.state.language=='zh'?6:10;
                    let value = node.name.slice(0, count)+(node.name.length>count?'...':'');
                    if(curIndex > 1){console.log("tree2");
                        return <li key={index} className={'node '+(node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}><svg><use xlinkHref={"#"+(node.class)} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>
                                        <span>{value}</span></div></Link>
                                    {node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }else{console.log("tree1");
                        return <li key={index} className={'node '+(node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}><span className={'glyphicon '+(node.toggled ? 'glyphicon-triangle-bottom':'glyphicon-triangle-right')}></span>
                                        {value}</div></Link>
                                    {node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }
                    
                })
            }
        </ul>
    }

    render(){
        const {datalist} = this.props;
        return <div className="tree-list">
            <svg className="svgOnload"> 
                <symbol id="icon_led_light"><path d="M172.588,27.369c-31.768-31.768-83.273-31.768-115.041,0c-4.199,4.199-8.78,12.885-11.63,19.298
    c-0.144,0.324,6.657,1.71,12.664,4.607c22.747-33.748,54.284-33.755,54.284-33.755s2.854-0.09,5.964,0.123
    c0.346,0.024-0.883,5.258-0.909,6.509c-3.748-0.306-34.67-0.013-52.868,28.676c-5.886,13.34,12.852,35.172,32.55,54.233
    c18.236,17.646,36.301,31.764,47.801,30.211c48.097-24.104,25.472-81.312,20.62-87.684c-18.565-20.564-32.845-24.516-41.648-25.272
    c-0.244-0.021-1.5,12.06-3.25,14.185c-29.25,6.75-44.75,34.75-43,20.875c0.13-1.033,12.209-17.151,44.625-27.625
    c0.566-3.593,1.179-7.431,1.062-7.438c-1.68-0.092-4.419-0.188-5.625-0.188c0.534-1.832,0.897-6.433,1.156-6.406
    c12.828,1.305,40.266,7.564,54.859,35.499c21.391,43.226-3.976,72.883-5.149,74.301c-6.662,8.729-19.38,15.075-32.861,19.617
    c-0.27,0.091-6.301-2.574-9.187-3.735c-0.169-0.068-19.372-12.919-20.337-12.56c-6.979,2.596-11.399,8.682-23.5,7.992
    c-10.746-1.66-27.273,19.899-27.981,21.242c-0.685,1.3-3.381,5.723,4.137,3.025c4.741-5.351,17.08-14.166,30.057-13.116
    c8.684,0.703,22.588-3.047,22.575-3.043c-0.099,0.033,10.483-2.692,12.802-3.754c2.612,0.206,10.544,4.23,10.286,4.312
    c-22.963,7.381-48.299,10-48.299,10S52.23,194.024,29.24,173.637s9.418-51.805,9.418-51.805s6.517-5.766,10.055-24.424
    c0.095-3.048,2.348-23,2.537-25.658c1.605,0.64,8.145,9.585,8.125,10.75c-1.542,5.273-4.875,21.25-4.473,27.501
    c-0.121,3.062,2.691,10.749-12.046,30.634c-0.226,0.305-3.076,8.303,3.025,4.137c4.624-3.157,19.524-13.935,20.253-24.62
    c-0.607-13.46,5.904-16.018,8.803-21.276c0.111-0.201,3.538,4.536,4.989,6.331c0.059,0.073-8.812,18.564-8.76,18.627
    c0.152,0.183,5.271,6.167,9.667,8.667c5.854-2.062,17.024-7.049,17.667-8.333c0.244-0.488-17.94-18.286-17.938-18.292
    c0.128-0.282-5.505-7.235-5.396-7.542c-0.329-1.162-12.073-14.365-13.57-15.177c-0.628-0.813-10.376-12.297-10.245-13.097
    C53,60,57.096,54.481,58.283,51.876c-6.258-2.162-12.802-4.442-12.955-4.05C36.752,69.761,34.6,96.828,34.6,96.828
    s-1.157,11.203-5.157,15.192c-0.023,0.023-0.046,0.046-0.068,0.068C14.228,127.235,7.294,146.633,9.75,162.512
    c0.271,1.752-0.338,3.527-1.592,4.78l-1.354,1.354c-6.253,6.253-2.514,12.624,3.739,18.878l1.89,1.89
    c6.253,6.253,12.747,10.114,19,3.861l1.445-1.445c1.247-1.247,3.009-1.857,4.753-1.596c15.844,2.374,35.15-4.565,50.238-19.653
    c0.023-0.023,0.046-0.046,0.068-0.068c3.99-4,15.192-5.157,15.192-5.157s50.531-4.018,69.46-22.947
    C204.356,110.642,204.356,59.137,172.588,27.369z
"/></symbol> 
                <symbol id="icon_light_control"><path d="M185.484,30.604c0-8.649-7.04-15.689-15.689-15.689H30.105c-8.649,0-15.689,7.04-15.689,15.689v34.194
    c0,3.419,1.106,6.638,3.118,9.353c-2.011,2.715-3.118,5.934-3.118,9.353v34.194c0,3.419,1.106,6.638,3.118,9.353
    c-2.011,2.715-3.118,5.934-3.118,9.353v34.194c0,8.649,7.04,15.689,15.689,15.689h139.691c8.649,0,15.689-7.04,15.689-15.689
    v-34.194c0-3.419-1.106-6.638-3.118-9.353c2.011-2.715,3.118-5.934,3.118-9.252V83.604c0-3.419-1.106-6.638-3.118-9.353
    c2.011-2.715,3.118-5.934,3.118-9.252V30.604z M172.812,65.099c-0.201,1.408-1.408,2.514-2.917,2.514H30.105
    c-1.609,0-2.917-1.307-2.917-2.917V48.055c0,0,11.523-0.077,14.024-0.077c0.454,12.565,19.67,16.374,23.024-0.127
    c0.305-0.005,2.033-0.017,4.832-0.035c0.966,12.499,18.988,14.091,20.751-0.119c5.648-0.031,13.852-0.097,13.852-0.097l-0.038,8.944
    h54.955l0-18.268l-54.88,0.075l0.076,8.793c0,0-8.327-0.003-14.023-0.016c-0.284-14.159-19.613-14.671-20.58-0.045
    c-2.867-0.006-4.621-0.009-4.889-0.009C62.986,30.64,42.008,31.31,41.212,47.581c-1.478,0-14.099,0.114-14.099,0.114l0.075-17.192
    c0-1.609,1.307-2.917,2.917-2.917h139.691c1.609,0,2.917,1.307,2.917,2.917v34.194L172.812,65.099L172.812,65.099z M27.188,83.403
    c0-1.609,1.307-2.917,2.917-2.917h139.691c1.609,0,2.917,1.307,2.917,2.917v34.495c-0.201,1.408-1.408,2.514-2.917,2.514H30.105
    c-1.609,0-2.917-1.307-2.917-2.917v-16.532c0,0,12.546-0.098,13.683-0.098c0.91,13.23,19.955,13.685,21.262-0.152
    c0.244,0,5.724-0.048,7.239-0.048c2.122,12.502,17.889,12.35,19.253-0.136c5.062-0.036,16.031-0.115,16.031-0.115l-0.038,8.715
    l53.516-0.131l0.037-17.965h-53.325l-0.152,9.2c0,0-10.996,0.039-16.069,0.058c-0.152-13.199-18.723-14.033-19.102,0.068
    c-4.4,0.015-7.144,0.025-7.391,0.025c-0.398-14.883-20.751-14.542-21.262,0.076c-1.592,0-13.683,0.049-13.683,0.049L27.188,83.403z
     M27.188,136.101c0-1.609,1.307-2.917,2.917-2.917h139.691c1.609,0,2.917,1.307,2.917,2.917v34.596
    c-0.201,1.408-1.408,2.514-2.917,2.514H30.105c-1.609,0-2.917-1.307-2.917-2.917V153.38c0,0,13.284-0.065,14.933-0.065
    c0.796,12.686,19.045,13.197,20.239-0.087c0.171,0,6.084-0.031,7.562-0.031c1.534,14.112,19.727,13.884,21.489-0.092
    c5.116-0.022,14.269-0.07,14.269-0.07l-0.015,9.623l53.001,0.009v-19.178h-52.757l0,9.323c0,0-9.349,0-14.554,0
    c-0.511-14.213-20.978-14.44-21.432,0c-4.578,0-7.428,0-7.675,0c-0.91-13.758-19.443-13.985-20.126,0c-1.137,0-14.933,0-14.933,0
    L27.188,136.101L27.188,136.101z"/></symbol>
<symbol id="icon_time_strategy"><path d="M170.802,21.007h-32.976v-6.124c0-2.627-1.778-4.386-4.425-4.386s-4.425,1.758-4.425,4.386v6.124H71.024
    v-6.124c0-2.627-1.778-4.386-4.425-4.386c-2.647,0-4.425,1.758-4.425,4.386v6.124H29.198c-9.739,0-17.701,7.882-17.701,17.523
    v131.43c0,9.64,7.961,17.523,17.701,17.523h141.604c9.739,0,17.701-7.882,17.701-17.523V38.53
    C188.503,28.889,180.541,21.007,170.802,21.007z M33.476,34.278H62.58v18.933c0,2.469,1.671,4.121,4.158,4.121
    s4.158-1.652,4.158-4.121V34.278h58.209v18.933c0,2.469,1.671,4.121,4.158,4.121c2.487,0,4.158-1.652,4.158-4.121V34.278h29.104
    c4.993,0,8.316,3.285,8.316,8.241V70.51H25.16V42.501C25.16,37.564,29.318,34.278,33.476,34.278z M166.524,174.232H33.476
    c-4.993,0-8.316-3.285-8.316-8.241v-27.541l96.184,0l-2.89-7.56l-60.696,0.289l-32.598,6.381v-23.346l120.641-0.445l-3.78-7.56
    l-84.934-0.273l-31.905,7.388L25.16,78.733H174.84v87.276C174.84,170.129,171.517,174.232,166.524,174.232L166.524,174.232z
"/></symbol>
<symbol id="icon_sensor_strategy"><path d="M100,5.424C47.766,5.424,5.424,47.775,5.424,100c0,52.234,42.342,94.576,94.576,94.576
    c52.239,0,94.576-42.342,94.576-94.576C194.576,47.775,152.239,5.424,100,5.424z M100,176.843c-42.37,0-76.843-34.473-76.843-76.843
    S57.63,23.162,100,23.162S176.843,57.63,176.843,100S142.37,176.843,100,176.843z M135.466,58.623c-0.596,0-1.173,0.095-1.717,0.255
    L91.408,71.722c-9.435,2.877-16.821,10.261-19.7,19.695l-12.834,42.332c-0.951,3.123,0.809,6.426,3.932,7.377
    c1.123,0.342,2.322,0.342,3.445,0l42.327-12.843c9.436-2.875,16.823-10.257,19.705-19.691l12.834-42.337
    c0.951-3.123-0.81-6.425-3.934-7.376C136.627,58.71,136.048,58.623,135.466,58.623z M100,111.822
    c-6.529,0-11.822-5.293-11.822-11.822S93.471,88.178,100,88.178c6.529,0,11.822,5.293,11.822,11.822S106.529,111.822,100,111.822z
"/></symbol>
<symbol id="icon_latlng_strategy"><path d="M177.855,12H36.072l-6.079,11.509l146.864-0.162l0.973,154.969l-153.996,0.162l-0.016-23.992L153.396,154l-0.008-11.793
    l-107.104-0.503v12.296H23.809l-0.007-23.18l129.23-0.567l-0.008-12.401l-106.984-0.336l0.001,12.716H23.794L23.77,89.084h37.093
    c0.481,0.038,0.953,0.085,1.452,0.104c1.009,0,1.971-0.04,2.906-0.104h71.413c1.422,0.204,2.934,0.31,4.561,0.291
    c1.349-0.032,2.611-0.131,3.793-0.291h32.129v-0.491h-29.564c6.33-1.554,9.653-5.409,9.943-11.584
    c-0.126-4.745-2.375-8.244-6.746-10.492c-2.874-1.499-6.122-2.623-9.742-3.373c-5.123-1.124-7.56-2.872-7.308-5.246
    c0.249-2.497,2.185-3.809,5.808-3.935c4.497,0,7.056,2.061,7.682,6.183l9.181-1.874c-1.751-7.869-7.494-11.739-17.237-11.616
    c-9.368,0.501-14.427,4.248-15.176,11.241c-0.253,6.247,3.434,10.182,11.054,11.804c2.497,0.626,5.247,1.437,8.244,2.436
    c2.871,1.124,4.309,2.875,4.309,5.246c-0.252,3.124-2.436,4.749-6.557,4.872c-5.498,0-8.62-2.81-9.369-8.431l-9.181,1.686
    c1.41,7.05,5.297,11.409,11.659,13.083H95.665V74.011h6.934c11.115,0,16.61-4.558,16.487-13.678
    c-0.374-8.493-5.558-12.864-15.55-13.115H86.297v41.375H69.13c5.933-1.144,9.971-3.941,12.108-8.399V64.83H60.441v7.494H72.62v5.059
    c-1.874,2.875-5.185,4.31-9.93,4.31c-6.997-0.624-10.618-5.182-10.867-13.678c0.498-8.244,3.87-12.677,10.117-13.303
    c4.872,0,8.306,1.874,10.305,5.621l8.619-3.185c-3.25-6.994-9.62-10.492-19.111-10.492c-12.492,0.749-19.111,7.807-19.861,21.172
    c0.429,11.851,5.564,18.763,15.378,20.765h-33.5l-0.038-65.225l5.665,0.092L35.342,12H23.671C17.225,12,12,17.225,12,23.671v154.184
    c0,6.446,5.225,11.671,11.671,11.671h154.184c6.446,0,11.671-5.225,11.671-11.671V23.671C189.527,17.225,184.301,12,177.855,12z
     M95.665,54.525h6.183c4.871,0.126,7.369,2.187,7.494,6.183c-0.125,3.999-2.623,6.06-7.494,6.183h-6.183V54.525z
"/></symbol>
<symbol id="icon_domain_list"><path d="M176.455,134.028h-8.722V102.77c0-6.423-5.207-11.629-11.629-11.629l0,0h-50.24V66.881h8.722
    c6.423,0,11.629-5.207,11.629-11.629v0V26.178c0-6.423-5.207-11.629-11.629-11.629c0,0,0,0,0,0H85.512
    c-6.423,0-11.629,5.207-11.629,11.629v29.074c0,6.423,5.207,11.629,11.629,11.629h8.722V91.14h-50.24
    c-6.423,0-11.629,5.207-11.629,11.629l0,0v31.259h-8.722c-6.423,0-11.629,5.207-11.629,11.629c0,0,0,0,0,0v29.074
    c0,6.423,5.207,11.629,11.629,11.629c0,0,0,0,0,0h29.074c6.423,0,11.629-5.207,11.629-11.629l0,0v-29.074
    c0-6.423-5.207-11.629-11.629-11.629c0,0,0,0,0,0h-8.722V104.77h50.24v29.259h-8.722c-6.423,0-11.629,5.207-11.629,11.629l0,0
    v29.074c0,6.423,5.207,11.629,11.629,11.629c0,0,0,0,0,0h29.074c6.423,0,11.629-5.207,11.629-11.629v0v-29.074
    c0-6.423-5.207-11.629-11.629-11.629h0h-8.722V104.77h50.24v29.259h-8.722c-6.423,0-11.629,5.207-11.629,11.629v0v29.074
    c0,6.423,5.207,11.629,11.629,11.629h0h29.074c6.423,0,11.629-5.207,11.629-11.629v-29.074
    C188.084,139.235,182.878,134.028,176.455,134.028z M85.512,53.252V24.178h29.074v29.074L85.512,53.252z M52.716,172.732H23.642
    v-29.074h29.074V172.732z M114.585,143.658v29.074H85.512v-29.074H114.585z M176.455,172.732h-29.074v-29.074h29.074V172.732z
"/></symbol>
<symbol id="icon_domain_topology"><path d="M163.751,14.572H36.249c-10.741,0-19.479,8.741-19.479,19.48v146.349c0,2.933,2.378,5.313,5.312,5.313
    c0.298,0,0.588-0.031,0.871-0.077c0.298,0.051,0.6,0.077,0.903,0.077c1.15,0,2.309-0.374,3.284-1.138l21.873-17.228l21.873,17.228
    c1.928,1.515,4.644,1.515,6.575,0l22.696-17.875l21.998,17.325c1.93,1.515,4.645,1.515,6.575,0l21.855-17.214l22.274,17.542
    c1.043,0.821,2.294,1.186,3.52,1.131c0.487,0.147,1.003,0.228,1.538,0.228c2.935,0,5.313-2.379,5.313-5.313V34.052
    C183.231,23.312,174.493,14.572,163.751,14.572z M168.473,166.573l-17.666-13.912c-1.82-1.429-4.381-1.429-6.201,0l-20.612,16.234
    l-20.745-16.339c-1.82-1.429-4.381-1.429-6.201,0l-21.404,16.857l-20.628-16.247c-1.82-1.429-4.381-1.429-6.201,0l-17.288,13.615
    l0-41.99l116.904-0.276v-14.74l-99.296-0.163l0,14.903H31.5l0.028-31.266l116.904-0.247v-14.74l-99.296-0.223l0,14.962H31.528
    V60.833l95.475-0.32v-14.74l-73.337-0.274l0,15.126H31.528V37.773c0-4.606,3.746-8.35,8.35-8.35h120.244
    c4.604,0,8.35,3.745,8.35,8.35L168.473,166.573L168.473,166.573z
"/></symbol>
            </svg>
            {
                this.renderTree(datalist, 1)
            }
        </div>
    }
}

function mapStateToProps(state) {
    return {
        datalist: state.treeView.datalist
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            onToggle: onToggle
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeView);