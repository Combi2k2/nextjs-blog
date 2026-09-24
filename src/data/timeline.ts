export type MilestoneKind = "work" | "education" | "publication";

export interface Milestone {
    kind: MilestoneKind;
    title: string;
    org: string;
    location?: string;
    start: string;
    end?: string;
    summary?: string;
    link?: string;
}

// Sorted most recent first. Edit freely — this file is the source of truth for the
// timeline column on the home page.
export const timeline: Milestone[] = [
    {
        kind: "work",
        title: "Research Student, U2IS Lab",
        org: "ENSTA (Institut Polytechnique de Paris)",
        location: "Palaiseau, France",
        start: "Sep 2025",
        end: "Present",
        summary:
            "Applying vision-language models to mixed indoor-outdoor robot navigation under Prof. Zhi Yan. Developing scene-graph reasoning pipelines and multimodal training workflows for embodied navigation.",
    },
    {
        kind: "education",
        title: "MSc in Interactive, Graphics & Design (PhD Track)",
        org: "Institut Polytechnique de Paris",
        location: "Palaiseau, France",
        start: "Sep 2025",
        end: "Jul 2027",
        summary: "PhD Track Scholarship recipient. GPA 16.1.",
    },
    {
        kind: "work",
        title: "Quantitative Research Intern",
        org: "WorldQuant",
        location: "Hanoi, Vietnam",
        start: "Jun 2025",
        end: "Aug 2025",
        summary:
            "Researched trading alphas using data-driven methods; applied computer vision to candlestick-pattern decision frameworks; prototyped an automation blueprint for literature review, strategy development, and backtesting.",
    },
    {
        kind: "work",
        title: "AI Engineer",
        org: "LTS Group",
        start: "Sep 2024",
        end: "Dec 2024",
        summary:
            "Built LLM-based search, analytics, and workflow automation for clients. Production-ready RAG systems on Qdrant / Milvus vector databases.",
    },
    {
        kind: "education",
        title: "BSc in Mathematics and Computer Science",
        org: "École Polytechnique",
        location: "Palaiseau, France",
        start: "Sep 2021",
        end: "Jun 2024",
        summary: "Admitted with honours. GPA 3.99.",
    },
    {
        kind: "work",
        title: "OS Research Intern",
        org: "Télécom SudParis",
        location: "France",
        start: "Jan 2024",
        end: "Mar 2024",
        summary:
            "Implemented a framework for developing custom task-scheduling algorithms in user space; designed a unified framework for shared optimisation across scheduling and memory management.",
    },
    {
        kind: "work",
        title: "Machine Learning Research Intern",
        org: "Huawei Research Center",
        location: "Nice, France",
        start: "Jun 2023",
        end: "Aug 2023",
        summary:
            "Improved the generalisation of a colour-enhancement pipeline using generative models. Designed user-adaptive and video-enhancement pipelines.",
    },
    {
        kind: "publication",
        title: "Turbulent Flow Simulation (preprint)",
        org: "arXiv:2306.12545",
        start: "May 2023",
        summary:
            "Applied neural memory architectures and physics regularisation to simulate and predict fluid dynamics.",
        link: "https://arxiv.org/abs/2306.12545",
    },
    {
        kind: "work",
        title: "Instructor, Vietnamese National Informatics Team",
        org: "High School for Gifted Students, VNU-HUS",
        location: "Hanoi, Vietnam",
        start: "Apr 2021",
        end: "Aug 2021",
        summary:
            "Coached 15 top Vietnamese students on advanced algorithms for the National Olympiad. Authored problems and test data for the Team Selection Test.",
    },
    {
        kind: "education",
        title: "Specialised High School Programme, Computer Science",
        org: "High School for Gifted Students, VNU-HUS",
        location: "Hanoi, Vietnam",
        start: "2017",
        end: "2020",
    },
];
