"use client";

import "react-vertical-timeline-component/style.min.css";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { FiBriefcase, FiBook, FiFileText, FiExternalLink } from "react-icons/fi";
import type { Milestone, MilestoneKind } from "@/data/timeline";

const KIND: Record<
    MilestoneKind,
    { icon: React.ReactNode; color: string; side: "left" | "right" }
> = {
    education:   { icon: <FiBook size={20} />,      color: "#6366f1", side: "left"  },
    work:        { icon: <FiBriefcase size={20} />, color: "#14b8a6", side: "right" },
    publication: { icon: <FiFileText size={20} />,  color: "#f59e0b", side: "right" },
};

export default function Timeline({ items }: { items: Milestone[] }) {
    return (
        <VerticalTimeline lineColor="#d1d5db">
            {items.map((m, i) => {
                const k = KIND[m.kind];
                const hasDetails = Boolean(m.summary) || Boolean(m.link);
                return (
                    <VerticalTimelineElement
                        key={i}
                        position={k.side}
                        date={`${m.start}${m.end ? " – " + m.end : ""}`}
                        iconStyle={{ background: k.color, color: "#fff" }}
                        icon={k.icon}
                    >
                        {/* group so the extras below can watch this card's hover state */}
                        <div className="group">
                            <h3 className="text-lg font-semibold">{m.title}</h3>
                            <div className="text-sm font-medium text-teal-600 dark:text-teal-400">
                                {m.org}
                                {m.location ? ` · ${m.location}` : ""}
                            </div>
                            {hasDetails && (
                                // hidden on hover-capable devices until the card is hovered; always visible on touch
                                <div className="mt-2 grid overflow-hidden transition-[grid-template-rows,margin] duration-300 grid-rows-[1fr] md:grid-rows-[0fr] md:mt-0 md:group-hover:grid-rows-[1fr] md:group-hover:mt-2">
                                    <div className="min-h-0 space-y-2">
                                        {m.summary && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {m.summary}
                                            </p>
                                        )}
                                        {m.link && (
                                            <a
                                                href={m.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline"
                                            >
                                                Read more <FiExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </VerticalTimelineElement>
                );
            })}
        </VerticalTimeline>
    );
}
