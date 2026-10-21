export const categories = ["Technology", "Sports", "Culture"] as const;

export type ClubCategory = (typeof categories)[number];

export type Club = {
  id: string;
  name: string;
  category: ClubCategory;
  tagline: string;
  description: string;
  activities: string[];
  meeting: string;
  location: string;
  accent: string;
};

export const clubs: Club[] = [
  {
    id: "ai",
    name: "AI",
    category: "Technology",
    tagline: "Models, papers, and small projects you can explain.",
    description:
      "AI Club is for students who want practice beyond a single assignment. Members work through machine-learning basics, try short projects, and talk about how a model was trained and where it fails.",
    activities: [
      "Weekly tutorial or paper discussion",
      "Beginner onboarding for notebooks",
      "End-of-term project showcase",
    ],
    meeting: "Wednesdays, 17:30–19:00",
    location: "MUICT Lab 3",
    accent: "#4f46e5",
  },
  {
    id: "dev",
    name: "Dev",
    category: "Technology",
    tagline: "Ship software with a team, then review it together.",
    description:
      "Dev Club is a workshop for web and backend practice. Members pair on small products, read each other's pull requests, and learn the tools that show up in internships.",
    activities: [
      "Weeknight hack sessions",
      "Code-review circle",
      "Open-source contribution hour",
    ],
    meeting: "Thursdays, 18:00–20:00",
    location: "MUICT co-working space",
    accent: "#0f766e",
  },
  {
    id: "iot",
    name: "IoT",
    category: "Technology",
    tagline: "Sensors, boards, and devices that react to the room.",
    description:
      "IoT Club builds prototypes you can hold. Members learn microcontrollers, simple circuits, and how a device sends readings to a small backend.",
    activities: [
      "Hardware workshop for new members",
      "Prototype night with club kits",
      "Demo day at the end of term",
    ],
    meeting: "Tuesdays, 17:00–19:00",
    location: "MUICT maker room",
    accent: "#0284c7",
  },
  {
    id: "cyber",
    name: "Cyber",
    category: "Technology",
    tagline: "Security fundamentals, practiced on club-owned labs.",
    description:
      "Cyber Club is a study group for security fundamentals. Members discuss threats, passwords, and network hygiene, and practice only on club-owned labs and licensed challenges.",
    activities: [
      "Weekly security briefing",
      "Guided defensive lab on club machines",
      "Guest talk from a practitioner",
    ],
    meeting: "Fridays, 17:30–19:30",
    location: "MUICT Lab 2",
    accent: "#b45309",
  },
  {
    id: "badminton",
    name: "Badminton",
    category: "Sports",
    tagline: "Rallies for first-time players and regulars.",
    description:
      "Badminton Club keeps courts busy after class. Sessions mix short drills with friendly games, and the club joins inter-faculty fixtures when enough members can play.",
    activities: [
      "Serve and footwork drills",
      "Rotating doubles games",
      "Faculty fixture practice",
    ],
    meeting: "Mondays and Thursdays, 18:00–20:00",
    location: "University gym, court 2",
    accent: "#15803d",
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    category: "Sports",
    tagline: "Short sets, fast points, and a spare paddle if you need one.",
    description:
      "Table Tennis Club runs informal ladders through the term. New players get a coaching table, and everyone else rotates partners.",
    activities: ["Beginner coaching table", "Ladder matches", "Friendly fixtures"],
    meeting: "Wednesdays, 18:00–20:00",
    location: "University sports hall",
    accent: "#e11d48",
  },
  {
    id: "japanese-society",
    name: "Japanese Society",
    category: "Culture",
    tagline: "Conversation practice, films, and campus culture nights.",
    description:
      "Japanese Society welcomes language learners and anyone curious about Japan. Meetings mix speaking practice with film, food, and festival planning.",
    activities: [
      "Leveled conversation tables",
      "Film night once a month",
      "Culture workshop",
    ],
    meeting: "Fridays, 16:30–18:00",
    location: "MUICT seminar room B",
    accent: "#be123c",
  },
  {
    id: "board-game",
    name: "Board Game",
    category: "Culture",
    tagline: "A teaching table, then a longer game if you want one.",
    description:
      "Board Game Club keeps a shelf of games that finish in an evening. Hosts teach the rules, and new members can sit down without bringing anything.",
    activities: [
      "Teaching games for newcomers",
      "Strategy table for longer plays",
      "Member game swap",
    ],
    meeting: "Saturdays, 13:00–17:00",
    location: "MUICT student lounge",
    accent: "#7c3aed",
  },
  {
    id: "media",
    name: "Media and Entertainment",
    category: "Culture",
    tagline: "Photos, short videos, and coverage of campus events.",
    description:
      "Media and Entertainment Club tells stories from faculty life. Members practice shooting and editing, then cover club fairs, shows, and talks.",
    activities: [
      "Camera and editing workshop",
      "Event coverage crew",
      "Term screening of member work",
    ],
    meeting: "Tuesdays, 18:00–20:00",
    location: "MUICT studio",
    accent: "#c2410c",
  },
  {
    id: "speakers",
    name: "Speakers",
    category: "Culture",
    tagline: "Short talks, honest feedback, and practice for the real presentation.",
    description:
      "Speakers Club is a public-speaking circle. Members give short talks, rehearse class presentations, and practice answering questions without rushing.",
    activities: [
      "Two-minute talks",
      "Slide rehearsal with feedback",
      "Interview-pitch practice",
    ],
    meeting: "Mondays, 17:00–18:30",
    location: "MUICT seminar room A",
    accent: "#1d4ed8",
  },
];

export function getClub(id: string): Club | undefined {
  return clubs.find((club) => club.id === id);
}

export function clubIndex(id: string): number {
  return clubs.findIndex((club) => club.id === id);
}
