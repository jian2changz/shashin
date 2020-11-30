import React, { useState, useRef, useEffect } from 'react';
import { useSpring, useSprings, a, config } from 'react-spring';
import { mainroutes } from './images.js'
import smoothscroll from 'smoothscroll-polyfill';
import Loader from './loader.js';
import Cover from './cover.js';
import Title from './title.js';
import imgPromise from '../hooks/imagePromise.js';

function Application({ prop, setIndex, setLoadLevel1 }) {

    const [initialLoad, setinitalLoad] = useState(true);
    const [initialLoader, setinitialLoader] = useState(true);
    const myInput = useRef() //reference for main container
    const imageRef = useRef([]) //array of image refs for observer
    const [intersectingArray, setIntersectingArray] = useState([])
    const deviceHeight = window.innerHeight
    const imageSize = window.innerWidth * 1.25

    useEffect(() => {
        //get device window height to set container height
        document.documentElement.style.setProperty('--base', (deviceHeight + 'px'));
        const defaultImage = myInput.current.children[1];
        //get distance from bottom to top of image minus 2rem
        document.documentElement.style.setProperty('--logo', deviceHeight - ((deviceHeight - defaultImage.clientHeight) / 3) + 'px');
        document.documentElement.style.setProperty('--button', ((deviceHeight - defaultImage.clientHeight) / 8) + 'px');
    }, [deviceHeight])

    useEffect(() => {
        smoothscroll.polyfill();

        const coverImages = mainroutes.reduce(function (result, item) {
            if (item.cover.img) {
                result.push(item.cover.img)
            }
            return result
        }, [])

        const promiseArray = [
            mainroutes.map(item => item.img), coverImages].reduce(function (arr, item) {
                return arr.concat(item)
            }, [])

        Promise.all(promiseArray.map(item => imgPromise(item))).then(result => {
            setinitalLoad(false)
            //remove svg loader after 1.5s
            setTimeout(() => {
                setinitialLoader(false);
            }, 1500);
        })
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting === true) {
                        var item = entry.target.dataset.number
                        setIntersectingArray(intersectingArray => [...intersectingArray, item])
                    }
                    else if (entry.isIntersecting === false) {
                        setIntersectingArray(intersectingArray => (intersectingArray.filter(item => item !== entry.target.dataset.number)))
                    }
                })
            }, { root: null, rootMargin: "0px", threshold: 1 }
        )

        if (prop.index === null) {
            imageRef.current.forEach(image => {
                observer.observe(image);
            })
            return () => observer.disconnect();
        }
    }, [prop.index]);

    const selectImage = (i, e) => {
        if (prop.index === null) {
            setIndex(i)
            setLoadLevel1(true)
            myInput.current.scrollTo({
                top: e.target.offsetTop - ((deviceHeight - (imageSize)) / 2),
                behavior: 'smooth'
            })
        }
        else {
            setIndex(null)
        }
    }

    const mainApp = useSpring({
        opacity: initialLoader ? 0 : (prop.openLevel1 ? 0 : 1),
        transform: initialLoader ? "translateY(20%)" : "translateY(0%)",
        config: config.gentle
    })

    const springs = useSprings(mainroutes.length, mainroutes.map((item, i) => ({
        config: { mass: 1, tension: 200, friction: 17 },
        height: (prop.index === null) ? "200px" : ((i !== prop.index) ? "200px" : `${imageSize}`),
        opacity: (prop.index === null) ? 1 : (i !== prop.index) ? 0 : 1,
        margin: (prop.index === null) ? "2rem" : ((i !== prop.index) ? "2rem" : "1rem")
    })))

    return (
        <div className="main-app">
            {initialLoader ? <Loader prop={{ initialLoad }} /> : null}
            <a.div
                className={"main-app-content" + (prop.index === null ? " active" : "") + (prop.phone ? "" : " tablet")}
                style={mainApp}
                ref={myInput}>
                {springs.map(({ height, opacity, margin }, i) => (
                    <a.div
                        className={"shashin " + mainroutes[i].number}
                        style={{ backgroundImage: `url(${mainroutes[i].img})`, height, margin, opacity }}
                        onClick={(e) => selectImage(i, e)}
                        ref={ref => imageRef.current[i] = ref}
                        data-number={[i]}
                        key={i}>
                        {prop.index === i ? <Cover prop={mainroutes[i].cover} /> : null}
                        {intersectingArray.includes(`${i}`) ? <Title selected={prop.index} name={mainroutes[i].title} /> : null}
                    </a.div>
                ))}
            </a.div>
        </div>
    )
}

export default Application