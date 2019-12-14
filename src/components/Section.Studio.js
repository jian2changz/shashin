import React, {useState} from 'react';
import '../App.css';
import {useSpring, useTrail, animated} from 'react-spring';
import Loading from './Loading.js';
const items = ['https://live.staticflickr.com/65535/48165939651_4b3225bd62_b.jpg', 'https://live.staticflickr.com/65535/48165938451_539fc1a464_b.jpg']
const config = { mass: 5, tension: 2000, friction: 200 }

const Japan = ()=> {

    const props = useSpring({opacity: 1, from: {opacity: 0}})
    const [toggle, set] = useState(true)

  const trail = useTrail(items.length, {
    config,
    delay:250,
    opacity: toggle ? 1 : 0,
    x: toggle ? 0 : 400,
    height: toggle ? 400 : 400,
    from: { opacity: 0, x: 400, height: 400 },
  })


    return (
       


<animated.div  className="App">
 <div className="trails-main" onClick={() => set(state => !state)}>
        <div >
          {trail.map(({ x, height,opacity, ...rest }, index) => (
            <animated.div
                key={items[index]}
                className="trails-text"
                style={{ ...rest, transform: x.interpolate(x => `translate3d(0,0,0)`) }}>
                <animated.div style={{ opacity }}>
                    <a href="">
                    <img className="imghun" src={items[index]}></img>
                    </a>
                </animated.div>
            </animated.div>
          ))}
        </div>
        </div>
      <header className="App-header">

                <animated.div style={props} className="timeline-item">
                    <div className="animated-background">
                    </div>
                    <animated.p style={props}>dskfjhsdkjfhsdjkf</animated.p>
                </animated.div>

    <div className="timeline-item">
        <div className="animated-background">
        </div>
    </div>

    <div className="timeline-item">
        <div className="animated-background">
        </div>
    </div>

    <div className="timeline-item">
        <div className="animated-background">
        </div>
    </div>

    <div className="timeline-item">
        <div className="animated-background">
        </div>
    </div>

      </header>
    </animated.div>
      );

}
function imgLoad(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.src = url;
      img.onload = function() {
        resolve(img);
      }
      img.onerror = reject
    });
  }
  let imageLoadpromises = items.map(imgLoad);



 class BB extends React.Component {
    constructor(props){
        super(props);
        this.state = {data: null};
    }

    componentDidMount(){
        this.handleImageLoaded();
    
        }

    imgLoad(url) {
        return new Promise(function(resolve, reject) {
          var img = new Image();
          img.src = url;
          img.onload = function() {
            resolve(img);
          }
          img.onerror = reject
        });
      }
     

    
    handleImageLoaded() {
        Promise.all(imageLoadpromises ).then(() => {
            this.setState({
                data: true
        });
          
            });
             console.log("hello", this.state)
      
    }
    render() {

        if (!this.state.data) {
            return( 
                
            <div>Loading...
            <Loading />
                {/* <img  className="loadmeh" src={items[0]} onLoad={this.handleImageLoaded.bind(this)}/>
               */}
                
                </div>)
        }
        return <div>
   
            <Japan />
            
        </div>;
    }
}
export default BB;