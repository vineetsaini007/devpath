export const topics = ["JavaScript", "React", "Node.js"] as const;
export type Topic = (typeof topics)[number];
export type Input = {
  topic: Topic;
  level: "Beginner" | "Intermediate";
  hours: number;
};
export type Resource = {
  id: string;
  title: string;
  author: string;
  topic: Topic;
  level: Input["level"];
  type: string;
  url: string;
  description: string;
  color: string;
};
export const resources: Resource[] = [
  {
    id: "js-mdn",
    title: "JavaScript Guide",
    author: "MDN Web Docs",
    topic: "JavaScript",
    level: "Beginner",
    type: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    description: "Get comfortable with the language that powers the web.",
    color: "yellow",
  },
  {
    id: "js-info",
    title: "The Modern JavaScript Tutorial",
    author: "javascript.info",
    topic: "JavaScript",
    level: "Beginner",
    type: "Course",
    url: "https://javascript.info/",
    description: "From first variables to the browser, one concept at a time.",
    color: "orange",
  },
  {
    id: "js-eloquent",
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    topic: "JavaScript",
    level: "Intermediate",
    type: "Online book",
    url: "https://eloquentjavascript.net/",
    description: "Explore the language through thoughtful, practical projects.",
    color: "blue",
  },
  {
    id: "js-dom",
    title: "Introduction to the DOM",
    author: "MDN Web Docs",
    topic: "JavaScript",
    level: "Beginner",
    type: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction",
    description: "Connect your JavaScript to the page and make it interactive.",
    color: "mint",
  },
  {
    id: "js-async",
    title: "Asynchronous JavaScript",
    author: "MDN Web Docs",
    topic: "JavaScript",
    level: "Intermediate",
    type: "Course",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS",
    description: "Understand promises, async functions, and network requests.",
    color: "purple",
  },
  {
    id: "react-learn",
    title: "Learn React",
    author: "React team",
    topic: "React",
    level: "Beginner",
    type: "Documentation",
    url: "https://react.dev/learn",
    description: "Build interfaces from small, reusable components.",
    color: "blue",
  },
  {
    id: "react-tutorial",
    title: "Build a Tic-Tac-Toe Game",
    author: "React team",
    topic: "React",
    level: "Beginner",
    type: "Course",
    url: "https://react.dev/learn/tutorial-tic-tac-toe",
    description: "Learn React by building a game you can actually play.",
    color: "mint",
  },
  {
    id: "react-state",
    title: "Managing State",
    author: "React team",
    topic: "React",
    level: "Intermediate",
    type: "Documentation",
    url: "https://react.dev/learn/managing-state",
    description: "Keep your interface predictable as your app grows.",
    color: "purple",
  },
  {
    id: "react-thinking",
    title: "Thinking in React",
    author: "React team",
    topic: "React",
    level: "Beginner",
    type: "Documentation",
    url: "https://react.dev/learn/thinking-in-react",
    description: "Turn a design into a clean component hierarchy.",
    color: "orange",
  },
  {
    id: "react-effects",
    title: "Escape Hatches",
    author: "React team",
    topic: "React",
    level: "Intermediate",
    type: "Documentation",
    url: "https://react.dev/learn/escape-hatches",
    description: "Work with effects, refs, and systems outside React.",
    color: "yellow",
  },
  {
    id: "node-intro",
    title: "Introduction to Node.js",
    author: "Node.js team",
    topic: "Node.js",
    level: "Beginner",
    type: "Documentation",
    url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
    description: "Take JavaScript beyond the browser and onto the server.",
    color: "mint",
  },
  {
    id: "node-http",
    title: "Anatomy of an HTTP Transaction",
    author: "Node.js team",
    topic: "Node.js",
    level: "Beginner",
    type: "Documentation",
    url: "https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction",
    description: "Understand requests, responses, and your first HTTP server.",
    color: "blue",
  },
  {
    id: "node-files",
    title: "Working with File Systems",
    author: "Node.js team",
    topic: "Node.js",
    level: "Beginner",
    type: "Documentation",
    url: "https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs",
    description: "Read data from files with asynchronous Node.js APIs.",
    color: "orange",
  },
  {
    id: "node-loop",
    title: "The Node.js Event Loop",
    author: "Node.js team",
    topic: "Node.js",
    level: "Intermediate",
    type: "Documentation",
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    description: "See how Node handles asynchronous work under the hood.",
    color: "purple",
  },
  {
    id: "node-stream",
    title: "Backpressuring in Streams",
    author: "Node.js team",
    topic: "Node.js",
    level: "Intermediate",
    type: "Documentation",
    url: "https://nodejs.org/en/learn/modules/backpressuring-in-streams",
    description: "Process data efficiently without overwhelming memory.",
    color: "yellow",
  },
];
export type Week = {
  week: number;
  goal: string;
  resourceIds: string[];
  practiceTask: string;
  estimatedHours: number;
};
export type Plan = { weeks: Week[]; source: "ai" | "fallback"; input: Input };
export function validInput(v: unknown): v is Input {
  const x = v as Input;
  return (
    !!x &&
    topics.includes(x.topic) &&
    ["Beginner", "Intermediate"].includes(x.level) &&
    Number.isInteger(x.hours) &&
    x.hours >= 2 &&
    x.hours <= 10
  );
}
export function matching(input: Input) {
  return resources.filter(
    (r) =>
      r.topic === input.topic &&
      (input.level === "Intermediate" || r.level === "Beginner"),
  );
}
export function template(input: Input): Plan {
  const titles: Record<Topic, string[]> = {
    JavaScript: [
      "Build your foundations",
      "Think in functions",
      "Bring the page to life",
      "Ship a small project",
    ],
    React: [
      "Think in components",
      "Make it interactive",
      "Connect your app",
      "Build something of your own",
    ],
    "Node.js": [
      "Meet your runtime",
      "Create an HTTP server",
      "Work with real data",
      "Ship your first API",
    ],
  };
  const tasks: Record<Topic, string[]> = {
    JavaScript: [
      "Write a tip calculator using variables and operators.",
      "Build an array-based expense summary with reusable functions.",
      "Create a task list with DOM events and a delete action.",
      "Combine your skills into a small expense tracker.",
    ],
    React: [
      "Build a profile card using props and reusable components.",
      "Add a controlled form and a filterable list using state.",
      "Load public data and show loading and error states.",
      "Build a resource explorer with filters and saved preferences.",
    ],
    "Node.js": [
      "Run a script that reads arguments and formats a response.",
      "Create a server with GET routes and JSON responses.",
      "Read a local JSON file and handle missing-file errors.",
      "Build a small resource API with input validation.",
    ],
  };
  const list = matching(input);
  return {
    input,
    source: "fallback",
    weeks: titles[input.topic].map((goal, i) => ({
      week: i + 1,
      goal: input.level === "Intermediate" ? `${goal} · deeper practice` : goal,
      resourceIds: [list[i % list.length].id],
      practiceTask: tasks[input.topic][i],
      estimatedHours: input.hours,
    })),
  };
}
export function validWeeks(value: unknown, input: Input): value is Week[] {
  if (!Array.isArray(value) || value.length !== 4) return false;
  const allowed = new Set(matching(input).map((r) => r.id));
  return value.every(
    (w, i) =>
      w &&
      w.week === i + 1 &&
      typeof w.goal === "string" &&
      w.goal.trim().length > 0 &&
      w.goal.length <= 160 &&
      typeof w.practiceTask === "string" &&
      w.practiceTask.trim().length > 0 &&
      w.practiceTask.length <= 800 &&
      Array.isArray(w.resourceIds) &&
      w.resourceIds.length > 0 &&
      w.resourceIds.length <= 4 &&
      w.resourceIds.every(
        (id: unknown) => typeof id === "string" && allowed.has(id),
      ) &&
      Number.isFinite(w.estimatedHours) &&
      w.estimatedHours > 0 &&
      w.estimatedHours <= input.hours,
  );
}
