import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constant.jsx";
import { Link, router } from "@inertiajs/react";

export default function TaskTable({ tasks, queryParams = null, hideProjectColumn = false }) {
    // cek apabila queryParams memiliki nilai atau tidak, jika tidak akan menjadi empty object {}
    // Secara default queryParams berisi null
    queryParams = queryParams || {}

    // Method untuk handling pencarian
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('task.index'), queryParams);
    };

    //handling tombol enter jika menekan tombol enter akan menjalankan method searchFieldChanged()
    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;

        searchFieldChanged(name, e.target.value);
    };

    //handling request sort
    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }

        router.get(route('task.index'), queryParams);
    }

    const deleteTask = (task) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        router.delete(route("task.destroy", { encrypted_id: task.encrypted_id }));
    }


    return (
        <>
            <div className="flex flex-row  mb-3">
                <div className="flex flex-row items-center mr-2">
                    <p className="text-sm w-full">Search By Name  :</p>
                    <TextInput
                        className="w-full text-sm"
                        defaultValue={queryParams.name}
                        placeholder="Task Name"
                        onBlur={e => searchFieldChanged('name', e.target.value)}
                        onKeyPress={e => onKeyPress('name', e)}
                    />
                </div>
                <div className="flex flex-row items-center mr-2 ml-2">
                    <p className="text-sm w-full">Sort By Status  :</p>
                    <SelectInput
                        className="w-full text-sm"
                        defaultValue={queryParams.status}
                        onChange={e => searchFieldChanged('status', e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </SelectInput>
                </div>
            </div>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                name="id"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                ID
                            </TableHeading>
                            <th className="px-3 py-3">Image</th>
                            {!hideProjectColumn && <th className="px-3 py-3">Project Name</th>}
                            <TableHeading
                                name="name"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Name
                            </TableHeading>
                            <TableHeading
                                name="status"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Status
                            </TableHeading>
                            <TableHeading
                                name="created_at"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Created Date
                            </TableHeading>
                            <TableHeading
                                name="due_date"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Due Date
                            </TableHeading>
                            <th className="px-3 py-3">Created By</th>
                            <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.data.map((task) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                                <td className="px-3 py-2">{task.id}</td>
                                <td className="px-3 py-2">
                                    <img src={task.image_path} style={{ width: 60 }} />
                                </td>
                                {!hideProjectColumn && <td className="px-3 py-2">{task.project.name}</td>}
                                <td className="px-3 py-2">
                                    <Link className="hover:underline hover:font-bold" href={route("task.show", { encrypted_id: task.encrypted_id })}>
                                        {task.name}
                                    </Link>
                                </td>
                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white " + TASK_STATUS_CLASS_MAP[task.status]}>{TASK_STATUS_TEXT_MAP[task.status]}</span></td>
                                <td className="px-3 py-2">{task.created_at}</td>
                                <td className="px-3 py-2">{task.due_date}</td>
                                <td className="px-3 py-2">{task.created_by.name}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <Link href={route('task.edit', { encrypted_id: task.encrypted_id })} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">Edit</Link>
                                    <button onClick={(e) => deleteTask(task)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={tasks.meta.links} />
        </>
    )
}