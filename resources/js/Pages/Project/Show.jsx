import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constant.jsx";
import TaskTable from "../Task/TaskTable";

export default function Show({ auth, project, tasks, queryParams }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {`Project "${project.name}"`}
                </h2>
            }
        >
            <Head title={"Project " + project.name} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600 dark:text-gray-100">
                            <div className="grid gap-1 grid-cols-2 mt-2">
                                <div>
                                    <img src={project.image_path} alt="" className="w-full h-72 object-cover" />
                                </div>
                                <div className="grid gap-1 grid-cols-2 mt-2 ml-4">
                                    <div>
                                        <div>
                                            <label className="font-bold text-lg">Project ID</label>
                                            <p className="mt-1">{project.id}</p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="font-bold text-lg">Project Name</label>
                                            <p className="mt-1">{project.name}</p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="font-bold text-lg">Project Status</label>
                                            <p className="mt-1"><span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status]}>{PROJECT_STATUS_TEXT_MAP[project.status]}</span></p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="font-bold text-lg">Created By</label>
                                            <p className="mt-1">{project.created_by.name}</p>
                                        </div>
                                    </div>
                                    <div className="ml-6">
                                        <div>
                                            <label className="font-bold text-lg">Due Date</label>
                                            <p className="mt-1">{project.due_date}</p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="font-bold text-lg">Created Date</label>
                                            <p className="mt-1">{project.created_at}</p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="font-bold text-lg">Updated By</label>
                                            <p className="mt-1">{project.updated_by.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="font-bold font-lg">Project Description</label>
                                <p className="mt-1">{project.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600 dark:text-gray-100">
                            <TaskTable tasks={tasks} queryParams={queryParams} hideProjectColumn={true} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}