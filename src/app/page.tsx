import Image from "next/image";
import Link from "next/link";
import Timeline from "@/components/Timeline";
import SlideUpOnScroll from "@/components/SlideUpOnScroll";
import { timeline } from "@/data/timeline";

const skills = [
    { skill: "JavaScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" },
    { skill: "TypeScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
    { skill: "React",      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" },
    { skill: "Next.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { skill: "Python",     icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
    { skill: "FastAPI",    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" },
    { skill: "C",          icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg" },
    { skill: "C++",        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg" },
    { skill: "Git",        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" },
];

export default function Home() {
    return (
        <>
            <section id="home">
                <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 py-20 md:py-30 md:flex-row md:space-x-4 md:text-left">
                    <div className="md:mt-2 md:w-1/2">
                        <Image
                            src="/asset/avatar1.jpg"
                            alt=""
                            style={{ width: "80%", height: "auto" }}
                            width={325}
                            height={325}
                            className="rounded-full shadow-2xl mx-auto"
                        />
                    </div>
                    <div className="md:mt-2 md:w-3/5">
                        <h1 className="text-4xl font-bold mt-6 md:mt-0 md:text-7xl">Hi, I&#39;m Duc!</h1>
                        <p className="text-lg mt-4 mb-6 md:text-2xl">
                            I&#39;m an{" "}
                            <span className="font-semibold text-teal-600">
                                Indie Software Engineer
                            </span>
                            . I love to tinkering and designing algorithms.
                            Working towards creating products that
                            make life easier and more meaningful.
                        </p>
                        <Link
                            href="blogs"
                            className="text-neutral-100 font-semibold px-6 py-3 bg-teal-600 rounded shadow hover:bg-teal-700"
                        >
                            Blogs
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16">
                <SlideUpOnScroll className="text-center mb-12">
                    <h2 className="text-4xl font-bold">About Me</h2>
                    <hr className="w-6 h-1 mx-auto my-4 bg-teal-500 border-0 rounded" />
                </SlideUpOnScroll>

                <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" /> Education
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500" /> Work
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" /> Publication
                            </span>
                        </div>
                        <Timeline items={timeline} />
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <SlideUpOnScroll delay={150}>
                        <h3 className="text-2xl font-bold mb-6">Get to know me!</h3>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p>
                                Hi, my name is Duc Nguyen and I&#39;m a{" "}
                                <span className="font-bold">highly ambitious</span>,{" "}
                                <span className="font-bold">self-motivated</span>, and{" "}
                                <span className="font-bold">driven</span> indie software engineer.
                            </p>
                            <p>
                                I graduated from École Polytechnique, Palaiseau, France in 2024
                                with a BSc in Computer Science and Mathematics. I have been spending
                                time tinkering, and problem-solving a lot since I know how to do Math.
                            </p>
                            <p>
                                I have a wide range of hobbies and passions. I like algorithm designing,
                                keeping up with technology, and listening to philosophy podcasts.
                                I also enjoy walking, coding, and reading tech blogs. I&#39;m always
                                seeking new experiences and love to keep myself engaged and learning.
                            </p>
                            <p>
                                I believe that anyone should{" "}
                                <span className="font-bold text-teal-500">never stop growing</span>{" "}
                                and that&#39;s what I strive to do. I have a passion for technology
                                and a desire to always push the limits of what is possible.
                                I&#39;m excited to see where my career takes me and am always
                                open to new opportunities. 🙂
                            </p>
                        </div>
                        </SlideUpOnScroll>
                    </aside>
                </div>
            </section>

            <section id="skills" className="scroll-mt-24 py-16 md:py-24">
                <SlideUpOnScroll className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Skills</h2>
                    <hr className="w-6 h-1 mx-auto my-4 bg-teal-500 border-0 rounded" />
                </SlideUpOnScroll>
                <div className="flex flex-wrap justify-center gap-3">
                    {skills.map((item) => (
                        <div
                            key={item.skill}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center gap-2"
                        >
                            <Image src={item.icon} alt={item.skill} width={24} height={24} />
                            <span className="text-sm">{item.skill}</span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
