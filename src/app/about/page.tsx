import React from "react"
import Image from "next/image"

const skills = [
    {skill: "JavaScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"},
    {skill: "TypeScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg"},
    {skill: "React",      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"},
    {skill: "Next.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"},
    {skill: "Python",     icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"},
    {skill: "FastAPI",    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg"},
    {skill: "C",          icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg"},
    {skill: "C++",        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg"},
    {skill: "Git",        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg"},   
]

export default function About() {
    return (
        <section id="about">
        <div className="my-12 pb-12 md:pt-16 md:pb-48">
            <h1 className="text-center font-bold text-4xl">
            About Me
            <hr className="w-6 h-1 mx-auto my-4 bg-teal-500 border-0 rounded"></hr>
            </h1>

            <div className="flex flex-col space-y-10 items-stretch justify-center align-top md:space-x-10 md:space-y-0 md:p-4 md:flex-row md:text-left">
            <div className="md:w-1/2 ">
                <h1 className="text-center text-2xl font-bold mb-6 md:text-left">
                    Get to know me!
                </h1>
                <p>
                    Hi, my name is Duc Nguyen and I&#39;m a{" "}
                    <span className="font-bold">highly ambitious</span>,
                    <span className="font-bold"> self-motivated</span>, and
                    <span className="font-bold"> driven</span> indie software engineer.
                </p>
                <br />
                <p>
                    I graduated from Ecole Polytechnique, Palaiseau, France in 2024
                    with a BS in Computer Science and Mathematics. I have been spending
                    time tinkering, and problem-solving a lot since I know how to do Math.
                </p>
                <br />
                <p>
                    I have a wide range of hobbies and passions. I like algorithm designing, updating technology, listening to philosophy podcast.
                    I also like walking, coding and reading tech blogs.
                    I am always seeking new experiences and love to keep myself engaged and learning new things.
                </p>
                <br />
                <p>
                    I believe that anyone should{" "}
                    <span className="font-bold text-teal-500">
                        never stop growing
                    </span>{" "}
                    and that&#39;s what I strive to do, I have a passion for
                    technology and a desire to always push the limits of what is
                    possible. I am excited to see where my career takes me and am
                    always open to new opportunities. 🙂
                </p>
            </div>
            <div className="text-center md:w-1/2 md:text-left">
                <h1 className="text-2xl font-bold mb-6">My Skills</h1>
                <div className="flex flex-wrap flex-row justify-center z-10 md:justify-start gap-2 mb-8">
                    {skills.map((item, idx) => {
                        return (
                        <div key={idx} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center gap-2">
                            <Image 
                            src={item.icon} 
                            alt={item.skill} 
                            width={24} 
                            height={24}
                            />
                            <span className="text-sm">{item.skill}</span>
                        </div>
                        )
                    })}
                </div>

                <Image
                    src="/asset/engineer.webp"
                    alt="GIF"
                    width={325}
                    height={325}
                    className="hidden md:block md:relative md:bottom-4 md:left-32 md:z-0 mt-4"
                />
            </div>
            </div>
        </div>
        </section>
    )
}
