import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  MessageSquare, 
  Plus, 
  ArrowLeft,
  Filter,
  ThumbsUp,
  Reply,
  Pin,
  Users,
  TrendingUp,
  HelpCircle,
  BookOpen,
  Heart,
  Calendar,
  User
} from 'lucide-react';
import { CommunityPost, CommunityReply } from '@/types';
import { storageUtils } from '@/utils/localStorage';

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as CommunityPost['category'],
    tags: [] as string[]
  });
  const [newReply, setNewReply] = useState({
    content: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory]);

  const loadPosts = () => {
    const allPosts = storageUtils.getCommunityPosts();
    
    // Add some sample posts if none exist
    if (allPosts.length === 0) {
      const samplePosts: CommunityPost[] = [
        {
          id: '1',
          title: 'Tips for SNAP Application Success',
          content: 'I recently got approved for SNAP benefits and wanted to share some tips that helped me through the process. Make sure to have all your documents ready before applying, and don\'t hesitate to call the office if you have questions. The staff was very helpful!',
          authorId: 'user-1',
          authorName: 'Sarah M.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'application-help',
          tags: ['SNAP', 'tips', 'success'],
          replies: [],
          helpfulCount: 12,
          isPinned: true
        },
        {
          id: '2',
          title: 'Housing Assistance Programs in Detroit',
          content: 'Looking for information about housing assistance programs. I\'m currently facing eviction and need help finding resources. Has anyone had experience with emergency rental assistance programs?',
          authorId: 'user-2',
          authorName: 'Mike T.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'general',
          tags: ['housing', 'rental-assistance', 'emergency'],
          replies: [
            {
              id: 'reply-1',
              postId: '2',
              content: 'I used the Detroit Emergency Rental Assistance Program last year. They helped me catch up on rent when I lost my job. The application process was straightforward and they responded quickly.',
              authorId: 'user-3',
              authorName: 'Jennifer L.',
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              helpfulCount: 8,
              isAcceptedAnswer: true
            }
          ],
          helpfulCount: 5,
          isPinned: false
        },
        {
          id: '3',
          title: 'Success Story: How WIC Helped My Family',
          content: 'I want to share how the WIC program has been a lifesaver for my family. With two young children, the nutritional support and breastfeeding guidance has been invaluable. The staff at our local WIC office is amazing!',
          authorId: 'user-4',
          authorName: 'Maria R.',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          category: 'success-story',
          tags: ['WIC', 'nutrition', 'family'],
          replies: [],
          helpfulCount: 15,
          isPinned: false
        }
      ];
      
      samplePosts.forEach(post => storageUtils.saveCommunityPost(post));
    }
    
    const updatedPosts = storageUtils.getCommunityPosts();
    setPosts(updatedPosts);
  };

  const filterPosts = () => {
    let filtered = posts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Sort by pinned first, then by helpful count, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.helpfulCount !== b.helpfulCount) return b.helpfulCount - a.helpfulCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setFilteredPosts(filtered);
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      authorId: 'user-' + Date.now(),
      authorName: 'Community Member',
      createdAt: new Date().toISOString(),
      category: newPost.category,
      tags: newPost.tags,
      replies: [],
      helpfulCount: 0,
      isPinned: false
    };

    storageUtils.saveCommunityPost(post);
    setNewPost({ title: '', content: '', category: 'general', tags: [] });
    setIsNewPostDialogOpen(false);
    loadPosts();
  };

  const handleSubmitReply = () => {
    if (!selectedPost || !newReply.content.trim()) return;

    const reply: CommunityReply = {
      id: Date.now().toString(),
      postId: selectedPost.id,
      content: newReply.content.trim(),
      authorId: 'user-' + Date.now(),
      authorName: 'Community Member',
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      isAcceptedAnswer: false
    };

    storageUtils.addCommunityReply(selectedPost.id, reply);
    setNewReply({ content: '' });
    setIsReplyDialogOpen(false);
    setSelectedPost(null);
    loadPosts();
  };

  const handleHelpful = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, helpfulCount: post.helpfulCount + 1 };
      }
      return post;
    });
    
    updatedPosts.forEach(post => storageUtils.saveCommunityPost(post));
    setPosts(updatedPosts);
  };

  const getCategoryIcon = (category: CommunityPost['category']) => {
    switch (category) {
      case 'application-help':
        return <HelpCircle className="h-4 w-4" />;
      case 'documentation':
        return <BookOpen className="h-4 w-4" />;
      case 'success-story':
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: CommunityPost['category']) => {
    switch (category) {
      case 'application-help':
        return 'warning';
      case 'documentation':
        return 'secondary';
      case 'success-story':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Community Forum</h1>
              <p className="text-muted-foreground">Connect with others and share experiences</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Helpful Votes</p>
                  <p className="text-2xl font-bold">
                    {posts.reduce((sum, post) => sum + post.helpfulCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General Discussion</SelectItem>
                <SelectItem value="application-help">Application Help</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="success-story">Success Stories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={newPost.category} 
                    onValueChange={(value: CommunityPost['category']) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Discussion</SelectItem>
                      <SelectItem value="application-help">Application Help</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="success-story">Success Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Content *</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={6}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitPost} className="flex-1" disabled={!newPost.title.trim() || !newPost.content.trim()}>
                    Create Post
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewPostDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={`transition-all hover:shadow-md ${post.isPinned ? 'border-primary bg-primary/5' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge variant={getCategoryColor(post.category)} className="flex items-center gap-1">
                        {getCategoryIcon(post.category)}
                        {post.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Reply className="h-3 w-3" />
                        {post.replies.length} replies
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(post.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {post.helpfulCount}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post);
                        setIsReplyDialogOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reply to Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPost && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-1">{selectedPost.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{selectedPost.content}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Your Reply *</label>
                <Textarea
                  value={newReply.content}
                  onChange={(e) => setNewReply({ content: e.target.value })}
                  placeholder="Write your reply..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitReply} className="flex-1" disabled={!newReply.content.trim()}>
                  Post Reply
                </Button>
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}