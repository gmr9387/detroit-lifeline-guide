import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  Flag, 
  MoreHorizontal,
  Send,
  Edit,
  Trash2,
  User,
  Clock,
  Eye,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  views: number;
  replies: ForumReply[];
  isPinned?: boolean;
  isLocked?: boolean;
}

interface ForumReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  isSolution?: boolean;
  parentId?: string;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

const categories: ForumCategory[] = [
  { id: 'general', name: 'General Discussion', description: 'General topics and questions', postCount: 45, color: 'bg-blue-500' },
  { id: 'housing', name: 'Housing Support', description: 'Housing assistance and resources', postCount: 23, color: 'bg-green-500' },
  { id: 'employment', name: 'Employment', description: 'Job opportunities and career advice', postCount: 31, color: 'bg-purple-500' },
  { id: 'healthcare', name: 'Healthcare', description: 'Health and medical resources', postCount: 18, color: 'bg-red-500' },
  { id: 'education', name: 'Education', description: 'Educational programs and scholarships', postCount: 27, color: 'bg-yellow-500' },
  { id: 'success-stories', name: 'Success Stories', description: 'Share your success stories', postCount: 12, color: 'bg-pink-500' },
];

export function CommunityForum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'most-replies'>('recent');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  // Mock data
  useEffect(() => {
    const mockPosts: ForumPost[] = [
      {
        id: '1',
        title: 'How to apply for SNAP benefits?',
        content: 'I\'m new to Detroit and need help understanding the SNAP application process. Can anyone share their experience?',
        author: { id: 'user1', name: 'Sarah Johnson' },
        category: 'general',
        tags: ['snap', 'benefits', 'application'],
        createdAt: '2024-01-15T10:30:00Z',
        likes: 12,
        dislikes: 1,
        views: 89,
        replies: [
          {
            id: 'reply1',
            content: 'I applied for SNAP last month! Here\'s what you need to know...',
            author: { id: 'user2', name: 'Mike Chen' },
            createdAt: '2024-01-15T11:00:00Z',
            likes: 8,
            dislikes: 0,
            isSolution: true,
          }
        ],
        isPinned: true,
      },
      {
        id: '2',
        title: 'Success: Got approved for housing assistance!',
        content: 'After 6 months of trying, I finally got approved for housing assistance. Here\'s my story...',
        author: { id: 'user3', name: 'Maria Rodriguez' },
        category: 'success-stories',
        tags: ['housing', 'success', 'assistance'],
        createdAt: '2024-01-14T15:20:00Z',
        likes: 25,
        dislikes: 0,
        views: 156,
        replies: [],
      },
    ];
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case 'most-replies':
        return b.replies.length - a.replies.length;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleCreatePost = (postData: { title: string; content: string; category: string; tags: string[] }) => {
    const newPost: ForumPost = {
      id: crypto.randomUUID(),
      title: postData.title,
      content: postData.content,
      author: { id: user?.id || '', name: `${user?.firstName} ${user?.lastName}` },
      category: postData.category,
      tags: postData.tags,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      views: 0,
      replies: [],
    };
    setPosts([newPost, ...posts]);
    setIsCreatePostOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleDislike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Connect with others and share experiences</p>
        </div>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <CreatePostForm onSubmit={handleCreatePost} onCancel={() => setIsCreatePostOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="most-replies">Most Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => (
          <Card 
            key={category.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted",
              selectedCategory === category.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={cn("w-8 h-8 rounded-full mx-auto mb-2", category.color)} />
              <h3 className="font-medium text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.postCount} posts</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {sortedPosts.map(post => (
          <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author.name}</span>
                      {post.isPinned && <Badge variant="secondary" className="text-xs">Pinned</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleDislike(post.id)}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{post.dislikes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{post.replies.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{post.views}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedPosts.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => setIsCreatePostOpen(true)}>
              Create First Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface CreatePostFormProps {
  onSubmit: (data: { title: string; content: string; category: string; tags: string[] }) => void;
  onCancel: () => void;
}

function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          rows={6}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., housing, assistance, detroit"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
    </form>
  );
}