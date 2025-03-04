import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <section id="home">
            <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 py-20 md:py-30 md:flex-row md:space-x-4 md:text-left">
                <div className="md:mt-2 md:w-1/2">
                    <Image
                        src="/asset/avatar1.jpg"
                        alt=""
                        style={{
                            width: '80%',
                            height: 'auto'
                        }}
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
    )
}
