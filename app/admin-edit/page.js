import AdminDataEditor from '@/components/AdminDataEditor';

export default async function AdminPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Data Editor</h1>
            <AdminDataEditor />
        </div>
    );
}