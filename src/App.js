import React, { useRef, useState, useEffect } from "react";
import {isMobile} from 'react-device-detect';
import './App.css';

import videoHD from './musokuso_comingsoon.mp4';
import videoMobile from './musokuso_comingsoon_Mobile.mp4';
import loadingImage from './loadingImg.jpeg';
import loadingImageMobile from './loadingImg_mobile.jpeg'

const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
};

export default function App() {
    const videoParentRef = useRef();
    const [shouldUseImage, setShouldUseImage] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        // check if user agent is safari and we have the ref to the container <div />
        if (isSafari() && videoParentRef.current) {
            // obtain reference to the video element
            const player = videoParentRef.current.children[0];

            // if the reference to video player has been obtained
            if (player) {
                // set the video attributes using javascript as per the
                // webkit Policy
                player.controls = false;
                player.playsinline = true;
                player.muted = true;
                player.setAttribute("muted", ""); // leave no stones unturned :)
                player.autoplay = true;

                // Let's wait for an event loop tick and be async.
                setTimeout(() => {
                    // player.play() might return a promise but it's not guaranteed crossbrowser.
                    const promise = player.play();
                    // let's play safe to ensure that if we do have a promise
                    if (promise.then) {
                        promise
                            .then(() => {})
                            .catch(() => {
                                // if promise fails, hide the video and fallback to <img> tag
                                videoParentRef.current.style.display = "none";
                                setShouldUseImage(true);
                            });
                    }
                }, 0);
            }
        }
    }, []);

    const pressVideo = () => {
        const newIsMute = !isMuted;
        setIsMuted(newIsMute);
        const player = videoParentRef.current.children[0];

        // if the reference to video player has been obtained
        if (player) {
            // set the video attributes using javascript as per the
            // webkit Policy
            player.controls = false;
            player.playsinline = true;
            player.muted = newIsMute;
            player.setAttribute("muted", ""); // leave no stones unturned :)
            player.autoplay = true;

            // Let's wait for an event loop tick and be async.
            setTimeout(() => {
                // player.play() might return a promise but it's not guaranteed crossbrowser.
                const promise = player.play();
                // let's play safe to ensure that if we do have a promise
                if (promise.then) {
                    promise
                        .then(() => {})
                        .catch(() => {
                            // if promise fails, hide the video and fallback to <img> tag
                            videoParentRef.current.style.display = "none";
                            setShouldUseImage(true);
                        });
                }
            }, 0);
        }
    };

    return shouldUseImage ? (
        <img src={loadingImage} alt="Muted Video" />
    ) : (
        <div
            className={'bg-video'}
            onClick={() => pressVideo()}
            ref={videoParentRef}
            dangerouslySetInnerHTML={{
                __html: `
        <video
        class="bg-video__content"
          loop
          muted
          autoplay
          playsinline
          preload="metadata"
          poster="${(isMobile)?loadingImageMobile:loadingImage}"
        >
        <source src="${(isMobile)?videoMobile:videoHD}" type="video/mp4" />
        </video>`
            }}
        />
    );
}
