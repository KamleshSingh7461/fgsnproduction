'use client';

import { useState } from 'react';
import { updateUser, deleteUser } from '@/lib/actions';
import { Trash2, Mail, Edit2, Check, X, Shield } from 'lucide-react';

export function UserList({ users }: { users: any[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="space-y-3">
            {users.map((user) => (
                <UserRow
                    key={user.id}
                    user={user}
                    isEditing={editingId === user.id}
                    onEdit={() => setEditingId(user.id)}
                    onCancel={() => setEditingId(null)}
                    onSave={() => setEditingId(null)}
                />
            ))}
        </div>
    );
}

function UserRow({ user, isEditing, onEdit, onCancel, onSave }: any) {
    if (isEditing) {
        return (
            <form action={async (formData) => {
                await updateUser(user.id, formData);
                onSave();
            }} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-zinc-900/80 rounded-2xl border border-indigo-500/50 shadow-lg shadow-indigo-500/10">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <input
                        name="name"
                        defaultValue={user.name}
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white outline-none focus:border-indigo-500"
                        placeholder="Name"
                    />
                    <input
                        name="email"
                        defaultValue={user.email}
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white outline-none focus:border-indigo-500"
                        placeholder="Email"
                    />
                    <select
                        name="role"
                        defaultValue={user.role}
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white outline-none focus:border-indigo-500 uppercase"
                    >
                        <option value="ADMIN">ADMIN OFFICER</option>
                        <option value="EVENT_MANAGER">TACTICAL MANAGER</option>
                        <option value="SCORER">FIELD SCORER</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="p-2 text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 rounded">
                        <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={onCancel} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-indigo-400">
                    {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                    <div className="font-black text-white flex items-center gap-2">
                        {user.name}
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border ${user.role === 'SUPER_ADMIN' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
                            user.role === 'ADMIN' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' :
                                'bg-zinc-800 border-zinc-700 text-zinc-500'
                            }`}>
                            {user.role === 'SUPER_ADMIN' ? 'GLOBAL ADMIN' :
                                user.role === 'ADMIN' ? 'ADMIN OFFICER' :
                                    user.role === 'EVENT_MANAGER' ? 'TACTICAL MANAGER' :
                                        user.role === 'SCORER' ? 'FIELD SCORER' : user.role}
                        </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold">
                        <Mail className="w-3 h-3" /> {user.email}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {user.role !== 'SUPER_ADMIN' && (
                    <>
                        <button onClick={onEdit} className="p-2 text-zinc-600 hover:text-indigo-400 transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <form action={async () => { await deleteUser(user.id); }}>
                            <button className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
