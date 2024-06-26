import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

import TaskTable from "./TaskTable";

export default function Index({ auth, tasks, queryParams = null, success, error }) {

    const [isVisible, setIsVisible] = useState(true);
    const hideAlert = () => {
        setIsVisible(false);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tasks</h2>
                    <Link href={route('task.create')} className="bg-blue-700 py-1 px-3 text-white rounded shadow transition-all hover:bg-blue-900"> Add Task</Link>
                </div>
            }
        >
            <Head title="Tasks" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {
                        success && (
                            <div
                                className={`bg-emerald-500 py-2 px-4 text-white mb-4 rounded flex justify-between ${isVisible ? '' : 'hidden'}`}
                                role="alert"
                            >
                                <div className="tex-white font-bold">{success}</div>
                                <div className="text-white cursor-pointer hover:text-gray-900 text-xl" onClick={hideAlert}>&times;</div>
                            </div>
                        )
                    }
                    {
                        error && (
                            <div
                                className={`bg-red-500 py-2 px-4 text-white mb-4 rounded flex justify-between ${isVisible ? '' : 'hidden'}`}
                                role="alert"
                            >
                                <div className="tex-white font-bold">{error}</div>
                                <div className="text-white cursor-pointer hover:text-gray-900 text-xl" onClick={hideAlert}>&times;</div>
                            </div>
                        )
                    }
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Tabel untuk data task yang didapat dari controller task*/}
                            <TaskTable tasks={tasks} queryParams={queryParams} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
} 