"use client";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/app/store/scrollStore";

gsap.registerPlugin(ScrollTrigger);

export default function SidePane() {
  const { scrollIndex, goToSection } = useScrollStore();

  const texts = useMemo(() => {
    switch (scrollIndex) {
      case 1:
        return {
          title: "FISERV",
          subtitle: "Senior Full Stack Developer | Jan 2024 - Present",
          bullets: [
            "Maintained 2 front-end projects from beginning to end. Relying on angular to serve more than a hundred banks",
            "Contributed in change of legacy WinForms .Net 4.8 stack to a new C# .Net 8.0 and Angular stack",
            "On the back-end used GraphQl connections in a mega project, along with Postgres on the smaller one",
            "Mentored and co-managed 6 junior developers",
            "Worked in an Agile environment with 2 week sprints, daily standups, and bi-weekly retrospectives",
          ],
          tech: ['C#', '.Net 8.0', 'Angular', 'GraphQL', 'Postgres', 'Azure DevOps', 'Bitbucket', 'Jira', 'Postgres', 'MSSQL']
        };
      case 2:
        return {
          title: "CONIX",
          subtitle: "Senior Full Stack Developer / Computational Designer | Jul 2021 – Jan 2024",
          bullets: [
            "Switched to Angular/React and Node.js to improve scalability. Increased deployment efficiency by 50%",
            "Managed DevOps through GoDaddy then Cloudflare, reducing costs by 33%",
            "Wrote database using MYSQL migrating from MSSQL",
            "Secured $1.2 million in funding. While reduced design time by over 90% through AI development",
            "Deployed stacks on AWS, serving over 1000 users",
            "Managed a team of 3 computational designers/developers"
          ],
          tech: ['Node.js', 'React', 'Angular', 'Three.js', 'AWS', 'MYSQL', 'MSSQL', 'GoDaddy', 'Cloudflare', 'Docker', 'Rhino', 'Grasshopper', 'Python', 'C++']
        };
      case 3:
        return {
          title: "MODERN ACADEMY",
          subtitle: "Bachelor's Degree in Architecture | Sep 2012 – Jun 2017",
          bullets: [
            "Graduated with a B+ average (above 80%). Demonstrated creative computational design skills",
            "Conducted innovative research and implemented new systems. Developed concepts using beginner C++"
          ],
          tech: ['AutoCAD', '3ds Max', 'Vray', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'Grasshopper', 'C++']
        };
      default:
        return { title: "", subtitle: "", bullets: [] };
    }
  }, [scrollIndex]);

  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const bulletsRef = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  /** ---------- Animation helpers ---------- */
  const animateIn = (nodes: (HTMLElement | null)[]) => {
    nodes.forEach((el, index) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.15,
        }
      );
    });
  };

  const animateOut = (nodes: (HTMLElement | null)[], direction: "up" | "down") => {
    nodes.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        y: direction === "up" ? -20 : 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        delay: index * 0.1,
      });
    });
  };

  const highlightBullet = (index: number) => {
    bulletsRef.current.forEach((b, i) => {
      if (!b) return;
      gsap.to(b, {
        scale: i === index ? 1.4 : 1,
        backgroundColor: i === index ? "#111" : "#7a7a7aff",
        duration: 0.5,
      });
    });
  };

  /** ---------- Main effect ---------- */
  useLayoutEffect(() => {
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    const nodes = elRefs.current;
    const slidesCount = nodes.length;
    const totalSegments = slidesCount + 1;
    const totalScrollable = Math.max(
      1,
      document.body.scrollHeight - window.innerHeight
    );
    const segment = totalScrollable / totalSegments;

    // Initial state
    nodes.forEach((el) => el && gsap.set(el, { opacity: 0, y: 20 }));
    bulletsRef.current.forEach((b) =>
      b && gsap.set(b, { scale: 1, backgroundColor: "#7a7a7aff" })
    );

    [1, 2, 3].forEach((pageIndex) => {
      const startPx = Math.round(segment * pageIndex);

      const t = ScrollTrigger.create({
        start: `${startPx - 20}px top`,
        end:
          pageIndex === 3
            ? `${totalScrollable + 100}px top`
            : `${startPx + segment - 20}px top`,
        onEnter: () => animateIn(nodes),
        onEnterBack: () => animateIn(nodes),
        onLeave: () => pageIndex !== 3 && animateOut(nodes, "up"),
        onLeaveBack: () => animateOut(nodes, "down"),
      });
      triggersRef.current.push(t);

      // Bullet highlight
      const bulletIndex = pageIndex - 1;
      const b = bulletsRef.current[bulletIndex];
      if (b) {
        const bt = ScrollTrigger.create({
          start: `${startPx - 10}px top`,
          end: `${startPx + segment - 10}px top`,
          onEnter: () => highlightBullet(bulletIndex),
          onEnterBack: () => highlightBullet(bulletIndex),
        });
        triggersRef.current.push(bt);
      }
    });

    // First bullet special case
    const firstBullet = bulletsRef.current[0];
    if (firstBullet) {
      const firstPageStart = Math.round(segment * 1);
      const transitionTrigger = ScrollTrigger.create({
        start: `${firstPageStart - 50}px top`,
        end: `${firstPageStart + 10}px top`,
        onEnter: () => highlightBullet(0),
        onLeaveBack: () => highlightBullet(-1),
      });
      triggersRef.current.push(transitionTrigger);
    }

    return () => {
      triggersRef.current.forEach((tr) => tr.kill());
      triggersRef.current = [];
    };
  }, []);

  /** ---------- Keep bullets synced with store ---------- */
  useLayoutEffect(() => {
    highlightBullet(scrollIndex - 1);
  }, [scrollIndex]);

  /** ---------- Bullet click handler ---------- */
  const handleBulletClick = (index: number) => {
    goToSection(index + 1);
  };

  return (
    <div className="fixed top-[30%] right-0 -translate-y-[30%] flex items-center w-[30vw]">
      <div className="flex-grow pr-8">
        <h1
          ref={(el) => {
            elRefs.current[0] = el;
          }}
          className="text-5xl text-black font-semibold mb-4"
        >
          {texts.title}
        </h1>
        <strong
          ref={(el) => {
            elRefs.current[1] = el;
          }}
          className="text-sm block text-gray-700 mb-6 font-medium"
        >
          {texts.subtitle}
        </strong>
        <div
          ref={(el) => {
            elRefs.current[2] = el;
          }}
          className="text-sm text-gray-600 leading-relaxed"
        >
          <ul className="space-y-3">
            {texts.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-3 mt-1 text-xs">•</span>
                <span className="flex-1">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mt-12">
            {texts.tech && texts.tech.map((tech, index) => (
              <div key={index} className="bg-gray-400 rounded-xl px-2">
                <p className="italic text-gray-900">
                  {tech}
                </p>

              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center w-3 mr-6">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            ref={(b) => {
              bulletsRef.current[i] = b;
            }}
            onClick={() => handleBulletClick(i)}
            aria-label={`Go to item ${i + 1}`}
            className="w-2.5 h-2.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-500 bg-gray-400"
          />
        ))}
      </div>
    </div>
  );
}