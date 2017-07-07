import React, { PureComponent } from 'react';

let round = Math.PI*2*160;
export default class Pie extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isFirst: true
        }
        this.draw = this.draw.bind(this);
        this.progressScale = this.progressScale.bind(this);
    }

    componentDidMount(){
        let {data}=this.props;
        if(!data){
            return ;
        }

        this.draw(this.state.isFirst);
    }

    componentDidUpdate(){
        let {data}=this.props;
         if(!data){
            return ;
        }

        this.draw(this.state.isFirst);
    }

    progressScale(data,range){
        return round-round*(data.val-range[0])/(range[1]-range[0]);
    }

    draw(isFirst){
        isFirst && this.setState({isFirst:false});
        let { width=200, height=200,data,className='',range} = this.props;
        if(!data){
            return ;
        }
        let svg = d3.select(`.${className}PieChart`)
            .attr('width', width)
            .attr('height', height)
            .attr("viewBox",'0 0 400 400')
            
    
        let baseCircle = svg.select('.base-circle')
            .attr('cx', 200)
            .attr('cy', 200)
            .attr('r', 160)
            .attr('fill','none')
            .attr('stroke','#eed3d7')
            .attr('stroke-width',32)
            .attr('stroke-linecap','round')
            .attr('stroke-dasharray',round+" 3000")

    //         .attr('stroke-dashoffset', round/4)
    // .attr('transform','rotate(-83 200 200)')

        if(isFirst&&data.val){
            svg.select('.progress-circle')
            .attr('cx', 200)
            .attr('cy', 200)
            .attr('r', 160)
            .attr('fill','none')
            .attr('stroke',`url(#${className}-img)`)
            .attr('stroke-width',32)
            .attr('stroke-linecap','round')
            .attr('stroke-dasharray',round+" 3000")
            .attr('transform','rotate(-80 200 200)')
            .attr('stroke-dashoffset',round)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset',this.progressScale(data,range));
        }
        else{
            console.log(data, this.progressScale(data, range));
            svg.select('.progress-circle')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset',this.progressScale(data,range));
        }
        
        let label;
        switch(data.type){
            case 'NOISE':
                label = '设备总计';

            baseCircle.attr('stroke','#00c6fe')
                .attr("stroke-opacity", 0.25);
                break;
            case 'TEMPS':
                label = '完好率';
                break;
            default:
                label='';
        }
        
        svg.select('.type')
            .text(label);

        svg.select('.val')
            .text(data.val+(data.unit?data.unit:''));
    }

    render() {
        const {data,className} = this.props;

        return (
            <svg className={`${className}PieChart`}>        
                <defs>
                    <pattern id="noise-img" patternUnits="userSpaceOnUse" width='400' height='400'>
                        <image xlinkHref="/svg/noise.svg" x='0' y='0' width='400' height='400' transform="rotate(83 200 200)">
                        </image>
                    </pattern>
                    <pattern id="temps-img" patternUnits="userSpaceOnUse" width='400' height='400'>
                        <image xlinkHref="/svg/temps.svg" x='0' y='0' width='400' height='400' transform="rotate(83 200 200)">
                        </image>
                    </pattern>
                </defs>
                <g className='circle'>
                    <circle className='base-circle'/>
                    <circle className='progress-circle'/>
                </g>
                <g className='text'>
                    <text className='type' x ='200' y='140'></text>
                    <text className='val' x ='200' y='240'></text>
                </g>
            </svg>
        );
    }
};