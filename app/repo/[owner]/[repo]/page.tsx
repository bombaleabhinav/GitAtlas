import Link from "next/link";
import CommitGraph from "@/components/CommitGraph";
import { getBranches, getCommits, toClientError } from "@/lib/github";
import { isValidRepoPart } from "@/lib/repo";

type RepoPageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export default async function RepoPage({ params }: RepoPageProps) {
  const { owner, repo } = await params;

  if (!isValidRepoPart(owner) || !isValidRepoPart(repo)) {
    return <RepoError message="Invalid repository path." />;
  }

  try {
    const branches = await getBranches(owner, repo);
    const initialBranch = branches[0]?.name ?? "";
    const commits = initialBranch ? await getCommits(owner, repo, initialBranch, 25) : [];

    return (
      <CommitGraph
        owner={owner}
        repo={repo}
        initialBranches={branches}
        initialCommits={commits}
        initialBranch={initialBranch}
      />
    );
  } catch (error) {
    const clientError = toClientError(error);
    return <RepoError message={clientError.error} />;
  }
}

function RepoError({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">GitAtlas</p>
        <h1 className="text-2xl font-medium">Unable to load repository</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-300">{message}</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-white bg-white px-5 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          Back
        </Link>
      </section>
    </main>
  );
}
