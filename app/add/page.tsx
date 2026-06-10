export default function AddEntry() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Add Volunteer Entry
      </h1>

      <form className="flex flex-col gap-4 max-w-md">
        <input
          placeholder="Organization Name"
          className="border p-2 rounded"
        />

        <input
          placeholder="Hours"
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded"
        />

        <button
          className="bg-black text-white p-2 rounded"
        >
          Save
        </button>
      </form>
    </main>
  );
}