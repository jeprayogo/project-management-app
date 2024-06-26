import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function Index({ auth, users, queryParams = null, success }) {
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

        router.get(route('user.index'), queryParams);
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

        router.get(route('user.index'), queryParams);
    }

    const deleteUser = (user) => {

        if (auth.user.id === user.id) {
            alert('You cannot delete yourself');
            return;
        } else {
            if (!window.confirm('Are you sure you want to delete this user?')) {
                return;
            }
            router.delete(route("user.destroy", user.id));
        }

    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Users</h2>
                    <Link href={route('user.create')} className="bg-blue-700 py-1 px-3 text-white rounded shadow transition-all hover:bg-blue-900"> Add User</Link>
                </div>
            }
        >
            <Head title="Users" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white mb-4 rounded">{success}</div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-row  mb-3">
                                <div className="flex flex-row items-center mr-2">
                                    <p className="text-sm w-full">Search By Name  :</p>
                                    <TextInput
                                        className="w-full text-sm"
                                        defaultValue={queryParams.name}
                                        placeholder="User Name"
                                        onBlur={e => searchFieldChanged('name', e.target.value)}
                                        onKeyPress={e => onKeyPress('name', e)}
                                    />
                                </div>
                                <div className="flex flex-row items-center mr-2 ml-2">
                                    <p className="text-sm w-full">Search By Email  :</p>
                                    <TextInput
                                        className="w-full text-sm"
                                        defaultValue={queryParams.email}
                                        placeholder="User Email"
                                        onBlur={e => searchFieldChanged('email', e.target.value)}
                                        onKeyPress={e => onKeyPress('email', e)}
                                    />
                                </div>
                            </div>
                            {/* Tabel untuk data user yang didapat dari controller user*/}
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
                                            <TableHeading
                                                name="name"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Name
                                            </TableHeading>
                                            <TableHeading
                                                name="email"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Email
                                            </TableHeading>
                                            <TableHeading
                                                name="created_at"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Created Date
                                            </TableHeading>

                                            <th className="px-3 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                                                <td className="px-3 py-2">{user.id}</td>
                                                <th className="px-3 py-2 text-gray-100 text-nowrap">
                                                    {user.name}
                                                </th>
                                                <td className="px-3 py-2">{user.email}</td>
                                                <td className="px-3 py-2">{user.created_at}</td>
                                                <td className="px-3 py-2 text-nowrap text-right">
                                                    <Link href={route('user.edit', user.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">Edit</Link>
                                                    <button onClick={(e) => deleteUser(user)} href={route('user.destroy', user.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={users.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
} 