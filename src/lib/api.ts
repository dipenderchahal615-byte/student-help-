export async function generateNotes(topic: string, course: string, difficulty: string, language: string, type: string) {
  const res = await fetch("/api/ai/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, course, difficulty, language, type }),
  });
  if (!res.ok) throw new Error("Failed to generate notes");
  return res.json();
}

export async function generateRoadmap(career: string) {
  const res = await fetch("/api/ai/roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ career }),
  });
  if (!res.ok) throw new Error("Failed to generate roadmap");
  return res.json();
}

export async function getInterviewQuestion(field: string, level: string) {
  const res = await fetch("/api/ai/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, level }),
  });
  if (!res.ok) throw new Error("Failed to generate question");
  return res.json();
}

export async function evaluateInterviewAnswer(question: string, answer: string) {
  const res = await fetch("/api/ai/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error("Failed to evaluate answer");
  return res.json();
}
