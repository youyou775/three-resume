"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReactLenis from 'lenis/react';

export default function ProjectClient({ project, nextProject, prevProject }) {
    const projectNavRef = useRef(null);
    const progressBarRef = useRef(null);
    const projectDescriptionRef = useRef(null);
    const footerRef = useRef(null);
    const nextProjectProgressBarRef = useRef(null);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [shouldUpdateProgress, setshouldUpdateProgress] = useState(true);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

         // ensure elements exist then set initial states
        if (projectNavRef.current) gsap.set(projectNavRef.current, { opacity: 0, y: -100 });
        if (projectDescriptionRef.current) gsap.set(projectDescriptionRef.current, { opacity: 0 });

        gsap.set(projectNavRef.current, { opacity: 0, y: -100 });

        gsap.to(projectNavRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.25,
            ease: "power3.out",
        });

        gsap.to(projectDescriptionRef.current, {
            opacity: 1,
            duration: 1,
            delay: 0.5,
            ease: "power3.out",
        });

        const navScrollTrigger = ScrollTrigger.create({

            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: self => {
                if (progressBarRef.current) {
                    gsap.set(progressBarRef.current, { scaleX: self.progress });
                }
            },
            
        });

        const footerScrollTrigger = ScrollTrigger.create({
            trigger: footerRef.current,
            start: "top top",
            end: `+=${window.innerHeight * 3}px`,
            pin: true,
            pinSpacing: true,
            onEnter: () => {

                if (projectNavRef.current && !isTransitioning)
                    gsap.to(projectNavRef.current, {
                        y: -100,
                        duration: 0.5,
                        ease: "power2.inOut",
                    });

            },
            onLeaveBack: () => {

                if (projectNavRef.current && !isTransitioning)
                    gsap.to(projectNavRef.current, {
                        y: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                    });

            },
            onUpdate: self => {
                if (nextProjectProgressBarRef.current && shouldUpdateProgress) {
                    gsap.set(nextProjectProgressBarRef.current, { scaleX: self.progress });
                }
                if (self.progress > 0.95 && !isTransitioning) {
                    setshouldUpdateProgress(false);
                    setIsTransitioning(true);
                    const t1 = gsap.timeline();

                    t1.to(nextProjectProgressBarRef.current, { scaleX: 1 })
                        .to([footerRef.current?.querySelector(".project-footer-copy"),
                        footerRef.current?.querySelector(".next-project-progress")
                        ], { opacity: 0, duration: 0.3, ease: "power2.inOut" })

                    t1.call(() => {
                        window.location.href = `/components/scrollProj/projects/${nextProject.slug}`;
                    });
                }
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [nextProject.slug, isTransitioning, shouldUpdateProgress]);
    return (
        <ReactLenis root>

            <div className="project-page">
                <div className="project-nav" ref={projectNavRef}>
                    <div className="link">
                        <span>&#8592;&nbsp;</span>
                        <Link href={`/components/scrollProj/projects/${prevProject.slug}`}>Previous</Link>
                    </div>
                    <div className="project-page-scroll-progress">
                        <p>{project.title}</p>
                        <div className="project-page-scroll-progress-bar" ref={progressBarRef}></div>
                    </div>
                    <div className="link">
                        <Link href={`/components/scrollProj/projects/${nextProject.slug}`}>Next</Link>
                        <span>&#8594;&nbsp;</span>
                    </div>

                </div>
                <div className="project-hero">
                    <h1>{project.title}</h1>
                    <p id='project-description' ref={projectDescriptionRef}>{project.description}</p>
                </div>
                <div className="project-images">
                    {project.images && project.images.map((image, index) => (
                        <div className="project-img" key={index}>
                            <img src={image} alt={`${project.title} image ${index + 1}`}/>
                        </div>
                    ))}
                </div>
                <div className="project-footer" ref={footerRef}>
                    <h1>{nextProject.title}</h1>
                    <div className="project-footer-copy">
                        <p>Next Project</p>
                    </div>
                    <div className="next-project-progress">
                        <div className="next-project-progress-bar" ref={nextProjectProgressBarRef}></div>
                    </div>
                </div>
            </div>
        </ReactLenis>
    );
}