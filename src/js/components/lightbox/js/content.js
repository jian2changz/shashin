import React, { useState, useEffect, useRef } from 'react';
import { useSpring, useSprings, a } from 'react-spring';

function Content({ prop, setIntersecting, content, closeLightbox, setImageLoaded, metadata }) {
    const [counter, setCounter] = useState(0)
    const imageRef = useRef([])
    const myLightbox = useRef()
    const touchPosX = useRef(0)
    const touchPosView = useRef(0)
    const touchTime = useRef(0)
    const preloadCounter = useRef(0)
    const deviceWidth = window.innerWidth

    const scroll = useSpring({
        transform: counter ? `translate3d(${counter}px,-50%,0)` : `translate3d(${counter}px,-50%,0)`,
        config: prop.immediate ? { mass: 1, tension: 270, friction: 30 } : { duration: 1 }
    })
    const springs = useSprings(content.length, content.map((item, i) => ({
        opacity: prop.intersecting === i && prop.imageLoaded === true ? 1 :
            (prop.selectedImage === i && prop.imageLoaded === true ? 1 : 0)
    })))

    useEffect(() => {
        if (prop.selectedImage !== null) {
            setCounter(-deviceWidth * prop.selectedImage)
        }
    }, [prop.selectedImage, deviceWidth])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    var entryVal = parseInt(entry.target.dataset.intersecting)
                    setIntersecting(entryVal)
                }
            }, { root: null, rootMargin: "0px", threshold: 0.4 }
        );

        imageRef.current.forEach(image => {
            observer.observe(image);
        })

        return () => observer.disconnect();

    }, [setIntersecting])

    const touchStart = (e) => {
        var touchEventX = e.changedTouches[0].clientX;
        touchTime.current = new Date().getTime();  //Intial touch time to check if swipe
        touchPosView.current = touchEventX;  //Touch position of current viewport
        touchPosX.current = (touchEventX + (deviceWidth * prop.intersecting));  //Touch position of component width
    }

    const touchMove = (e) => {
        var touchEventX = (e.changedTouches[0].clientX - touchPosX.current);
        setCounter(touchEventX);
    }

    const touchEnd = (e) => {
        var touchTiming = (new Date().getTime() - touchTime.current);
        var touchDiff = (touchPosView.current - e.changedTouches[0].clientX);

        if (touchTiming < 250) {
            if (touchDiff > 0) {
                if (prop.intersecting < (content.length - 1)) {
                    setCounter(-deviceWidth * (prop.intersecting + 1));
                }
                else {
                    setCounter(-deviceWidth * prop.intersecting);
                }
            }
            else if (touchDiff < 0) {
                if (prop.intersecting > 0) {
                    setCounter(-deviceWidth * (prop.intersecting - 1));
                }
                else {
                    setCounter(-deviceWidth * prop.intersecting);
                }
            }
        }
        else {
            setCounter(-deviceWidth * prop.intersecting)
        }
    }

    const preLoad = () => {
        preloadCounter.current += 1;
        if (preloadCounter.current >= 1) {
            setImageLoaded(true)
            preloadCounter.current = 0
        }
    }

    return (
        <a.div className="lightbox-content"
            ref={myLightbox}
            style={scroll}
            onTouchStart={(e) => touchStart(e)}
            onTouchMove={(e) => touchMove(e)}
            onTouchEnd={(e) => touchEnd(e)}>
            {springs.map(({ opacity }, index) => (
                <a.div className="lightbox-content-img">
                    <div className="lightbox-content-text" style={{ color: content[index].textcolor }}>
                        <p>Location: {content[index].location}</p>
                        {metadata ? <p>{content[index].metadata}</p> : null}
                    </div>
                    <a.img className={"lightbox-content-img-blur" + (prop.imageLoaded ? " bg-white" : "")}
                        data-intersecting={index}
                        ref={ref => imageRef.current[index] = ref}
                        onClick={closeLightbox}
                        alt="" />
                    <a.img className="lightbox-content-img-main"
                        style={{ opacity }}
                        key={index}
                        onLoad={prop.intersecting === index ? preLoad : null}
                        src={prop.intersecting === index && prop.openLightBox ? content[index].url + "?w=828" : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} alt="" />
                </a.div>
            ))}
        </a.div>
    )
}

export default Content