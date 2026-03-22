"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import React from 'react'
import { Button } from "@/components/ui/button";

const PostPage = () => {
    const [locale, setLocale] = useState("tr");
    const [posts, setPosts] = useState([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/admin/posts?locale=${locale}`)
            .then((r) => r.json())
            .then((d) => setPosts(d))
    }, [locale])

    async function handleDelete(id: string) {
        const ok = window.confirm("Bu yazıyı silmek istediğine emin misin?");
        if (!ok) return;

        try {
            setDeletingId(id);
            const res = await fetch(`/api/admin/posts/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!res.ok) {
                alert("Silme sırasında hata oluştu.");
                return;

            }
            setPosts((prev) => prev.filter((p) => p.id !== id));


        } catch (error) {
            alert("Silme sırasında beklenmeyen bir hata oluştu.");

        }
        finally {
            setDeletingId(null)
        }



    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Posts</h1>

                <Link
                    href="/admin/posts/create"
                    className="px-3 py-2 bg-black text-white rounded"
                >
                    + New Post
                </Link>

            </div>
            <div className='flex gap-4 mb-4'>
                <Button
                    className={locale === "tr"
                        ? "underline font-semibold"
                        : ""
                    }

                    onClick={() => setLocale("tr")}
                >
                    TR

                </Button>

                <Button
                    className={locale === "en"
                        ? "underline font-semibold"
                        : ""
                    }

                    onClick={() => setLocale("en")}
                >
                    EN

                </Button>

            </div>
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">Title</th>
                        <th>Category</th>
                        <th>Published</th>
                        <th>Date</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts?.map((p) => (
                        <tr key={p.id} className="border-b">
                            <td className="py-2">{p.title}</td>
                            <td>{p.category}</td>
                            <td>{p.published ? "Yes" : "No"}</td>
                            <td>{new Date(p.created_at).toLocaleDateString()}</td>
                            <td className="text-right">
                                    <Link
                                        href={`/admin/posts/${p.id}`}
                                        className="text-blue-600 underline"
                                    >
                                        Edit
                                    </Link>

                                    <Button
                                        variant={"destructive"}
                                        size={"sm"}
                                        className="ml-4"
                                        disabled={deletingId === p.id}
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        {deletingId === p.id ? "Deleting.." : "Delete"}
                                    </Button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


        </div>
    )
}

export default PostPage