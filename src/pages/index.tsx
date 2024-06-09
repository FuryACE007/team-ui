import Head from "next/head";
import { useRef, useState } from "react";
import axios from "axios";

interface Candidate {
  name: string;
  country: string | null;
  availability: string;
  skills: string[];
  partTimeSalaryCurrency: string;
  partTimeSalary: string;
  fullTimeSalaryCurrency: string;
  fullTimeSalary: string;
}

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const queryHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const inputSentence = inputRef.current?.value || ""; // get the value of the input box

      const skillsMatch = inputSentence.match(/with ([\w\s,]+) knowledge/i);
      const skills = skillsMatch
        ? skillsMatch[1].replace(/\s/g, "").split(",")
        : [];

      const budgetMatch = inputSentence.match(/budget is (\d+)/i);
      const budget = budgetMatch ? budgetMatch[1] : "";

      const partTimeMatch = inputSentence.match(/part[-\s]*time/i);
      const partTime = partTimeMatch ? "true" : "false";

      const fullTimeMatch = inputSentence.match(/full[-\s]*time/i);
      const fullTime = fullTimeMatch ? "true" : "false";

      const response = await axios.get<Candidate[]>(
        `http://localhost:3000/candidates?partTime=${partTime}&fullTime=${fullTime}&budget=${budget}&skills=${skills.join(
          ","
        )}&page=1&limit=10`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-900 flex flex-col justify-between">
        {/* Cards go here */}
        <div className="grid grid-cols-2 gap-8 m-4 p-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            candidates.map((candidate: Candidate, index: number) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {candidate.name}
                </h2>
                <p className="text-gray-600">{candidate.availability}</p>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800">Skills</h3>
                  <ul className="list-disc list-inside">
                    {candidate.skills.map((skill, index) => (
                      <li key={index} className="text-gray-600">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800">Salary</h3>
                  {candidate.partTimeSalary && (
                    <p className="text-gray-600">
                      Part time salary {candidate.partTimeSalaryCurrency}{" "}
                      {candidate.partTimeSalary}
                    </p>
                  )}
                  {candidate.fullTimeSalary && (
                    <p className="text-gray-600">
                      Full time salary {candidate.fullTimeSalaryCurrency}{" "}
                      {candidate.fullTimeSalary}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="bg-white p-4">
          <form className="flex items-center">
            <input
              className="flex-grow rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
              placeholder="Write a message..."
              ref={inputRef}
              type="text"
            />
            <button
              className="px-8 rounded-r-lg bg-blue-400 text-gray-800 font-bold p-4 uppercase border-blue-500 border-t border-b border-r"
              onClick={queryHandler}
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
