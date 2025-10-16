import AgentForm from "./component/agent-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Agent Interface
        </h1>
        <AgentForm />
      </div>
    </div>
  );
}
