"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArticleType, Role } from "@prisma/client";
import { Edit, Trash2, Eye, Ban, MessageSquare } from "lucide-react";
import {
  getAllArticles,
  deleteArticle,
  updateArticle,
} from "@/actions/articles";
import { getAllUsers, updateUserRestriction } from "@/actions/admin/index";
import { getTimeDifference } from "@/lib/utils";

interface Article {
  id: number;
  title: string;
  slug: string;
  type: ArticleType;
  content: string;
  imageUrls: string[];
  videoUrl?: string | null;
  videoStartTime?: number | null;
  source: string;
  author: string;
  publishedAt: Date;
  createdAt: Date;
  likeCount: number;
  submittedBy: {
    id: number;
    name: string;
    email: string;
    // isRestricted: boolean; // Temporarily commented out until Prisma client is regenerated
  };
  _count: {
    comments: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  // isRestricted: boolean; // Temporarily commented out until Prisma client is regenerated
  createdAt: Date;
  _count: {
    comments: number;
  };
}

export default function AdminArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);

  // Check admin access
  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }
  }, [session, status, router]);

  // Fetch data
  useEffect(() => {
    if ((session?.user as { role?: string })?.role === "ADMIN") {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, usersData] = await Promise.all([
        getAllArticles(),
        getAllUsers(),
      ]);

      if (articlesData.success && articlesData.data) {
        setArticles(articlesData.data);
      }

      if (usersData.success && usersData.data) {
        setUsers(usersData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const result = await deleteArticle(articleId);
      if (result.success) {
        toast.success("Article deleted successfully");
        fetchData();
      } else {
        toast.error(result.error || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const handleUpdateArticle = async (article: Article) => {
    try {
      const result = await updateArticle(article.id, {
        title: article.title,
        content: article.content,
        type: article.type,
        videoUrl: article.videoUrl,
        videoStartTime: article.videoStartTime,
        imageUrls: article.imageUrls,
        source: article.source,
        author: article.author,
      });

      if (result.success) {
        toast.success("Article updated successfully");
        setShowEditDialog(false);
        setEditingArticle(null);
        fetchData();
      } else {
        toast.error(result.error || "Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article");
    }
  };

  const handleToggleUserRestriction = async (
    userId: number,
    isRestricted: boolean
  ) => {
    try {
      const result = await updateUserRestriction(userId, isRestricted);
      if (result.success) {
        toast.success(
          `User ${isRestricted ? "restricted" : "unrestricted"} successfully`
        );
        fetchData();
      } else {
        toast.error(result.error || "Failed to update user restriction");
      }
    } catch (error) {
      console.error("Error updating user restriction:", error);
      toast.error("Failed to update user restriction");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUserDialog(true)}>
            <Ban className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </div>

      {/* Articles Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Articles Management ({articles.length} articles)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-xs truncate">
                      {article.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {article.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{article.author}</span>
                        <span className="text-sm text-gray-500">
                          {article.submittedBy.name}
                        </span>
                        {/* Temporarily commented out until Prisma client is regenerated */}
                        {/* {article.submittedBy.isRestricted && (
                          <Badge variant="destructive" className="text-xs">
                            Restricted
                          </Badge>
                        )} */}
                      </div>
                    </TableCell>
                    <TableCell>{article._count.comments}</TableCell>
                    <TableCell>{article.likeCount}</TableCell>
                    <TableCell>
                      {getTimeDifference(article.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingArticle(article);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/article/${article.slug}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          {editingArticle && (
            <EditArticleForm
              article={editingArticle}
              onSave={handleUpdateArticle}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingArticle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Management Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Management</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user._count.comments}</TableCell>
                    <TableCell>
                      {/* Temporarily commented out until Prisma client is regenerated */}
                      {/* {user.isRestricted ? (
                        <Badge variant="destructive">Restricted</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )} */}
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleToggleUserRestriction(user.id, true)
                        }
                      >
                        Restrict
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EditArticleFormProps {
  article: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

function EditArticleForm({ article, onSave, onCancel }: EditArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article.title,
    content: article.content,
    type: article.type,
    videoUrl: article.videoUrl || "",
    videoStartTime: article.videoStartTime || 0,
    source: article.source,
    author: article.author,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...article,
      ...formData,
      videoStartTime: formData.videoStartTime || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as ArticleType })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ArticleType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.type === "YOUTUBE" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <Input
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              placeholder="YouTube URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time (seconds)
            </label>
            <Input
              type="number"
              min="0"
              value={formData.videoStartTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  videoStartTime: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Source</label>
        <Input
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Author</label>
        <Input
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
