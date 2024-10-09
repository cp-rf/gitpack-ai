'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import fetchJson, {FetchError} from './lib/fetchJson';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Repository {
  // Define the structure of a repository object
  url: string;
  full_name: string;
  description: string;
  private: boolean;
}

export default function Home() {
    const [repos, setRepos] = useState<Repository[]>([]);

    useEffect(() => {
        getGithubRepos();
    }, []);

    const getGithubRepos = async () => {
        try {
            const repositories = await fetchJson<Repository[]>('/api/github/repos?is_app_installed=1');
            setRepos(repositories);
        } catch (error) {
            if (error instanceof FetchError) {
                console.error('Error fetching GitHub repositories:', error.data);
            } else {
                console.error('Error fetching GitHub repositories:', error);
            }
            // Handle the error appropriately in your UI
        }
    }

    return (
    <ProtectedRoute>
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Repositories</h1>
                    <div className="mt-4 flex justify-end">
                    <a
                        href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_HANDLE}/installations/new`}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                            Add Repository
                        </a>
                    </div>
                </div>
            </div>
        </header>
        <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <ul role="list" className="divide-y divide-gray-100">
                    <li className="flex justify-between gap-x-6 py-3 px-5 mb-5 border-b border-gray-200 text-blue-700">
                        <div className="flex min-w-0 gap-x-4">
                            <h4 className='text-sm font-semibold'>Repository</h4>
                        </div>
                        <div className="flex items-center mr-3">
                            <h4 className='text-sm font-semibold'>Status</h4>
                        </div>
                    </li>
                {repos.map((repo) => (
                    <li key={repo.url} className="flex justify-between gap-x-6 py-5 px-5 mb-3 rounded-lg border border-gray-200 hover:cursor-pointer hover:bg-gray-100">
                        <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{repo.full_name}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{repo.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center mr-5">
                            {!repo.private ? (
                                <div className="flex items-center">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                    </li>
                ))}
                </ul>
            </div>
        </main>
    </ProtectedRoute>
  )
}
